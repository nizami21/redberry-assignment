import React, { useState, useEffect } from 'react';
import CustomCheckbox from '/src/components/ui/inputs/CustomCheckbox';
import SelectButton from '/src/components/ui/inputs/SelectButton';

const RegionDropdown = ({ regions, onSelectionChange, isOpen, selectedFilters }) => {
  const [selectedRegions, setSelectedRegions] = useState(selectedFilters);

  useEffect(() => {
    setSelectedRegions(selectedFilters);
  }, [selectedFilters]);

  const toggleRegion = (region) => {
    setSelectedRegions(prev =>
      prev.some(r => r.id === region.id)
        ? prev.filter(r => r.id !== region.id)
        : [...prev, region]
    );
  };

  const handleChoose = () => {
    onSelectionChange(selectedRegions);
  };


  return (
    <div className={`absolute ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} font-figaRO text-[#021526] transition-opacity duration-300 ease-in-out z-10 w-[731px] p-6 mt-1 bg-white border border-gray-300 rounded-[10px] shadow-lg top-[50px] left-0`}>
      <div className="p-0">
        <h3 className="text-lg ml-2 font-semibold mb-6">რეგიონის მიხედვით</h3>
        <div className="grid grid-cols-3 gap-2">
          {regions.map((region) => (
            <CustomCheckbox
              key={region.id}
              label={region.name}
              checked={selectedRegions.some(r => r.id === region.id)}
              onChange={() => toggleRegion(region)}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <SelectButton onClick={handleChoose} />
        </div>
      </div>
    </div>
  );
};

export default RegionDropdown;