import React from 'react';

const AddButton = ({ text, onClick, type = 'filled' }) => {
  const baseClasses = "flex items-center justify-center py-[10px] px-[16px] text-base rounded-[10px] transition-colors duration-300 font-[500]";
  
  const typeClasses = {
    empty: "border border-[#F93B1D] text-[#F93B1D] hover:bg-[#F93B1D] hover:text-white",
    filled: "bg-[#F93B1D] text-white border border-[#F93B1D] hover:bg-[#DF3014] hover:border-[#DF3014]"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${typeClasses[type]}`}
    >
      <span className="w-6 h-6 flex items-center justify-center">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5002 7.41439H7.91683V11.9977C7.91683 12.2408 7.82025 12.474 7.64834 12.6459C7.47644 12.8178 7.24328 12.9144 7.00016 12.9144C6.75705 12.9144 6.52389 12.8178 6.35198 12.6459C6.18007 12.474 6.0835 12.2408 6.0835 11.9977V7.41439H1.50016C1.25705 7.41439 1.02389 7.31781 0.851982 7.1459C0.680073 6.97399 0.583496 6.74084 0.583496 6.49772C0.583496 6.25461 0.680073 6.02145 0.851982 5.84954C1.02389 5.67763 1.25705 5.58105 1.50016 5.58105H6.0835V0.997721C6.0835 0.754606 6.18007 0.521448 6.35198 0.34954C6.52389 0.177632 6.75705 0.0810547 7.00016 0.0810547C7.24328 0.0810547 7.47644 0.177632 7.64834 0.34954C7.82025 0.521448 7.91683 0.754606 7.91683 0.997721V5.58105H12.5002C12.7433 5.58105 12.9764 5.67763 13.1483 5.84954C13.3203 6.02145 13.4168 6.25461 13.4168 6.49772C13.4168 6.74084 13.3203 6.97399 13.1483 7.1459C12.9764 7.31781 12.7433 7.41439 12.5002 7.41439Z" fill='currentColor' />
        </svg>

      </span>
      {text}
    </button>
  );
};

export default AddButton;