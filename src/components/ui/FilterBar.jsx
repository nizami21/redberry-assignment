import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chevronUp from '/src/assets/icons/chevronUp.svg';
import chevronDown from '/src/assets/icons/chevronDown.svg';
import CloseX from '/src/assets/icons/x.svg';
import RegionDropdown from '/src/components/ui/dropdowns/RegionDropdown.jsx';
import AddButton from './inputs/AddButton';

const FilterBar = ({ onAgentAdd, regions }) => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const regionDropdownRef = useRef();
    const buttons = [
        { id: 'region', label: 'რეგიონი' },
        { id: 'priceCategory', label: 'საფასო კატეგორია' },
        { id: 'area', label: 'ფართობი' },
        { id: 'bedrooms', label: 'საძინებლების რაოდენობა' }
    ];
  

  
    const handleRegionChange = (newSelectedRegions) => {
        setSelectedFilters(newSelectedRegions);
        setActiveButton(null); // Close the dropdown
        // Perform any other actions like updating global state or making API calls
      };

    const handleButtonClick = (id) => {
        setActiveButton(activeButton === id ? null : id);
    };


    return (
        <div className="w-screen mb-5 bg-white">
            <div className="flex justify-between items-center w-[1596px]">
                <div className="relative flex w-[785px] h-[47px] border-[1px] gap-6 rounded-md p-[6px] items-center border-[#DBDBDB]">
                    {buttons.map((button) => (
                        <button
                            key={button.id}
                            className={`flex rounded-md gap-1 items-center justify-center py-[8px] px-[14px] transition-all duration-300 ${
                                activeButton === button.id ? 'bg-[#F3F3F3]' : 'bg-[#FFFFFF]'
                            }`}
                            onClick={() => handleButtonClick(button.id)}
                        >
                            <p>{button.label}</p>
                            <div>
                            <img src={chevronDown}
                                className={`${activeButton != button.id ? 'opacity-100' : 'opacity-0 w-0 h-0'} delay-100 transition-all duration-300 ease-in-out`}
                            />
                            <img src={chevronUp} 
                                className={`${activeButton === button.id ? 'opacity-100' : 'opacity-0 w-0 h-0'} delay-100 transition-all duration-300 ease-in-out`}
                            />
                            </div>
                        </button>
                    ))}
                    <RegionDropdown 
                        ref={regionDropdownRef}
                        regions={regions} 
                        onSelectionChange={handleRegionChange}
                        isOpen={activeButton === 'region'}
                    />
                </div>
                <div className="flex space-x-4">
                    <AddButton onClick={() => navigate('/newListing')} type='filled' text='ლისტინგის დამატება' />
                    <AddButton onClick={onAgentAdd} type='empty' text='აგენტის დამატება' />
                </div>
            </div>
            <div className='flex w-full mt-2'>
                {selectedFilters.map((filter) => (
                    <div key={filter.id} className="bg-[#FFFFFF] border-[1px] border-[#DBDBDB] gap-[7.5px] flex items-center px-[10px] py-[6px] rounded-[43px] text-sm mr-2">
                        <p className='text-sm'>{filter.name}</p>
                        <img 
                            src={CloseX}
                            alt="close" 
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => setSelectedFilters(selectedFilters.filter(f => f !== filter))}/>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;