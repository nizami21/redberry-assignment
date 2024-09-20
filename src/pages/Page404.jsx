import React from 'react';
import { Link } from 'react-router-dom';
import redberryLogo from "/src/assets/img/redberryLogo.svg";

const Page404 = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <div className="text-6xl m-0">
                <img 
                    src={redberryLogo} 
                    alt="Redberry Logo" 
                    className="w-[150px] h-[24px] ml-4"
                />
            </div>
            <p className="text-2xl font-helveticaNeue my-4">გვერდი არ არსებობს</p>
            <Link to="/" className="text-xl font-helveticaNeue text-blue-500 no-underline">მთავარი გვერდი</Link>
        </div>
    );
};

export default Page404;
