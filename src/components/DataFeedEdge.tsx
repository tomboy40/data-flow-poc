import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { Network } from 'lucide-react';
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
} from './ui/tooltip';

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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <g className="cursor-pointer" style={{ pointerEvents: 'all' }}>
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
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <div className="font-semibold flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                {data?.label}
              </div>
              <div className="text-xs space-y-1">
                <div><span className="font-medium">ID:</span> {data?.id}</div>
                {data?.type && <div><span className="font-medium">Type:</span> {data.type}</div>}
                {data?.frequency && (
                  <div><span className="font-medium">Frequency:</span> {data.frequency}</div>
                )}
                {data?.format && <div><span className="font-medium">Format:</span> {data.format}</div>}
                {data?.description && (
                  <div><span className="font-medium">Description:</span> {data.description}</div>
                )}
              </div>
            </div>
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export { DataFeedEdge };