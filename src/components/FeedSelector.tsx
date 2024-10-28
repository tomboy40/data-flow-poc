import React from 'react';
import { DataFeed } from '../types/types';

interface FeedSelectorProps {
  feeds: DataFeed[];
  selectedFeedId?: string;
  onSelectFeed: (feedId: string) => void;
}

export const FeedSelector: React.FC<FeedSelectorProps> = ({
  feeds,
  selectedFeedId,
  onSelectFeed,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Select Data Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeds.map(feed => (
            <button
              key={feed.id}
              onClick={() => onSelectFeed(feed.id)}
              className={`p-4 rounded-lg text-left transition-all ${
                selectedFeedId === feed.id
                  ? 'bg-blue-100 ring-2 ring-blue-400'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{feed.name}</div>
              <div className="text-sm text-gray-600">ID: {feed.id}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};