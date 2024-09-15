import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chevronUp from '/src/assets/icons/chevronUp.svg';
import chevronDown from '/src/assets/icons/chevronDown.svg';
import CloseX from '/src/assets/icons/x.svg';
import RegionDropdown from '/src/components/ui/dropdowns/RegionDropdown.jsx';
import PriceDropdown from '/src/components/ui/dropdowns/PriceDropdown.jsx';
import AddButton from './inputs/AddButton';
import AreaDropdown from './dropdowns/AreaDropdown';
import BedroomDropdown from './dropdowns/BedroomDropdown';

const FilterBar = ({ onAgentAdd, regions, bedrooms }) => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        region: [],
        priceCategory: [],
        area: [],
        bedrooms: []
    });
    const buttons = [
        { id: 'region', label: 'რეგიონი' },
        { id: 'priceCategory', label: 'საფასო კატეგორია' },
        { id: 'area', label: 'ფართობი' },
        { id: 'bedrooms', label: 'საძინებლების რაოდენობა' }
    ];
    const handleFilterChange = (category, newFilters) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: newFilters
        }));
        setActiveButton(null); // Close the dropdown
    };

    const handleButtonClick = (id) => {
        setActiveButton(activeButton === id ? null : id);
    };

    const removeFilter = (category, filterId) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: prev[category].filter(f => f.id !== filterId)
        }));

    };

    return (
        <div className="w-screen mb-10 bg-white">
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
                                <img src={activeButton !== button.id ? chevronDown : chevronUp}
                                    className="transition-all duration-300 ease-in-out"
                                />
                            </div>
                        </button>
                    ))}
                    <RegionDropdown 
                        regions={regions} 
                        onSelectionChange={(newFilters) => handleFilterChange('region', newFilters)}
                        isOpen={activeButton === 'region'}
                        selectedFilters={selectedFilters.region}
                    />
                    <PriceDropdown 
                        onSelectionChange={(newFilters) => handleFilterChange('priceCategory', newFilters)}
                        isOpen={activeButton === 'priceCategory'}
                        selectedFilters={selectedFilters.priceCategory}
                    />
                    <AreaDropdown 
                        onSelectionChange={(newFilters) => handleFilterChange('area', newFilters)}
                        isOpen={activeButton === 'area'}
                        selectedFilters={selectedFilters.area}
                    />
                    <BedroomDropdown
                        onSelectionChange={(newFilters) => handleFilterChange('bedrooms', newFilters)}
                        isOpen={activeButton === 'bedrooms'}
                        bedroomOptions={bedrooms}
                    />
                </div>
                <div className="flex space-x-4">
                    <AddButton onClick={() => navigate('/newListing')} type='filled' text='ლისტინგის დამატება' />
                    <AddButton onClick={onAgentAdd} type='empty' text='აგენტის დამატება' />
                </div>
            </div>
            <div className='flex w-full items-center pt-2'>
                <>
                    {Object.entries(selectedFilters).flatMap(([category, filters]) =>
                        filters.map((filter) => (
                            <div key={`${category}-${filter.id}`} className="bg-[#FFFFFF] border-[1px] border-[#DBDBDB] gap-[7.5px] flex items-center px-[10px] py-[6px] rounded-[43px] text-sm mr-2">
                                <p className='text-sm'>{filter.name}</p>
                                <div className='flex justify-center items-center font-bold cursor-pointer text-[#354451] hover:text-[#354451]'
                                    onClick={() => removeFilter(category, filter.id)}
                                >
                                    <svg width="12" height="11" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 1L0.5 8" stroke="#354451" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M0.5 1L7.5 8" stroke="#354451" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        ))
                    )}
                    {Object.values(selectedFilters).flat().length > 0 && (
                        <h1 className='ml-4 text-[#021526] cursor-pointer' onClick={() => setSelectedFilters({
                            region: [],
                            priceCategory: [],
                            area: [],
                            bedrooms: []
                        })}>გასუფთავება</h1>
                    )}
                </>
            </div>
        </div>
    );
};

export default FilterBar;