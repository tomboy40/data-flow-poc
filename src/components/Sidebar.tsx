import React from 'react';
import { DataFeed, DataFlow } from '../types/types';
import { Filter, Network, GitBranch } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface SidebarProps {
  feeds: DataFeed[];
  flows: DataFlow[];
  selectedFeedId?: string;
  selectedFlowId?: string;
  onSelectFeed: (feedId: string) => void;
  onSelectFlow: (flowId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  feeds,
  flows,
  selectedFeedId,
  selectedFlowId,
  onSelectFeed,
  onSelectFlow,
}) => {
  return (
    <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-gray-900">
            <Filter className="w-5 h-5" />
            Filters
          </h2>
          
          <Accordion type="single" collapsible defaultValue="feeds" className="w-full">
            <AccordionItem value="feeds" className="border-none">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  <span>Data Feeds</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {feeds.map(feed => (
                    <button
                      key={feed.id}
                      onClick={() => onSelectFeed(feed.id)}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all hover:bg-blue-50 ${
                        selectedFeedId === feed.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-50 text-gray-900'
                      }`}
                    >
                      <div className="font-medium">{feed.name}</div>
                      <div className="text-xs text-gray-600">ID: {feed.id}</div>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="processes" className="border-none">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  <span>Processes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {flows.map(flow => (
                    <button
                      key={flow.id}
                      onClick={() => onSelectFlow(flow.id)}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all hover:bg-blue-50 ${
                        selectedFlowId === flow.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-50 text-gray-900'
                      }`}
                    >
                      <div className="font-medium">{flow.name}</div>
                      <div className="text-xs text-gray-600">ID: {flow.id}</div>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};