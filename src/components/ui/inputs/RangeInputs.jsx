import React, { useState, useEffect } from 'react';

const RangeInputs = ({ type, minValue, maxValue, onMinChange, onMaxChange }) => {
    const [minInputValue, setMinInputValue] = useState(minValue);
    const [maxInputValue, setMaxInputValue] = useState(maxValue);
    const [error, setError] = useState(false);

    useEffect(() => {
        setMinInputValue(minValue);
        setMaxInputValue(maxValue);
        checkValidity(minValue, maxValue);
    }, [minValue, maxValue]);

    const checkValidity = (min, max) => {
        if (min && max && parseInt(min) > parseInt(max)) {
            setError(true);
        } else {
            setError(false);
        }
    }

    const validateInput = (value) => {
        // Allow empty string or only integers
        return value === '' || /^-?\d*$/.test(value);
    };

    const handleMinChange = (e) => {
        const value = e.target.value;
        if (validateInput(value)) {
            setMinInputValue(value);
            onMinChange(value);
            checkValidity(value, maxInputValue);
        }
    };

    const handleMaxChange = (e) => {
        const value = e.target.value;
        if (validateInput(value)) {
            setMaxInputValue(value);
            onMaxChange(value);
            checkValidity(minInputValue, value);
        }
    };

    const icon = type === 'price' ? '₾' : 'მ²';

    const inputStyle = `w-full h-[48px] px-3 pr-8 border border-[#808A93] rounded-md text-sm focus:outline-none ${error ? 'border-red-500' : ''}`;

    return (
        <div>
            <div className="flex space-x-4">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="დან"
                        value={minInputValue}
                        onChange={handleMinChange}
                        className={inputStyle}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </span>
                </div>
                <div className="relative w-1/2">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="მდე"
                        value={maxInputValue}
                        onChange={handleMaxChange}
                        className={inputStyle}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </span>
                </div>
            </div>
            {error && <span className="text-red-500 font-figaRO text-sm mt-[8px] block">ჩაწერეთ ვალიდური მონაცემები.</span>}
        </div>
    );
};

export default RangeInputs;