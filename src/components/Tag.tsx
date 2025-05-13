import React from 'react';

interface TagProps {
  text: string;
  variant?: 'default' | 'orange' | 'gray';
}

const Tag: React.FC<TagProps> = ({ text, variant = 'default' }) => {
  const getTagClass = () => {
    switch (variant) {
      case 'orange':
        return 'mi-tag mi-tag-orange';
      case 'gray':
        return 'mi-tag mi-tag-gray';
      default:
        return 'inline-block bg-gray-100 dark:bg-gray-800 text-[var(--mi-orange)] text-xs font-medium px-2.5 py-0.5 rounded-full';
    }
  };

  return (
    <span className={getTagClass()}>
      {text}
    </span>
  );
};

export default Tag;
