import React, { useState } from 'react';
import { Network, PanelLeftOpen } from 'lucide-react';
import { services, feeds, flows } from './data/sampleData';
import { FlowDiagram } from './components/FlowDiagram';
import { Sidebar } from './components/Sidebar';

function App() {
  const [selectedFeedId, setSelectedFeedId] = useState<string>();
  const [selectedFlowId, setSelectedFlowId] = useState<string>();
  const [selectedServiceId, setSelectedServiceId] = useState<string>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 h-16">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Network className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Service Library</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {isSidebarOpen ? (
          <div className="w-80 transition-all duration-300">
            <Sidebar
              feeds={feeds}
              flows={flows}
              services={services}
              selectedFeedId={selectedFeedId}
              selectedFlowId={selectedFlowId}
              selectedServiceId={selectedServiceId}
              onSelectFeed={id => {
                setSelectedFeedId(id === selectedFeedId ? undefined : id);
                setSelectedFlowId(undefined);
                setSelectedServiceId(undefined);
              }}
              onSelectFlow={id => {
                setSelectedFlowId(id === selectedFlowId ? undefined : id);
                setSelectedFeedId(undefined);
                setSelectedServiceId(undefined);
              }}
              onSelectService={id => {
                setSelectedServiceId(id === selectedServiceId ? undefined : id);
                setSelectedFeedId(undefined);
                setSelectedFlowId(undefined);
              }}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-4 top-4 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 transition-colors z-10"
            title="Show sidebar"
          >
            <PanelLeftOpen className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <FlowDiagram
          services={services}
          feeds={feeds}
          flows={flows}
          selectedFeedId={selectedFeedId}
          selectedFlowId={selectedFlowId}
          selectedServiceId={selectedServiceId}
        />
      </main>
    </div>
  );
}

export default App;
