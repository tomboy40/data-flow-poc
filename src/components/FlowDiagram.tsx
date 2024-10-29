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
    // Add console logs to verify data
    console.log('Services:', services);
    console.log('Feeds:', feeds);
    
    // Calculate positions using the horizontal layout
    const nodePositions = calculateHorizontalLayout(services, feeds);
    console.log('Node Positions:', nodePositions);

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
    console.log('Created Nodes:', newNodes);

    // Determine which services to highlight
    const highlightedServices = new Set<string>();

    if (selectedServiceId) {
      highlightedServices.add(selectedServiceId);
      feeds.filter(
        feed => feed.supplierId === selectedServiceId || feed.receiverId === selectedServiceId
      ).forEach(feed => {
        highlightedServices.add(feed.supplierId);
        highlightedServices.add(feed.receiverId);
      });
    } else if (selectedFlowId) {
      const selectedFlow = flows.find(f => f.id === selectedFlowId);
      if (selectedFlow) {
        selectedFlow.feeds.forEach(feedId => {
          const feed = feeds.find(f => f.id === feedId);
          if (feed) {
            highlightedServices.add(feed.supplierId);
            highlightedServices.add(feed.receiverId);
          }
        });
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

    // Create edges - now using all feeds instead of filtered ones
    const newEdges: Edge[] = feeds.map(feed => {
      const isHighlighted = selectedFeedId === feed.id || 
        (highlightedServices.size > 0 && 
          highlightedServices.has(feed.supplierId) && 
          highlightedServices.has(feed.receiverId));

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
          isHighlighted,
        },
        type: 'smoothstep',
        animated: isHighlighted,
        style: {
          stroke: isHighlighted ? '#2563eb' : '#94a3b8',
          strokeWidth: isHighlighted ? 3 : 2,
          opacity: highlightedServices.size === 0 ? 1 : (isHighlighted ? 1 : 0.3),
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#2563eb' : '#94a3b8',
        },
      };
    });
    console.log('Created Edges:', newEdges);

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

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    // Find all flows that contain feeds connected to this service
    const relatedFeeds = feeds.filter(
      feed => feed.supplierId === node.id || feed.receiverId === node.id
    );
    const relatedFeedIds = new Set(relatedFeeds.map(feed => feed.id));
    
    // Find and highlight flows that contain any of these feeds
    const highlightedServices = new Set<string>();
    const relevantFlows = flows.filter(flow => 
      flow.feeds.some(feedId => relatedFeedIds.has(feedId))
    );

    // Collect all services involved in these flows
    relevantFlows.forEach(flow => {
      flow.feeds.forEach(feedId => {
        const feed = feeds.find(f => f.id === feedId);
        if (feed) {
          highlightedServices.add(feed.supplierId);
          highlightedServices.add(feed.receiverId);
        }
      });
    });

    // Update nodes highlighting
    setNodes(nodes => 
      nodes.map(n => ({
        ...n,
        data: {
          ...n.data,
          isHighlighted: highlightedServices.size === 0 || highlightedServices.has(n.id)
        },
        style: {
          ...n.style,
          opacity: highlightedServices.size === 0 || highlightedServices.has(n.id) ? 1 : 0.3
        }
      }))
    );

    // Update edges highlighting
    setEdges(edges => 
      edges.map(edge => ({
        ...edge,
        style: {
          ...edge.style,
          opacity: relatedFeedIds.has(edge.id) ? 1 : 0.3,
          stroke: relatedFeedIds.has(edge.id) ? '#2563eb' : '#94a3b8'
        },
        animated: relatedFeedIds.has(edge.id)
      }))
    );
  };

  const handleEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    // Find flows that contain this feed
    const relevantFlows = flows.filter(flow => flow.feeds.includes(edge.id));
    
    // Collect all feeds involved in these flows
    const highlightedFeedIds = new Set<string>();
    const highlightedServices = new Set<string>();
    
    relevantFlows.forEach(flow => {
      flow.feeds.forEach(feedId => {
        highlightedFeedIds.add(feedId);
        const feed = feeds.find(f => f.id === feedId);
        if (feed) {
          highlightedServices.add(feed.supplierId);
          highlightedServices.add(feed.receiverId);
        }
      });
    });

    // Update nodes highlighting
    setNodes(nodes => 
      nodes.map(n => ({
        ...n,
        data: {
          ...n.data,
          isHighlighted: highlightedServices.has(n.id)
        },
        style: {
          ...n.style,
          opacity: highlightedServices.has(n.id) ? 1 : 0.3
        }
      }))
    );

    // Update edges highlighting
    setEdges(edges => 
      edges.map(e => ({
        ...e,
        style: {
          ...e.style,
          opacity: highlightedServices.size === 0 || highlightedFeedIds.has(e.id) ? 1 : 0.3,
          stroke: highlightedFeedIds.has(e.id) ? '#2563eb' : '#94a3b8'
        },
        animated: highlightedFeedIds.has(e.id)
      }))
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        fitView
        fitViewOptions={{ 
          padding: 0.5,
          includeHiddenNodes: true,
          minZoom: 0.2,
          maxZoom: 1.5,
        }}
        style={{ width: '100%', height: '100%' }}
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
