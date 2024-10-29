import React, { useState } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Network } from 'lucide-react';

interface DataFeedEdgeData {
  label: string;
  id: string;
  description?: string;
  type?: string;
  frequency?: string;
  format?: string;
  isHighlighted?: boolean;
}

const DataFeedEdge: React.FC<EdgeProps<DataFeedEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  labelStyle,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleEdgeClick = (evt: React.MouseEvent<SVGGElement, MouseEvent>) => {
    evt.stopPropagation();
    setIsDialogOpen(true);
  };

  return (
    <>
      <g 
        onClick={handleEdgeClick}
        className="cursor-pointer"
        style={{ pointerEvents: 'all' }}
      >
        <path
          id={id}
          style={{ ...style, pointerEvents: 'all' }}
          className="react-flow__edge-path hover:stroke-blue-400"
          d={edgePath}
          markerEnd={markerEnd}
        />
        <path
          d={edgePath}
          fill="none"
          strokeWidth={20}
          stroke="transparent"
          strokeOpacity={0}
          style={{ pointerEvents: 'stroke' }}
        />
        <text
          style={labelStyle}
          className="react-flow__edge-text select-none"
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {data?.label}
        </text>
      </g>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              {data?.label}
            </DialogTitle>
            <DialogDescription>
              Data Feed Details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm text-gray-600 col-span-3">{data?.id}</span>
            </div>
            {data?.type && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm text-gray-600 col-span-3">{data.type}</span>
              </div>
            )}
            {data?.frequency && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Frequency:</span>
                <span className="text-sm text-gray-600 col-span-3">{data.frequency}</span>
              </div>
            )}
            {data?.format && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Format:</span>
                <span className="text-sm text-gray-600 col-span-3">{data.format}</span>
              </div>
            )}
            {data?.description && (
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
};

export { DataFeedEdge };