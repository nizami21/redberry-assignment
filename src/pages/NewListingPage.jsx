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
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
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
    let updatedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    
    if (['price', 'area', 'bedrooms', 'zip_code'].includes(name)) {
      updatedValue = value.replace(/[^\d.]/g, '');
      if (name === 'bedrooms') updatedValue = value.replace(/\D/g, '');
    }
    validateField(name, updatedValue);
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    
    const error = validateField(name, updatedValue);
    setErrors(prev => ({ ...prev, [name]: error }));

    if (name === 'region_id') {
      setFormData(prev => ({ ...prev, city_id: '' }));
      setErrors(prev => ({ ...prev, city_id: 'ეს ველი სავალდებულოა' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      const error = validateField('image', file);
      setErrors(prev => ({ ...prev, image: error }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    setErrors(prev => ({ ...prev, image: 'სურათის ატვირთვა სავალდებულოა' }));
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'address':
        if (value.length < 2) error = 'მინიმუმ ორი სიმბოლო';
        break;
      case 'zip_code':
      case 'price':
      case 'area':
      case 'bedrooms':
        if (!/^\d*\.?\d*$/.test(value)) error = 'მხოლოდ რიცხვები';
        if (name === 'bedrooms' && !Number.isInteger(Number(value))) error = 'მხოლოდ მთელი რიცხვები';
        break;
      case 'description':
        if (value.trim().split(/\s+/).length < 5) error = 'მინიმუმ ხუთი სიტყვა';
        break;
      case 'image':
        if (!value) error = 'სურათის ატვირთვა სავალდებულოა';
        else if (value.size > 1024 * 1024) error = 'სურათი არ უნდა აღემატებოდეს 1მბ-ს';
        break;
      default:
        if (!value) error = 'ეს ველი სავალდებულოა';
    }
    return error;
  };
  const getInputClassName = (fieldName) => {
    let baseClass = "w-full p-2 border rounded-md ";
    if (!formData[fieldName]) return baseClass + "border-[#021526]";
    return baseClass + (errors[fieldName] ? "border-[#F93B1D]" : "border-[#45A849]");
  };

  const getMessageClassName = (fieldName) => {
    if (!formData[fieldName]) return "flex mt-[4px] text-xs text-[#021526]";
    return errors[fieldName] ? "flex mt-[4px] text-xs text-[#F93B1D]" : "flex mt-[4px] text-xs text-[#45A849]";
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      console.log('Form submitted:', formData);
    }
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
                  className={getInputClassName('address')}
                  placeholder="მისამართი"
                />
                <div className={getMessageClassName('address')}>
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {errors.address || 'მინიმუმ ორი სიმბოლო'}
                </div>
              </div>
              <div>
                <p className="mb-[5px]">საფოსტო ინდექსი*</p>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  className={getInputClassName('zip_code')}
                  placeholder="საფოსტო ინდექსი"
                />
                  <div className={getMessageClassName('zip_code')}>
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {errors.zip_code || 'მხოლოდ რიცხვები'}
                  </div> 
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
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={getInputClassName('price')}
                    placeholder="ფასი"
                  />
                  <div className={getMessageClassName('price')}>
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {errors.price || 'მხოლოდ რიცხვები'}
                  </div>                  
                </div>
                <div>
                  <p className="mb-[5px]">ფართობი</p>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className={getInputClassName('area')}
                    placeholder="ფართობი"
                  />
                  <div className={getMessageClassName('area')}>
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {errors.area || 'მხოლოდ რიცხვები'}
                  </div>
                </div>
              </div>
              <div className="mb-4 w-1/2">
                <p className="mb-[5px]">საძინებლების რაოდენობა</p>
                <input
                  type="text"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className={getInputClassName('bedrooms')}
                  placeholder="საძინებლების რაოდენობა"
                />
              <div className={getMessageClassName('bedrooms')}>
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {errors.bedrooms || 'მხოლოდ მთელი რიცხვები'}
              </div>
              </div>
            </div>
            <div className="bottom-[20px]">
              <label className="font-bold text-base mb-[5px] block">აღწერა *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={getInputClassName('description')}
                rows="4"
                placeholder="აღწერა"
              ></textarea>
              <div className={getMessageClassName('description')}>
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {errors.description || 'მინიმუმ ხუთი სიტყვა'}
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
            <div className="border-2 border-dashed border-[#2D3648] rounded-md p-4 flex items-center justify-center min-h-[120px]">
              {!imagePreview ? (
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V16" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H16" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm text-gray-500">ატვირთეთ ფოტო</span>
                </label>
              ) : (
                <div className="relative">
                  <img src={imagePreview} alt="Uploaded preview" className="max-w-[100px] max-h-[100px] object-cover" />
                  <button 
                    onClick={removeImage}
                    className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md"
                    type="button"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              </div>
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