import React from 'react';

export default function AdminActionButton({ icon, label, onClick, disabled, bg, border }) {
  return (
    <button
      onClick={disabled ? null : onClick}
      disabled={disabled}
      className={`flex items-center gap-4 p-4 
        ${disabled ? 'bg-gray-200 border-gray-300 cursor-not-allowed' : `bg-gray-50 dark:bg-gray-900 ${bg}`} 
        border ${disabled ? '' : border} rounded-xl shadow transition-all hover:shadow-md`}
    >
      <div className={`p-2 rounded-full shadow-sm ring-1 ring-black/5 ${disabled ? 'bg-gray-300' : 'bg-white'}`}>
        {React.cloneElement(icon, {
          className: disabled ? 'w-5 h-5 text-gray-400' : icon.props.className,
        })}
      </div>
      <span className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-700 dark:text-gray-100'}`}>
        {label}
      </span>
    </button>
  );
}
