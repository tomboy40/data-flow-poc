import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ITService, DataFeed, DataFlow } from '../types/types';
import { ServiceNode } from './ServiceNode';
import { DataFeedEdge } from './DataFeedEdge';

interface FlowDiagramProps {
  services: ITService[];
  feeds: DataFeed[];
  flows: DataFlow[];
  selectedFeedId?: string;
  selectedFlowId?: string;
  selectedServiceId?: string;
}

const nodeTypes = {
  service: ServiceNode,
};

const edgeTypes = {
  default: DataFeedEdge,
  smoothstep: DataFeedEdge,
};

const calculateHorizontalLayout = (services: ITService[], feeds: DataFeed[]) => {
  const positions = new Map<string, { x: number; y: number }>();
  const assigned = new Set<string>();

  // Adjusted layout constants
  const HORIZONTAL_GAP = 300;  // Gap between nodes horizontally
  const VERTICAL_GAP = 100;    // Gap between nodes vertically

  // Start with nodes that have no incoming connections
  const startNodes = services
    .filter(service => !feeds.some(feed => feed.receiverId === service.id))
    .map(service => service.id);

  let currentY = 0;

  const positionNode = (nodeId: string, currentX: number) => {
    if (assigned.has(nodeId)) return;

    positions.set(nodeId, { x: currentX, y: currentY });
    assigned.add(nodeId);

    // Position all receivers of this node
    const receivers = feeds
      .filter(feed => feed.supplierId === nodeId)
      .map(feed => feed.receiverId);

    receivers.forEach((receiverId, index) => {
      positionNode(receiverId, currentX + HORIZONTAL_GAP);
      currentY += VERTICAL_GAP;
    });
  };

  startNodes.forEach(nodeId => {
    positionNode(nodeId, 0);
    currentY += VERTICAL_GAP; // Move down for the next start node
  });

  return positions;
};

const getSmartEdgePoints = (
  sourceNode: Node,
  targetNode: Node
): { sourceHandle: string; targetHandle: string } => {
  // Always prefer right-to-left connections
  return { sourceHandle: 'right', targetHandle: 'left' };
};

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  services,
  feeds,
  flows,
  selectedFeedId,
  selectedFlowId,
  selectedServiceId,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Calculate positions using the horizontal layout
    const nodePositions = calculateHorizontalLayout(services, feeds);

    // Create nodes with calculated positions
    const newNodes: Node[] = services.map(service => {
      const position = nodePositions.get(service.id) || { x: 0, y: 0 };
      return {
        id: service.id,
        type: 'service',
        position,
        data: { 
          label: service.name,
          id: service.id,
          isHighlighted: false
        },
        draggable: true,
      };
    });

    // Determine which feeds to show and highlight
    let relevantFeeds = feeds;
    const highlightedServices = new Set<string>();

    if (selectedServiceId) {
      highlightedServices.add(selectedServiceId);
      relevantFeeds = feeds.filter(
        feed => feed.supplierId === selectedServiceId || feed.receiverId === selectedServiceId
      );
    } else if (selectedFlowId) {
      const selectedFlow = flows.find(f => f.id === selectedFlowId);
      if (selectedFlow) {
        const processFeeds = selectedFlow.feeds
          .map(feedId => feeds.find(f => f.id === feedId))
          .filter((feed): feed is DataFeed => feed !== undefined);
        
        processFeeds.forEach(feed => {
          highlightedServices.add(feed.supplierId);
          highlightedServices.add(feed.receiverId);
        });

        relevantFeeds = processFeeds;
      }
    } else if (selectedFeedId) {
      const selectedFeed = feeds.find(f => f.id === selectedFeedId);
      if (selectedFeed) {
        highlightedServices.add(selectedFeed.supplierId);
        highlightedServices.add(selectedFeed.receiverId);
      }
    }

    // Update node highlighting
    newNodes.forEach(node => {
      const isHighlighted = highlightedServices.size === 0 || highlightedServices.has(node.id);
      node.data.isHighlighted = isHighlighted;
      node.style = { opacity: isHighlighted ? 1 : 0.3 };
    });

    // Create edges with smart connection points
    const newEdges: Edge[] = relevantFeeds.map(feed => {
      return {
        id: feed.id,
        source: feed.supplierId,
        target: feed.receiverId,
        sourceHandle: 'right',
        targetHandle: 'left',
        data: {
          label: feed.name,
          id: feed.id,
          description: feed.description,
          type: feed.type,
          frequency: feed.frequency,
          format: feed.format,
          isHighlighted: selectedFeedId === feed.id,
        },
        type: 'smoothstep',
        animated: selectedFeedId === feed.id,
        style: {
          stroke: selectedFeedId === feed.id ? '#2563eb' : '#94a3b8',
          strokeWidth: selectedFeedId === feed.id ? 3 : 2,
          opacity: selectedFeedId ? (selectedFeedId === feed.id ? 1 : 0.3) : 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: selectedFeedId === feed.id ? '#2563eb' : '#94a3b8',
        },
      };
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [services, feeds, flows, selectedFeedId, selectedFlowId, selectedServiceId]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const newNodes = applyNodeChanges(changes, nds);
        
        // Update edge connections after node movement
        setEdges((eds) => 
          eds.map(edge => {
            const sourceNode = newNodes.find(node => node.id === edge.source);
            const targetNode = newNodes.find(node => node.id === edge.target);
            
            if (sourceNode && targetNode) {
              const smartPoints = getSmartEdgePoints(sourceNode, targetNode);
              return {
                ...edge,
                sourceHandle: smartPoints.sourceHandle,
                targetHandle: smartPoints.targetHandle,
              };
            }
            return edge;
          })
        );

        return newNodes;
      });
    },
    []
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => [
        ...eds,
        {
          ...connection,
          id: `${connection.source}-${connection.target}`,
          type: 'default',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        } as Edge,
      ]);
    },
    []
  );

  return (
    <div className="w-full h-full relative overflow-auto">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        fitView
        fitViewOptions={{ 
          padding: 0.5,
          includeHiddenNodes: true,
          minZoom: 0.2,
          maxZoom: 1.5,
        }}
        defaultViewport={{ 
          x: 0, 
          y: 0, 
          zoom: 0.7
        }}
        minZoom={0.2}
        maxZoom={1.5}
        attributionPosition="bottom-right"
        nodesConnectable={false}
        nodesDraggable={true}
        elementsSelectable={true}
        connectOnClick={false}
        panOnDrag={[1, 2]}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={false}
      >
        <Controls 
          showInteractive={false}
          position="bottom-right"
        />
        <Background />
      </ReactFlow>
    </div>
  );
};
