import React from 'react';

export const Container = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white border-[1px] border-gray-100 rounded-[24px] shadow-sm ${className} ${onClick ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out' : ''}`}>
    {children}
  </div>
);
