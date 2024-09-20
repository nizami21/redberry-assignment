import React from 'react';

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
      <div className="relative mr-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only" // Hide the default checkbox
        />
        <div className={`w-6 h-6 border-2 rounded-sm ${checked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
          {checked && (
            <svg
              width="13"
              height="11"
              viewBox="0 0 13 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <path
                d="M11.4546 1.4541L4.57959 9.63592L1.45459 5.91691"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      {label}
    </label>
  );
};

export default CustomCheckbox;