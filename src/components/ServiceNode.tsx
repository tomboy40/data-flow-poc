import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

const ServiceNode = memo(({ data }: { data: { label: string } }) => {
  return (
    <div className="px-6 py-3 shadow-lg rounded-xl bg-white border border-gray-200 hover:shadow-xl transition-shadow">
      <Handle 
        type="target" 
        position={Position.Left}
        className="!bg-blue-500 !w-3 !h-3"
      />
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Database className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-gray-900">{data.label}</span>
      </div>
      <Handle 
        type="source" 
        position={Position.Right}
        className="!bg-blue-500 !w-3 !h-3"
      />
    </div>
  );
});

ServiceNode.displayName = 'ServiceNode';

export { ServiceNode };