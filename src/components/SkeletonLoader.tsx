import React from 'react';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '1em',
  className = '',
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded-md ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export default SkeletonLoader;
