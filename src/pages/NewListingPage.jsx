import React, { useState } from 'react';
import Header from '../components/Header';

const NewListingPage = () => {
  const [formData, setFormData] = useState({
    listingType: 'იყიდება',
    address: '',
    zipCode: '',
    region: '',
    city: '',
    price: '',
    area: '',
    bedrooms: '',
    description: '',
    agent: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? value : type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-sm mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">ლისტინგის დამატება</h1>

        <form onSubmit={handleSubmit} className="flex-col min-h-[1211px] gap-20">
          <div className="space-y-2">
            <label className="font-bold">განცხადების ტიპი</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="listingType"
                  value="იყიდება"
                  checked={formData.listingType === 'იყიდება'}
                  onChange={handleInputChange}
                  className="mr-2 "
                />
                იყიდება
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="listingType"
                  value="ქირავდება"
                  checked={formData.listingType === 'ქირავდება'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                ქირავდება
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold">მდებარეობა</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>მისამართი*</p>
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
                <p>მისამართი*</p>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="საფოსტო ინდექსი"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p>რეგიონი</p>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">რეგიონი</option>
                  {/* Add region options here */}
                </select>
              </div>
              <div>
                <p>ქალაქი</p>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">ქალაქი</option>
                  {/* Add city options here */}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold">ბინის დეტალები</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="ფასი"
              />
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="ფართობი"
              />
            </div>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="საძინებლების რაოდენობა"
            />
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              მხოლოდ რიცხვები
            </div>
            <div className="space-y-2">
              <label className="font-bold">აღწერა</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="4"
                placeholder="აღწერა"
              ></textarea>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                მინიმუმ ხუთი სიტყვა
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-bold">ატვირთეთ ფოტო</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="flex justify-center items-center h-24">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">ჩააგდეთ ფაილი აქ ან აირჩიეთ ფაილი</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold">აგენტი</label>
            <select
              name="agent"
              value={formData.agent}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">აირჩიეთ აგენტი</option>
              {/* Add agent options here */}
            </select>
          </div>
        </form>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" className="px-6 py-2 border border-gray-300 rounded text-gray-700">გაუქმება</button>
            <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded">დაამატე ლისტინგი</button>
          </div>
      </div>
    </div>
  );
};

export default NewListingPage;