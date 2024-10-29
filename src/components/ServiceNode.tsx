import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isFDRService = data.id.startsWith('FDR');

  const handleNodeClick = () => {
    setIsDialogOpen(true);
  };

  const handleStyles = `!w-3 !h-3 transition-all duration-300 hover:!w-4 hover:!h-4 ${
    isFDRService ? '!bg-green-500' : '!bg-blue-500'
  }`;

  return (
    <>
      <div 
        className="group relative cursor-pointer"
        onClick={handleNodeClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNodeClick();
          }
        }}
      >
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
          {/* Top handle */}
          <Handle
            type="target"
            position={Position.Top}
            className={`${handleStyles} !-top-1.5 hover:!-top-2`}
            id="top"
          />
          <Handle
            type="source"
            position={Position.Top}
            className={`${handleStyles} !-top-1.5 hover:!-top-2`}
            id="top"
          />
          
          {/* Right handle */}
          <Handle
            type="target"
            position={Position.Right}
            className={`${handleStyles} !-right-1.5 hover:!-right-2`}
            id="right"
          />
          <Handle
            type="source"
            position={Position.Right}
            className={`${handleStyles} !-right-1.5 hover:!-right-2`}
            id="right"
          />
          
          {/* Bottom handle */}
          <Handle
            type="target"
            position={Position.Bottom}
            className={`${handleStyles} !-bottom-1.5 hover:!-bottom-2`}
            id="bottom"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className={`${handleStyles} !-bottom-1.5 hover:!-bottom-2`}
            id="bottom"
          />
          
          {/* Left handle */}
          <Handle
            type="target"
            position={Position.Left}
            className={`${handleStyles} !-left-1.5 hover:!-left-2`}
            id="left"
          />
          <Handle
            type="source"
            position={Position.Left}
            className={`${handleStyles} !-left-1.5 hover:!-left-2`}
            id="left"
          />
          
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className={`w-5 h-5 ${isFDRService ? 'text-green-600' : 'text-blue-600'}`} />
              {data.label}
            </DialogTitle>
            <DialogDescription>
              Service Details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm text-gray-600 col-span-3">{data.id}</span>
            </div>
            {data.type && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm text-gray-600 col-span-3">{data.type}</span>
              </div>
            )}
            {data.status && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="text-sm text-gray-600 col-span-3">{data.status}</span>
              </div>
            )}
            {data.owner && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Owner:</span>
                <span className="text-sm text-gray-600 col-span-3">{data.owner}</span>
              </div>
            )}
            {data.description && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Description:</span>
                <span className="text-sm text-gray-600 col-span-3">{data.description}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

ServiceNode.displayName = 'ServiceNode';

export { ServiceNode };
