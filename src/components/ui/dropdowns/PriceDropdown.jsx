import React, { useState, useEffect } from 'react';
import SelectButton from '/src/components/ui/inputs/SelectButton.jsx';
import CustomRangeInput from '/src/components/ui/inputs/RangeInputs.jsx';

const PriceDropdown = ({ onSelectionChange, isOpen, selectedFilters }) => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const priceOptions = [50000, 100000, 150000, 200000, 300000];
    useEffect(() => {
        if (selectedFilters[0]?.min && selectedFilters.length > 0) {
            setMinPrice(selectedFilters[0].min || '');
            setMaxPrice(selectedFilters[0].max || '');
        } else {
            setMinPrice('');
            setMaxPrice('');
        }

    }, [selectedFilters]);

    const handleChoose = () => {
        if (minPrice || maxPrice) {
            if (maxPrice && parseInt(maxPrice) < parseInt(minPrice)) return;

            let name;
            if (minPrice && !maxPrice) {
                name = `${minPrice}₾ დან`;
            } else if (!minPrice && maxPrice) {
                name = `${maxPrice}₾ მდე`;
            } else {
                name = `${minPrice}₾ - ${maxPrice}₾`;
            }

            onSelectionChange([{
                id: 'price',
                min: minPrice === '' ? 0 : parseInt(minPrice),
                max: maxPrice === '' ? null : parseInt(maxPrice),
                name: name
            }]);
        }
    };

    const handlePriceClick = (type, value) => {
        if (type === 'min') {
            setMinPrice(value);
        } else {
            setMaxPrice(value);
        }
    };


    return (
        <div className={`absolute ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} font-firaGo text-[#021526] transition-opacity duration-300 ease-in-out z-10 w-[382px]  left-[140px] p-6 mt-1 bg-white border border-gray-300 rounded-[10px] shadow-lg top-[50px]`}>
            <h3 className="text-lg font-bold mb-6">ფასის მიხედვით</h3>
            <div className="flex justify-between mb-6">
                <CustomRangeInput
                    type="price"
                    minValue={minPrice}
                    maxValue={maxPrice}
                    onMinChange={setMinPrice}
                    onMaxChange={setMaxPrice}
                />
            </div>
            <div className="flex text-left mb-4">
                <div className="w-1/2 text-left">
                    <p className="text-sm font-semibold mb-[16px]">მინ. ფასი</p>
                    {priceOptions.map((price) => (
                        <p
                            key={`min-${price}`}
                            onClick={() => handlePriceClick('min', price)}
                            className="cursor-pointer hover:bg-gray-100 py-[2px] mb-[4px] text-[#2D3648] rounded transition-colors text-sm"
                        >
                            {price.toLocaleString()} ₾
                        </p>
                    ))}
                </div>
                <div className="w-1/2 pl-3">
                    <p className="text-sm text-left font-semibold mb-[16px]">მაქს. ფასი</p>
                    {priceOptions.map((price) => (
                        <p
                            key={`max-${price}`}
                            onClick={() => handlePriceClick('max', price)}
                            className="cursor-pointer hover:bg-gray-100 py-[2px] mb-[4px] text-[#2D3648] rounded transition-colors text-sm"
                        >
                            {price.toLocaleString()} ₾
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

export default PriceDropdown;