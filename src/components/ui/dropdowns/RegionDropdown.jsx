import React, { useState, forwardRef, useImperativeHandle } from 'react';
import CustomCheckbox from '../inputs/CustomCheckbox';
import SelectButton from '../inputs/SelectButton';

const RegionDropdown = forwardRef(({ regions, onSelectionChange, isOpen }, ref) => {
  const [selectedRegions, setSelectedRegions] = useState([]);
  useImperativeHandle(ref, () => ({
    getSelectedRegions: () => selectedRegions,
  }));

  const toggleRegion = (region) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const handleChoose = () => {
    onSelectionChange(selectedRegions);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute z-10 w-[731px] p-6 mt-1 bg-white border border-gray-300 rounded-md shadow-lg top-[50px] left-0">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">რეგიონის მიხედვით</h3>
        <div className="grid grid-cols-3 gap-2">
          {regions.map((region) => (
            <CustomCheckbox
              key={region.id}
              label={region.name}
              checked={selectedRegions.includes(region)}
              onChange={() => toggleRegion(region)}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <SelectButton onClick={handleChoose} />
        </div>
      </div>
    </div>
  );
});

export default RegionDropdown;