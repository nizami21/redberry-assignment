import React from 'react';
import redberryLogo from "/src/assets/img/redberryLogo.svg";

const Header = () => {
  return (
    <header className="bg-white shadow-sm w-full h-[100px] flex items-center ">
        <img 
          src={redberryLogo} 
          alt="Redberry Logo" 
          className="w-[150px] h-[24px] ml-[162px]"
        />
    </header>
  );
};

export default Header;