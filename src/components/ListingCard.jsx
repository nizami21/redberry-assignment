import React from 'react';
import addressLogo from '../assets/icons/address-post.svg';
import areaLogo from '../assets/icons/area-logo.svg';
import bedLogo from '../assets/icons/bed.svg';
import locationLogo from '../assets/icons/location-marker.svg';

const RealEstateCard = ({ price,city, location, bedrooms, area, zipcode, imageUrl, isRental }) => {
  const statusText = isRental ? "ქირავდება" : "იყიდება";

  return (
    <div className="w-[384px] max-h-[455px] rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="relative">
        <img className="w-full h-[307px] object-cover" src={imageUrl} alt="Property" />
        <div className="absolute top-3 left-3 bg-gray-800 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
          {statusText}
        </div>
      </div>
      <div className="p-4">
        <div className="font-bold text-2xl mb-2">{price} ₾</div>
        <p className="text-gray-600 text-sm flex items-center mb-3 gap-1">
          <img src={locationLogo} className='w-5 h-5' />
          {city.name}, {location}
        </p>
        <div className="flex justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <img src={bedLogo} className='w-6 h-6' />
            {bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <img src={areaLogo} className='w-4 h-5' />
            {area} მ²
          </span>
          <span className="flex items-center gap-1">
            <img src={addressLogo} className='w-4 h-4' />
            {zipcode}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCard;