import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ITService, DataFeed, DataFlow } from '../types/types';
import { ServiceNode } from './ServiceNode';
import { Info } from 'lucide-react';

interface FlowDiagramProps {
  services: ITService[];
  feeds: DataFeed[];
  flows: DataFlow[];
  selectedFeedId?: string;
  selectedFlowId?: string;
}

const nodeTypes = {
  service: ServiceNode,
};

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  services,
  feeds,
  flows,
  selectedFeedId,
  selectedFlowId,
}) => {
  const { nodes, edges } = useMemo(() => {
    let relevantFeeds: DataFeed[] = [];
    
    if (selectedFeedId) {
      // For selected feed, show just that feed
      relevantFeeds = feeds.filter(f => f.id === selectedFeedId);
    } else if (selectedFlowId) {
      // For selected flow, show all feeds in that flow
      const selectedFlow = flows.find(f => f.id === selectedFlowId);
      if (selectedFlow) {
        relevantFeeds = selectedFlow.feeds
          .map(feedId => feeds.find(f => f.id === feedId))
          .filter((feed): feed is DataFeed => feed !== undefined);
      }
    }

    if (relevantFeeds.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Create a map of services to their positions
    const servicePositions = new Map<string, { x: number; y: number }>();
    const usedServiceIds = new Set<string>();

    // Collect all unique services
    relevantFeeds.forEach(feed => {
      usedServiceIds.add(feed.supplierId);
      usedServiceIds.add(feed.receiverId);
    });

    // Calculate positions for each service
    let currentX = 50;
    const serviceArray = Array.from(usedServiceIds);
    serviceArray.forEach((serviceId, index) => {
      servicePositions.set(serviceId, {
        x: currentX,
        y: 100 + (index % 2) * 100, // Alternate between two rows
      });
      currentX += 300; // Space between services
    });

    // Create nodes
    const nodes: Node[] = serviceArray
      .map(serviceId => {
        const service = services.find(s => s.id === serviceId);
        const position = servicePositions.get(serviceId);
        if (!service || !position) return null;

        return {
          id: service.id,
          type: 'service',
          position,
          data: { label: service.name },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
      })
      .filter((node): node is Node => node !== null);

    // Create edges
    const edges: Edge[] = relevantFeeds.map(feed => ({
      id: feed.id,
      source: feed.supplierId,
      target: feed.receiverId,
      label: feed.name,
      animated: selectedFeedId === feed.id,
      labelStyle: { 
        fill: selectedFeedId === feed.id ? '#2563eb' : '#64748b',
        fontWeight: selectedFeedId === feed.id ? '600' : '400',
      },
      style: {
        stroke: selectedFeedId === feed.id ? '#2563eb' : '#64748b',
        strokeWidth: selectedFeedId === feed.id ? 3 : 2,
      },
    }));

    return { nodes, edges };
  }, [services, feeds, flows, selectedFeedId, selectedFlowId]);

  const noDataSelected = !selectedFeedId && !selectedFlowId;
  const hasData = nodes.length > 0 && edges.length > 0;

  return (
    <div className="flex-1 h-full relative">
      {hasData ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          minZoom={0.5}
          maxZoom={1.5}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
          }}
        >
          <Background color="#94a3b8" gap={16} />
          <Controls 
            className="bg-white shadow-lg border border-gray-200 rounded-xl p-2"
            showInteractive={false}
          />
        </ReactFlow>
      ) : noDataSelected ? (
        <div className="h-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
            <div className="flex items-center gap-3 text-gray-600">
              <Info className="w-5 h-5" />
              <p>Select a data feed or process from the sidebar to visualize the flow.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
            <div className="flex items-center gap-3 text-gray-600">
              <Info className="w-5 h-5" />
              <p>No data available for the selected feed or process.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};