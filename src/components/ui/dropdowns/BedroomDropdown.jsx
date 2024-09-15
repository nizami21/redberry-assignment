import React, { useState, useEffect } from 'react';
import SelectButton from '/src/components/ui/inputs/SelectButton.jsx';

const BedroomDropdown = ({ bedroomOptions, onSelectionChange, isOpen, selectedFilters }) => {
    const [selectedBedrooms, setSelectedBedrooms] = useState(selectedFilters || []);

    useEffect(() => {
        setSelectedBedrooms(selectedFilters || []);
    }, [selectedFilters]);

    const handleBedroomSelect = (bedroom) => {
        setSelectedBedrooms(prev => {
            if (prev.includes(bedroom)) {
                return prev.filter(b => b !== bedroom);
            } else {
                return [...prev, bedroom];
            }
        });
    };

    const handleChoose = () => {
        onSelectionChange(selectedBedrooms.map(bedroom => ({ id: 1000+bedroom, name: `${bedroom}` })));
    };



    return (
        <div 
        className={`absolute z-10 left-[508px] w-[300px] ${isOpen ? 'opacity-100' : 'opacity-0 -top-[3000px]'} transition-opacity duration-300 ease-in-out p-6 mt-1 bg-white border border-gray-300 rounded-[10px] shadow-lg top-[50px]`}>
            <div className="p-0">
                <h3 className="text-base pt-6 font-semibold mb-6">საძინებლების რაოდენობა</h3>
                <div className="grid grid-cols-4 gap-2">
                    {bedroomOptions.map((bedroom) => (
                        <button
                            key={bedroom}
                            onClick={() => handleBedroomSelect(bedroom)}
                            className={`w-[41px] h-[42px] flex items-center justify-center border ${
                                selectedBedrooms.includes(bedroom)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300'
                            } rounded-md text-lg font-medium focus:outline-none`}
                        >
                            {bedroom}
                        </button>
                    ))}
                </div>
                <div className="pt-8 flex justify-end">
                    <SelectButton onClick={handleChoose} />
                </div>
            </div>
        </div>
    );
};

export default BedroomDropdown;