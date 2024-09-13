import React from 'react';

const SelectButton = ({onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        bg-[#F93B1D] 
        hover:bg-[#DF3014] 
        text-white 
        font-bold 
        py-2 
        px-3.5 
        rounded-lg 
        transition-colors 
        duration-200
      "
    >
        არჩევა
    </button>
  );
};

export default SelectButton;