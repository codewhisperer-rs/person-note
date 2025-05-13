import React from 'react';

interface AdmonitionProps {
  type?: 'info' | 'warning' | 'danger' | 'tip';
  title?: string;
  children: React.ReactNode;
}

const Admonition: React.FC<AdmonitionProps> = ({
  type = 'info',
  title,
  children,
}) => {
  let borderColor = 'border-blue-500';
  let bgColor = 'bg-blue-50 dark:bg-blue-900';
  let textColor = 'text-blue-800 dark:text-blue-200';
  let titleColor = 'text-blue-700 dark:text-blue-300';
  let defaultTitle = 'Info';

  switch (type) {
    case 'warning':
      borderColor = 'border-yellow-500';
      bgColor = 'bg-yellow-50 dark:bg-yellow-900';
      textColor = 'text-yellow-800 dark:text-yellow-200';
      titleColor = 'text-yellow-700 dark:text-yellow-300';
      defaultTitle = 'Warning';
      break;
    case 'danger':
      borderColor = 'border-red-500';
      bgColor = 'bg-red-50 dark:bg-red-900';
      textColor = 'text-red-800 dark:text-red-200';
      titleColor = 'text-red-700 dark:text-red-300';
      defaultTitle = 'Danger';
      break;
    case 'tip':
      borderColor = 'border-green-500';
      bgColor = 'bg-green-50 dark:bg-green-900';
      textColor = 'text-green-800 dark:text-green-200';
      titleColor = 'text-green-700 dark:text-green-300';
      defaultTitle = 'Tip';
      break;
    case 'info':
    default:
      // Use default blue styles
      break;
  }

  return (
    <div className={`border-l-4 ${borderColor} ${bgColor} p-4 my-6 rounded`}>
      {title !== undefined && (
        <div className={`font-bold mb-2 ${titleColor}`}>
          {title || defaultTitle}
        </div>
      )}
      <div className={textColor}>{children}</div>
    </div>
  );
};

export default Admonition;
