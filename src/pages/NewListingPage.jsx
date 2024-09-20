import React, { useEffect, useRef, useState } from 'react';
import Header from '/src/components/ui/Header';
import { apiGet, apiPost } from '../services/apiRequest';
import AddAgentModal from '/src/components/modals/AddAgentModal';
import AddButton from '/src/components/ui/inputs/AddButton.jsx';
import { useNavigate } from 'react-router-dom';
import CancelButton from '../components/ui/CancelButton';
import CustomSelect from '../components/ui/inputs/CustomSelect';

const NewListingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('newListingFormData');
    return savedData ? JSON.parse(savedData) : {
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
    };
  });


  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const agentModalRef = useRef();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regionsResponse, citiesResponse, agentsResponse] = await Promise.all([
          apiGet('/regions'),
          apiGet('/cities'),
          apiGet('/agents')
        ]);

        setRegions(regionsResponse.data);
        setCities(citiesResponse.data);
        setAgents(agentsResponse.data);
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

  useEffect(() => {
    localStorage.setItem('newListingFormData', JSON.stringify(formData));
  }, [formData]);
  const handleAgentAdded = (newAgent) => {
    setAgents(prevAgents => [...prevAgents, newAgent]);
    setFormData(prev => ({ ...prev, agent_id: newAgent.id }));
  };


  const handleSelectChange = (name, selectedOption) => {
    console.log(`handleSelectChange called for ${name}:`, selectedOption);
    setFormData(prev => ({ ...prev, [name]: selectedOption.id }));
    
    if (name === 'region_id') {
      setFormData(prev => ({ ...prev, city_id: '' }));
      const cityList = cities.filter(city => city.region_id === selectedOption.id);
      setFilteredCities(cityList);
    }
  };

  const handleInputChange = (e) => {
    console.log(formData.is_rental);
    const { name, value, type } = e.target;
    let updatedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    if(value == 'add-agent'){
      agentModalRef.current.toggleModal();
    }
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
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'გთხოვთ ატვირთოთ მხოლოდ სურათი' }));
        e.target.value = ''; // Clear the file input
        return;
      }
      if(file.size > 1 * 1000 * 1024){
        setErrors(prev => ({...prev, image: 'სურათის ზომა არ უნდა აღემატებოდეს 1MB-ს'}));
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      const error = validateField('image', file);
      setErrors(prev => ({ ...prev, image: error }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'region_id':
      case 'city_id':
      case 'agent_id':
        if (!value) error = 'ეს ველი სავალდებულოა';
        break;
      case 'address':
        if (value.length < 2) error = 'მინიმუმ ორი სიმბოლო';
        if (!value) error = 'ეს ველი სავალდებულოა';
        break;
      case 'zip_code':
      case 'price':
      case 'area':
      case 'bedrooms':
        if (!/^\d*\.?\d*$/.test(value)) error = 'მხოლოდ რიცხვები';
        if (name === 'bedrooms' && !Number.isInteger(Number(value))) error = 'მხოლოდ მთელი რიცხვები';
        if (!value) error = 'ეს ველი სავალდებულოა';

        break;
      case 'description':
        if (value.trim().split(/\s+/).length < 5) error = 'მინიმუმ ხუთი სიტყვა';
        if (!value) error = 'ეს ველი სავალდებულოა';

        break;
      case 'image':
        if(value) {
          if (value.size > 1024 * 1024) { // 1MB in bytes
            error = 'სურათი არ უნდა აღემატებოდეს 1MB-ს';
          } else if (!value.type.startsWith('image/')) {
            error = 'გთხოვთ ატვირთოთ მხოლოდ სურათი';
          }
        }
        if (!value) error = 'ეს ველი სავალდებულოა';

        break;
      case 'is_rental':
        if (value === null) error = 'გთხოვთ აირჩიოთ გარიგების ტიპი';
        break;
      default:
        if (!value) error = 'ეს ველი სავალდებულოა';
    }
    return error;
  };

  const getInputClassName = (fieldName) => {
    let baseClass = "w-full mt-[5px] h-[42px] focus:outline-none p-2  border rounded-[6px] ";
    if (!formData[fieldName]) return baseClass + "border-[#808A93]";
    return baseClass + (errors[fieldName] ? "border-[#F93B1D]" : "border-[#45A849]");
  };

  const getMessageClassName = (fieldName) => {
    const defaultStyle = "flex items-end mt-[4px] font-firaGO text-sm font-normal focus:outline-none focus:border-none leading-[16.8px] text-left";
    if (!formData[fieldName]) return `${defaultStyle} text-[#021526]`;
    return errors[fieldName] ? `${defaultStyle} text-[#F93B1D]` : `${defaultStyle} text-[#45A849]`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length === 0) {
      try {
        const postData = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined) {
            postData.append(key, formData[key]);
          }
        });
        const response = await apiPost('/real-estates', postData);
  
        if (response.status === 201) {
          console.log('Real Estate added successfully:', response.data);          
          localStorage.removeItem('newListingFormData');
          setFormData({
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
          setImagePreview(null);
          navigate(-1);
        } else if (response.status === 401) {
          alert('Unauthorized request');
        } else {
          console.error('Error in response:', response);
        }
      } catch (error) {
        console.error('Error adding real estate:', error);
      }
    } else {
      console.log("Form contains errors:", formErrors);
    }
  };
  
  
  return (
    <div className="min-h-screen font-figaRO text-[#021526]">
      <Header />
      <div className="max-w-[790px] mx-auto bg-white p-8 shadow-sm mt-8">
        <h1 className="text-3xl font-bold text-center mb-[61px]">ლისტინგის დამატება</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-20">
            <h3 className="text-[18px] leading-[19.54px] font-medium mb-2 font-helveticaNeue">გარიგების ტიპი</h3>
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="is_rental"
                    value={0}
                    checked={formData.is_rental === 0}
                    onChange={() => setFormData(prev => ({ ...prev, is_rental: 0 }))}
                    className="sr-only"
                  />
                  <div className="w-[17px] h-[17px] border-[1px] border-[#021526] rounded-full">
                    <div className={`w-[7px] h-[7px] bg-[#021526] rounded-full absolute top-[5px] left-[5px] transition-opacity ${formData.is_rental === 0 ? 'opacity-100' : 'opacity-0'}`}></div>
                  </div>
                </div>
                <span className="ml-2 text-base">იყიდება</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="is_rental"
                    value={1}
                    checked={formData.is_rental === 1}
                    onChange={() => setFormData(prev => ({ ...prev, is_rental: 1 }))}
                    className="sr-only"
                  />
                  <div className="w-[17px] h-[17px] border-[1px] border-[#021526] rounded-full">
                    <div className={`w-[7px] h-[7px] bg-[#021526] rounded-full absolute top-[5px] left-[5px] transition-opacity ${formData.is_rental === 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                  </div>
                </div>
                <span className="ml-2 text-base">ქირავდება</span>
              </label>
            </div>
            {errors.is_rental && (
              <div className={getMessageClassName('is_rental')}>
                <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {errors.is_rental}
              </div>
            )}
          </div>

          <div className="mb-20">
            <label className="font-medium font-helveticaNeue text-lg mb-[22px] block">მდებარეობა</label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">მისამართი*</p>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={getInputClassName('address')}
                  placeholder="მისამართი"
                />
                <div className={getMessageClassName('address')}>
                  <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {errors.address || 'მინიმუმ ორი სიმბოლო'}
                </div>
              </div>
              <div>
                <p className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">საფოსტო ინდექსი*</p>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  className={getInputClassName('city_id')}
                  placeholder="საფოსტო ინდექსი"
                />
                  <div className={getMessageClassName('zip_code')}>
                    <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {errors.zip_code || 'მხოლოდ რიცხვები'}
                  </div> 
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">რეგიონი</p>
              <CustomSelect
                options={regions}
                onSelect={(option) => handleSelectChange('region_id', option)}
                placeholder="აირჩიეთ"
                value={formData.region_id}
              />
              {errors.region_id && (
                <div className={getMessageClassName('region_id')}>
                  <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                    {errors.region_id || ''}
                </div>
              )}
            </div>
            <div>
              <p className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">ქალაქი</p>
              <CustomSelect
                options={filteredCities}
                onSelect={(option) => handleSelectChange('city_id', option)}
                placeholder="აირჩიეთ"
                value={formData.city_id}
                disabled={!formData.region_id}
              />
              {errors.city_id && (
                <div className={getMessageClassName('zip_code')}>
                  <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                    {errors.city_id || ''}
                </div>
              )}
            </div>
          </div>
          </div>

          <div className="mb-20">
            <div className='bottom-5'>
              <label className="font-medium font-helveticaNeue text-lg mb-[22px] block">ბინის დეტალები</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">ფასი</p>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={getInputClassName('price')}
                    placeholder="ფასი"
                  />
                  <div className={getMessageClassName('price')}>
                    <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {errors.price || 'მხოლოდ რიცხვები'}
                  </div>                  
                </div>
                <div>
                  <p className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">ფართობი</p>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className={getInputClassName('area')}
                    placeholder="ფართობი"
                  />
                  <div className={getMessageClassName('area')}>
                    <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {errors.area || 'მხოლოდ რიცხვები'}
                  </div>
                </div>
              </div>
              <div className="mb-4 w-1/2">
                <p className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">საძინებლების რაოდენობა*</p>
                <input
                  type="text"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className={getInputClassName('bedrooms')}
                  placeholder="საძინებლების რაოდენობა"
                />
              <div className={getMessageClassName('bedrooms')}>
                <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {errors.bedrooms || 'მხოლოდ მთელი რიცხვები'}
              </div>
              </div>
            </div>
            <div className="bottom-[20px]">
              <label className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">აღწერა *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`${getInputClassName('description')} resize-none min-h-[135px] focus:outline-none`}
                rows="4"
                placeholder="აღწერა"
              ></textarea>
              <div className={getMessageClassName('description')}>
                <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {errors.description || 'მინიმუმ ხუთი სიტყვა'}
              </div>
            </div>

            <div className="">
              <label className="font-medium text-base mt-5 mb-[5px] block">ატვირთეთ ფოტო *</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                accept="image/*"
              />
              <div className="border-[1px] border-dashed border-[#2D3648] rounded-lg flex items-center justify-center h-[120px]">
                {!imagePreview ? (
                  <label 
                    htmlFor="image-upload" 
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8V16" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12H16" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </label>
                ) : (
                  <div className="relative">
                    <img src={imagePreview} alt="Uploaded preview" className="max-w-[110px] max-h-[110px] object-cover rounded" />
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
              {errors.image && (
                <div className={getMessageClassName('image')}>
                  <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {errors.image || ''}
                </div>
              )}
            </div>
          </div>

          <div className="mb-20">
          </div>

          <div className="mb-20 w-1/2">
            <label className="font-medium font-helveticaNeue text-lg mb-[22px] block">აგენტი</label>
            <p className="font-firaGO text-sm font-semibold leading-[16.8px] text-left mb-[5px]">აირჩიე</p>
            <CustomSelect
              options={agents}
              onSelect={(option) => handleSelectChange('agent_id', option)}
              placeholder="აირჩიე აგენტი"
              value={formData.agent_id}
              addOption="აგენტის დამატება"
              onAddOption={() => agentModalRef.current.toggleModal()}
            />
              {errors.agent_id && (
                <div className={getMessageClassName('agent_id')}>
                  <svg className="w-5 h-5  mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                    {errors.agent_id || ''}
                </div>
              )}
          </div>
        </form>
        
        <div className="flex justify-end space-x-4">
          <CancelButton onClick={() => navigate(-1)} />
          <AddButton onClick={handleSubmit} type='filled' text='დაამატეთ ლისტინგი' noPlus={true} />
        </div>
      </div>
      <AddAgentModal ref={agentModalRef} onAgentAdded={handleAgentAdded}/>
    </div>
  );
};

export default NewListingPage;