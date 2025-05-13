import React from 'react';

interface TagProps {
  text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {
  return (
    <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
      {text}
    </span>
  );
};

export default Tag;
