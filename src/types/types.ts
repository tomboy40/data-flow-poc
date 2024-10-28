export interface ITService {
  id: string;
  name: string;
  description?: string;
}

export interface DataFeed {
  id: string;
  name: string;
  supplierId: string;
  receiverId: string;
  description?: string;
}

export interface DataFlow {
  id: string;
  name: string;
  feeds: string[]; // Array of feed IDs in sequence
  description?: string;
}

export interface FlowNode {
  id: string;
  type: 'service' | 'feed';
  label: string;
}

export interface FlowEdge {
  source: string;
  target: string;
}