import React, { useState } from 'react';
import { Activity, PanelLeftClose, PanelLeft } from 'lucide-react';
import { services, feeds, flows } from './data/sampleData';
import { FlowDiagram } from './components/FlowDiagram';
import { Sidebar } from './components/Sidebar';

function App() {
  const [selectedFeedId, setSelectedFeedId] = useState<string>();
  const [selectedFlowId, setSelectedFlowId] = useState<string>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">IT Service Flow Visualizer</h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 text-gray-600" />
              ) : (
                <PanelLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className={`transition-all duration-300 ${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'
        }`}>
          {isSidebarOpen && (
            <Sidebar
              feeds={feeds}
              flows={flows}
              selectedFeedId={selectedFeedId}
              selectedFlowId={selectedFlowId}
              onSelectFeed={id => {
                setSelectedFeedId(id === selectedFeedId ? undefined : id);
                setSelectedFlowId(undefined);
              }}
              onSelectFlow={id => {
                setSelectedFlowId(id === selectedFlowId ? undefined : id);
                setSelectedFeedId(undefined);
              }}
            />
          )}
        </div>
        
        <FlowDiagram
          services={services}
          feeds={feeds}
          flows={flows}
          selectedFeedId={selectedFeedId}
          selectedFlowId={selectedFlowId}
        />
      </main>
    </div>
  );
}

export default App;