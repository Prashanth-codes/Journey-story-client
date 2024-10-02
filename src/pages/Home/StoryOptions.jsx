// StoryOptions.js
import React from 'react';

const StoryOptions = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center mb-6">
      <button
        className={`px-4 py-2 mx-2 ${activeTab === 'my' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveTab('my')}
      >
        My Stories
      </button>
      <button
        className={`px-4 py-2 mx-2 ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveTab('all')}
      >
        All Stories
      </button>
    </div>
  );
};

export default StoryOptions;
