import React, { useState, useEffect } from 'react';
import SelectButton from '/src/components/ui/inputs/SelectButton.jsx';
import CustomRangeInput from '/src/components/ui/inputs/RangeInputs.jsx';

const AreaDropdown = ({ onSelectionChange, isOpen, selectedFilters }) => {
    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');


    const priceOptions = [50000, 100000, 150000, 200000, 300000];
    useEffect(() => {
        if (selectedFilters[0]?.min && selectedFilters.length > 0) {
            setMinArea(selectedFilters[0].min || '');
            setMaxArea(selectedFilters[0].max || '');
        } else {
            setMinArea('');
            setMaxArea('');
        }
    }, [selectedFilters]);

    const handleChoose = () => {
        if (minArea || maxArea) {
            if (maxArea && parseInt(maxArea) < parseInt(minArea)) return;

            let name;
            if (minArea && !maxArea) {
                name = `${minArea} მ² დან`;
            } else if (!minArea && maxArea) {
                name = `${maxArea} მ² მდე`;
            } else {
                name = `${minArea} - ${maxArea} მ²`;
            }

            onSelectionChange([{
                id: 'area',
                min: minArea === '' ? 0 : parseInt(minArea),
                max: maxArea === '' ? null : parseInt(maxArea),
                name: name
            }])

        }
    };

    const handleAreaClick = (type, value) => {
        if (type === 'min') {
            setMinArea(value);
        } else {
            setMaxArea(value);
        }
    };


    return (
        <div className={`absolute ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} font-firaGo text-[#021526] transition-opacity duration-300 ease-in-out z-10 w-[382px] left-[360px] p-6 mt-1 bg-white border border-gray-300 rounded-[10px] shadow-lg top-[50px]`}>
            <h3 className="text-lg font-semibold mb-6">ფართობის მიხედვით</h3>
            <div className="flex justify-between mb-6">
                <CustomRangeInput
                    type="area"
                    minValue={minArea}
                    maxValue={maxArea}
                    onMinChange={setMinArea}
                    onMaxChange={setMaxArea}
                />
            </div>
            <div className="flex text-left mb-4">
                <div className="w-1/2 text-left">
                    <p className="text-sm font-semibold mb-[16px]">მინ. მ²</p>
                    {priceOptions.map((price) => (
                        <p
                            key={`min-${price}`}
                            onClick={() => handleAreaClick('min', price)}
                            className="cursor-pointer hover:bg-gray-100 py-[2px] mb-[4px] text-[#2D3648] rounded transition-colors text-sm"
                        >
                            {price.toLocaleString()} მ²
                        </p>
                    ))}
                </div>
                <div className="w-1/2 pl-3">
                    <p className="text-sm text-left font-semibold mb-[16px]">მაქს. მ²</p>
                    {priceOptions.map((price) => (
                        <p
                            key={`max-${price}`}
                            onClick={() => handleAreaClick('max', price)}
                            className="cursor-pointer hover:bg-gray-100 py-[2px] mb-[4px] text-[#2D3648] rounded transition-colors text-sm"
                        >
                            {price.toLocaleString()} მ²
                        </p>
                    ))}
                </div>
            </div>
            <div className="flex justify-end pt-8">
                <SelectButton onClick={handleChoose} />
            </div>
        </div>
    );
};

export default AreaDropdown;