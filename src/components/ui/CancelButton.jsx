import React from 'react';

const CancelButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        w-[103px] h-[47px]
        px-4 py-2.5
        rounded-[10px]
        border-[1px] border-[#F93B1D]
        bg-white
        font-firaGO text-base font-medium leading-[19.2px] text-center text-[#F93B1D]
        hover:bg-[#F93B1D] hover:text-white
        transition-colors duration-300
      "
    >
      გაუქმება
    </button>
  );
};

export default CancelButton;