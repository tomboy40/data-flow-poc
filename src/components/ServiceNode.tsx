import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from './ui/tooltip';

interface ServiceNodeData {
  label: string;
  id: string;
  isHighlighted: boolean;
  description?: string;
  type?: string;
  status?: string;
  owner?: string;
}

const ServiceNode = memo(({ data }: { data: ServiceNodeData }) => {
  const isFDRService = data.id.startsWith('FDR');
  const handleStyles = `!w-3 !h-3 transition-all duration-300 hover:!w-4 hover:!h-4 ${
    isFDRService ? '!bg-green-500' : '!bg-blue-500'
  }`;

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <div className="group relative cursor-pointer">
            <Handle
              type="target"
              position={Position.Left}
              className={handleStyles}
            />
            <Handle
              type="source"
              position={Position.Right}
              className={handleStyles}
            />
            
            <div className={`w-32 h-32 shadow-lg rounded-full bg-white border-2 
                          ${data.isHighlighted 
                            ? isFDRService 
                              ? 'border-green-400 shadow-green-100'
                              : 'border-blue-400 shadow-blue-100'
                            : isFDRService
                              ? 'border-green-200'
                              : 'border-gray-100'} 
                          ${isFDRService 
                            ? 'hover:shadow-xl hover:border-green-300'
                            : 'hover:shadow-xl hover:border-blue-200'}
                          transition-all duration-300
                          flex flex-col items-center justify-center text-center p-3`}>
              <div className={`p-2.5 rounded-full transition-colors mb-2
                              ${data.isHighlighted 
                                ? isFDRService ? 'bg-green-100' : 'bg-blue-100'
                                : isFDRService 
                                  ? 'bg-green-50 group-hover:bg-green-100'
                                  : 'bg-blue-50 group-hover:bg-blue-100'}`}>
                <Database className={`w-6 h-6 ${isFDRService ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-900 whitespace-nowrap leading-tight">{data.label}</span>
                <span className="text-xs text-gray-500 leading-tight">ID: {data.id}</span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold">{data.label}</div>
            <div className="text-xs space-y-1">
              <div><span className="font-medium">ID:</span> {data.id}</div>
              {data.type && <div><span className="font-medium">Type:</span> {data.type}</div>}
              {data.status && <div><span className="font-medium">Status:</span> {data.status}</div>}
              {data.owner && <div><span className="font-medium">Owner:</span> {data.owner}</div>}
              {data.description && (
                <div><span className="font-medium">Description:</span> {data.description}</div>
              )}
            </div>
          </div>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
});

ServiceNode.displayName = 'ServiceNode';

export { ServiceNode };
