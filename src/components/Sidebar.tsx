import React from 'react';
import { DataFeed, DataFlow, ITService } from '../types/types';
import { Filter, Network, GitBranch, Database, PanelLeftClose, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface SidebarProps {
  feeds: DataFeed[];
  flows: DataFlow[];
  services: ITService[];
  selectedFeedId?: string;
  selectedFlowId?: string;
  selectedServiceId?: string;
  onSelectFeed: (feedId: string) => void;
  onSelectFlow: (flowId: string) => void;
  onSelectService: (serviceId: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  feeds,
  flows,
  services,
  selectedFeedId,
  selectedFlowId,
  selectedServiceId,
  onSelectFeed,
  onSelectFlow,
  onSelectService,
  setIsSidebarOpen,
}) => {
  const hasActiveFilters = selectedServiceId || selectedFlowId || selectedFeedId;

  const handleClearFilters = () => {
    if (selectedServiceId) onSelectService(selectedServiceId);
    if (selectedFlowId) onSelectFlow(selectedFlowId);
    if (selectedFeedId) onSelectFeed(selectedFeedId);
  };

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center justify-between flex-1 gap-2">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Clear all filters"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
              title="Hide sidebar"
            >
              <PanelLeftClose className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <Accordion type="single" collapsible defaultValue="services" className="w-full">
            <AccordionItem value="services" className="border-none">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Services</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {services.map(service => (
                    <button
                      key={service.id}
                      onClick={() => onSelectService(service.id)}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all hover:bg-blue-50 ${
                        selectedServiceId === service.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-50 text-gray-900'
                      }`}
                    >
                      <div className="font-medium">{service.name}</div>
                      <div className="text-xs text-gray-600">ID: {service.id}</div>
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
          </Accordion>
        </div>
      </div>
    </div>
  );
};