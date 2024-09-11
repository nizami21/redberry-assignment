import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { apiGet } from '../services/apiRequest';

const NewListingPage = () => {
  const [formData, setFormData] = useState({
    address: '',
    image: null,
    region_id: '',
    description: '',
    city_id: '',
    zip_code: '',
    price: '',
    area: '',
    bedrooms: '',
    is_rental: 0,
    agent_id: ''
  });

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionsData = await apiGet('/regions');
        setRegions(regionsData);
        
        const citiesData = await apiGet('/cities');
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.region_id) {
      const cityList = cities.filter(city => city.region_id === parseInt(formData.region_id));
      setFilteredCities(cityList);
    } else {
      setFilteredCities([]);
    }
  }, [formData.region_id, cities]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    if (name === 'region_id') {
      setFormData(prev => ({ ...prev, city_id: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[790px] mx-auto bg-white p-8 shadow-sm mt-8">
        <h1 className="text-3xl font-bold text-center mb-[61px]">ლისტინგის დამატება</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-20">

            <label className="font-bold text-lg mb-4 block">განცხადების ტიპი</label>

            <div className="flex">
              <label className="flex items-center mr-4 ">
                <input
                  type="radio"
                  name="is_rental"
                  value={0}
                  checked={formData.is_rental === 0}
                  onChange={() => setFormData(prev => ({ ...prev, is_rental: 0 }))}
                  className="mr-2 w-[17px] h-[17px] border-[#021526]"
                />
                <span className="text-lg">იყიდება</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_rental"
                  value={1}
                  checked={formData.is_rental === 1}
                  onChange={() => setFormData(prev => ({ ...prev, is_rental: 1 }))}
                  className="mr-2 w-4 h-4"
                />
                <span className="text-lg">ქირავდება</span>
              </label>

            </div>
          </div>

          <div className="mb-20">
            <label className="font-medium text-lg mb-4 block">მდებარეობა</label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="mb-[5px]">მისამართი*</p>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-[#808A93] rounded-md"
                  placeholder="მისამართი"
                />
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  მინიმუმ ორი სიმბოლო
                </div>
              </div>
              <div>
                <p className="mb-[5px]">საფოსტო ინდექსი*</p>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-[#808A93] rounded-md"
                  placeholder="საფოსტო ინდექსი"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-[5px]">რეგიონი</p>
              <select
                name="region_id"
                value={formData.region_id}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#808A93] rounded-md"
              >
                <option value="">აირჩიეთ</option>
                {regions.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-[5px]">ქალაქი</p>
              <select
                name="city_id"
                value={formData.city_id}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#808A93] rounded-md"
                disabled={!formData.region_id}
              >
                <option value="">აირჩიეთ</option>
                {filteredCities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>
          </div>

          <div className="mb-20">
            <div className='bottom-5'>
              <label className="font-bold text-lg mb-4 block">ბინის დეტალები</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="mb-[5px]">ფასი</p>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#808A93] rounded-md"
                    placeholder="ფასი"
                  />
                </div>
                <div>
                  <p className="mb-[5px]">ფართობი</p>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#808A93] rounded-md"
                    placeholder="ფართობი"
                  />
                </div>
              </div>
              <div className="mb-4 w-1/2">
                <p className="mb-[5px]">საძინებლების რაოდენობა</p>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-[#808A93] rounded-md mb-[4px]"
                  placeholder="საძინებლების რაოდენობა"
                />
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                მხოლოდ რიცხვები
              </div>
              </div>
            </div>
            <div className="bottom-[20px]">
              <label className="font-bold text-base mb-[5px] block">აღწერა *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#808A93] rounded-md mb-[4px]"
                rows="4"
                placeholder="აღწერა"
              ></textarea>
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                მინიმუმ ხუთი სიტყვა
              </div>
            </div>

            <div className="">
              <label className="font-bold text-base mt-5 mb-[5px] block">ატვირთეთ ფოტო *</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                accept="image/*"
              />
              <label 
                htmlFor="image-upload" 
                className="border-[1px] border-spacing-12 border-dashed border-[#2D3648] rounded-md p-4 text-center block cursor-pointer"
              >
                <div className="flex justify-center items-center h-24">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8V16" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 12H16" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </label>
              
              {formData.image && <p className="mt-2 text-sm text-gray-600">{formData.image.name}</p>}
            </div>
          </div>

          <div className="mb-20">
          </div>

          <div className="mb-20 w-1/2">
            <label className="font-bold text-lg mb-4 block">აგენტი</label>
            <p>აირჩიე</p>
            <select
              name="agent_id"
              value={formData.agent_id}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#808A93] bg-none rounded-md"
            >
              <option value="">აირჩიეთ აგენტი</option>
              {/* Add agent options here */}
            </select>
          </div>
        </form>
        
        <div className="flex justify-end space-x-4">
          <button type="button" className="px-6 py-2 border border-gray-300 rounded-md text-gray-700">გაუქმება</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-red-500 text-white rounded-md">დაამატე ლისტინგი</button>
        </div>
      </div>
    </div>
  );
};

export default NewListingPage;