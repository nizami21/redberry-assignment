import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ 
    options, 
    onSelect, 
    placeholder = "აირჩიე", 
    addOption = null, 
    onAddOption = null,
    value,
    disabled = false
    }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    // Find the selected option based on the value prop
    const selectedOption = options.find(option => option.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={selectRef}>
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 py-2 text-left border ${isOpen ? 'rounded-b-none rounded-tr-md rounded-tl-md' : 'rounded-md '} border-[#808A93] bg-white shadow-sm focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            <span className="font-firaGO text-sm font-normal leading-[16.8px] text-[#021526]">
            {selectedOption ? selectedOption.name : placeholder}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            </span>
        </button>

        {isOpen && !disabled && (
            <ul className="absolute z-10 w-full border-b-[1px] border-x-[1px] rounded-t-none rounded-[10px] border-[#808A93] overflow-auto bg-white shadow-lg max-h-60">
            {addOption && (
                <li 
                className="px-4 py-2 gap-2 text-sm text-gray-700 border-b-[1px] border-[#808A93] cursor-pointer hover:bg-gray-100 flex items-center"
                onClick={() => {
                    onAddOption();
                    setIsOpen(false);
                }}
                >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11 7V15" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 11H15" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {addOption}
                </li>
            )}
            {options.map((option) => (
                <li
                key={option.id}
                className="px-4 py-3 text-sm border-b-[1px] border-[#808A93] text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(option)}
                >
                {option.name}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default CustomSelect;