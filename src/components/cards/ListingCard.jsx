import React from 'react';
import addressLogo from '/src/assets/img/address-post.svg';
import areaLogo from '/src/assets/img/area-logo.svg';
import bedLogo from '/src/assets/img/bed.svg';
import locationLogo from '/src/assets/img/location-marker.svg';
import { formatPrice } from '../../utilities/formatPrice';

const RealEstateCard = ({ price, city, location, bedrooms, area, zipcode, imageUrl, isRental, onClick }) => {
  const statusText = isRental ? "ქირავდება" : "იყიდება";

  return (
    <div className="w-[384px] max-h-[455px] rounded-lg overflow-hidden shadow-none border-[1px] border-[#DBDBDB] hover:shadow-[5px_5px_12px_0px_rgba(2,21,38,0.08)] transition-shadow duration-150 delay-75 ease-in-out bg-white" onClick={onClick}>
      <div className="relative">
        <img className="w-full h-[307px] object-cover" src={imageUrl} alt="Property" />
        <div className="absolute top-4 left-4 bg-[#021526] bg-opacity-50 min-w-[90px] h-[26px] text-white font-firaGo font-medium text-[12px] leading-[14.4px] text-center p-[6px] rounded-[15px]">
          {statusText}
        </div>
      </div>
      <div className="p-4">
        <div className="font-black font-firaGo text-3xl mb-2">{formatPrice(price)} ₾</div>
        <p className="text-gray-600 font-firaGo font-medium text-[16px] leading-[19.2px] flex items-center mb-3 gap-1">
          <img src={locationLogo} className='w-5 h-5 pt-[1px] object-cover' />
          {city.name}, {location}
        </p>
        <div className="flex justify-start gap-[32px] text-sm text-gray-500">
          <span className="flex items-center gap-1 font-firaGo font-medium text-[16px] leading-[19.2px]">
            <img src={bedLogo} className='w-6 h-6' />
            {bedrooms}
          </span>
          <span className="flex items-center gap-1 font-firaGo font-medium text-[16px] leading-[19.2px]">
            <img src={areaLogo} className='w-4 h-5' />
            {area} მ²
          </span>
          <span className="flex items-center gap-1 font-firaGo font-medium text-[16px] leading-[19.2px]">
            <img src={addressLogo} className='w-4 h-4' />
            {zipcode}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCard;