import React, { useMemo } from 'react';
import { ArrowRight, Database, GitBranch } from 'lucide-react';
import { ITService, DataFeed, DataFlow } from '../types/types';

interface FlowVisualizerProps {
  services: ITService[];
  feeds: DataFeed[];
  flows: DataFlow[];
  selectedFeedId?: string;
}

export const FlowVisualizer: React.FC<FlowVisualizerProps> = ({
  services,
  feeds,
  flows,
  selectedFeedId,
}) => {
  const relevantFlows = useMemo(() => {
    if (!selectedFeedId) return flows;
    return flows.filter(flow => flow.feeds.includes(selectedFeedId));
  }, [flows, selectedFeedId]);

  const getServiceById = (id: string) => services.find(s => s.id === id);
  const getFeedById = (id: string) => feeds.find(f => f.id === id);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {relevantFlows.map(flow => (
        <div
          key={flow.id}
          className="mb-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            {flow.name}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4">
            {flow.feeds.map((feedId, index) => {
              const feed = getFeedById(feedId);
              if (!feed) return null;
              
              const supplier = getServiceById(feed.supplierId);
              const receiver = getServiceById(feed.receiverId);
              
              return (
                <React.Fragment key={feedId}>
                  {index === 0 && (
                    <div className={`flex items-center justify-center p-4 rounded-lg ${
                      selectedFeedId === feedId ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                    }`}>
                      <Database className="w-5 h-5 mr-2" />
                      <span className="font-medium">{supplier?.name}</span>
                    </div>
                  )}
                  
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  
                  <div className={`flex items-center justify-center p-4 rounded-lg ${
                    selectedFeedId === feedId ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                  }`}>
                    <Database className="w-5 h-5 mr-2" />
                    <span className="font-medium">{receiver?.name}</span>
                  </div>
                  
                  {index < flow.feeds.length - 1 && (
                    <div className="text-sm text-gray-500">
                      via {feed.name}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};