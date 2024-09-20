import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiDelete, apiGet } from '../services/apiRequest';
import Header from '../components/ui/Header';
import ListingCard from '../components/cards/ListingCard';
import phoneIcon from '/src/assets/icons/phone.svg';
import emailIcon from '/src/assets/icons/email.svg';
import areaLogo from '/src/assets/icons/area-logo.svg';
import addressPost from '/src/assets/icons/address-post.svg';
import bedLogo from '/src/assets/icons/bed.svg';
import locationMarker from '/src/assets/icons/location-marker.svg';
import leftIcon from '/src/assets/icons/left-arrow.svg';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ConfirmModal from '../components/modals/ConfirmModal';

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`absolute top-1/2 z-10 left-[-35px] cursor-pointer -translate-y-1/2`}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        >
            <img src={leftIcon} alt="Previous" className="w-4 h-4" />
        </div>
    );
}

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`absolute top-1/2 z-10 right-[-35px] cursor-pointer -translate-y-1/2`}
            style={{ display: "block" }}
            onClick={onClick}
        >
            <img src={leftIcon} alt="Next" className="w-4 h-4 transform rotate-180" />
        </div>
    );
}

const ListingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const { id, listings } = location.state || {};
    const [showFullDescription, setShowFullDescription] = useState(false);
    const settings = {
        dots: false,
        infinite: listings.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: false,
        draggable: false,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        arrows: true,
    };
    
    const confirmModalRef = useRef();

    const truncateDescription = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    useEffect(() => {
        if (!id) {
            navigate('/');
            return;
        }
        const fetchData = async () => {
            try {
                const res = await apiGet(`/real-estates/${id}`);
                setListing(res.data);
                window.scrollTo(0, 0);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchData();
        
    }, [id, navigate, listings]);

    if (!listing) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const handleListingDelete = async () => {
        try {
            const res = await apiDelete(`/real-estates/${id}`);
            if(res.status === 200) {
                navigate('/');
            }
        }catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="bg-white min-w-screen min-h-[screen] font-sans text-[#021526]">
            <Header />
            <main className="max-w-[1591px] h-[714px] mx-[162px] mt-[64px]">
                <button className="flex items-center text-gray-600 mb-[29px]" onClick={() => navigate('/')}>
                    <img src={leftIcon} alt="" className="w-6 h-6" />
                </button>
        
                <div className="flex gap-[68px]">
                    <div>
                        <div className="relative">
                            <img
                                src={listing.image}
                                alt={listing.description}
                                className="rounded-t-[14px] w-[839px] h-[670px] object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-[#021526] bg-opacity-50 min-w-[90px] h-[26px] text-white font-figaRO font-medium text-[12px] leading-[14.4px] text-center p-[6px] rounded-[15px]">
                                {listing.is_rental ? 'ქირავდება' : 'იყიდება'}
                            </div>
                        </div>
                        <div className="flex justify-end py-[14px]">
                            <p className="text-sm text-gray-500">გამოქვეყნების თარიღი: {formatDate(listing.created_at)}</p>
                        </div>
                    </div>
            
                    <div className="w-[503px] h-[714px] flex flex-col">
                        <div className='min-w-[338px] pt-[30px] min-h-[246px]'>
                            <h2 className="text-[48px] leading-[57.6px] text-[#021526] font-black font-figaRO mb-6">{listing.price.toLocaleString()}₾</h2>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-[#808A93] gap-2">
                                    <img src={locationMarker} alt="Location" className="w-5 h-5" />
                                    <span className='font-figaRO text-[26px] leading-[28.8px] text-nowrap'>{listing.city.name}, {listing.address}</span>
                                </div>
                                <div className="flex items-center text-[#808A93] gap-2">
                                    <img src={areaLogo} alt="Area" className="w-5 h-5" />
                                    <span className='font-figaRO text-[26px] leading-[28.8px]'>ფართი {listing.area} მ²</span>
                                </div>
                                <div className="flex items-center text-[#808A93] gap-2">
                                    <img src={bedLogo} alt="Bedrooms" className="w-5 h-5" />
                                    <span className='font-figaRO text-[26px] leading-[28.8px]'>საძინებელი {listing.bedrooms}</span>
                                </div>
                                <div className="flex items-center text-[#808A93] gap-2">
                                    <img src={addressPost} alt="Zip Code" className="w-5 h-5" />
                                    <span className='font-figaRO text-[26px] leading-[28.8px]'>საფოსტო ინდექსი {listing.zip_code}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 mb-4 h-40 overflow-y-scroll">
                            <p className="font-normal font-figaRO text-[16px] leading-[26px] text-[#808A93]">
                                {showFullDescription 
                                    ? listing.description 
                                    : truncateDescription(listing.description, 180)}
                            </p>
                            {listing.description.length > 180 && (
                                <button 
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-blue-500 hover:text-blue-700 mt-2"
                                >
                                    {showFullDescription ? 'ნაკლების ნახვა' : 'მეტის ნახვა...'}
                                </button>
                            )}
                        </div>
                        <div className="mt-6 mb-[42px]">
                            <div className="border-[1px] border-[#DBDBDB] py-4 px-5 rounded-lg w-full mb-4">
                                <div className="flex items-center">
                                    <img
                                        src={listing.agent.avatar}
                                        alt={`${listing.agent.name} ${listing.agent.surname}`}
                                        className="w-[64px] h-[64px] rounded-full mr-4"
                                    />
                                    <div>
                                        <p className="font-normal font-figaRO text-[16px] leading-[19.2px]">{listing.agent.name} {listing.agent.surname}</p>
                                        <p className="font-normal font-figaRO text-[14px] leading-[16.8px] text-[#676E76] pt-1">აგენტი</p>
                                    </div>
                                </div>
                                <div className='mt-4 flex-col gap-[4px]'>
                                    <p className='flex items-center gap-[5px] font-normal font-figaRO text-[14px] leading-[16.8px] text-[#808A93]'>
                                        <img src={emailIcon} alt="email icon" className="w-4 h-4" />
                                        {listing.agent.email}
                                    </p>
                                    <p className='flex items-center gap-[5px] font-normal font-figaRO text-[14px] leading-[16.8px] text-[#808A93]'>
                                        <img src={phoneIcon} alt="phone icon" className="w-4 h-4" />
                                        {listing.agent.phone}
                                    </p>
                                </div>
                            </div>
                            <button className='w-1/4 min-h-[34px] min-w-[150px] text-[#808A93] hover:bg-[#808A93] hover:text-[#ffffff] rounded-[8px] border-[1px] border-[#808A93] font-figaRO font-medium text-[14px] leading-[16.8px] transition-all duration-150 delay-75 ease-in-out' onClick={() => confirmModalRef.current.open()}>
                                ლისტინგის წაშლა
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            {listings.length > 1 && (
            <div className='max-w-[1591px] mx-[162px] mt-[84px] mb-[150px]'>
                <h2 className="text-2xl font-bold mb-4">ბინები მსგავს ლოკაციაზე</h2>
                <div className="relative">
                    <Slider {...settings}>
                        {listings.filter(item => item.id !== id).map((listing) => (
                            <div key={listing.id} style={{ width: 'auto' }}>
                                <div className="pr-4">
                                    <ListingCard
                                        onClick={(e) => {
                                            navigate(`/listing/${listing.id}`, { state: { id: listing.id, listings } });
                                        }}
                                        price={listing.price}
                                        city={listing.city}
                                        location={listing.address}
                                        bedrooms={listing.bedrooms}
                                        area={listing.area}
                                        zipcode={listing.zip_code}
                                        imageUrl={listing.image}
                                        isRental={listing.is_rental}
                                    />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            )}
            <ConfirmModal ref={confirmModalRef} message='გსურთ წაშალოთ ლისტინგი?' onConfirm={handleListingDelete}/>
        </div>
    );

};

export default ListingPage;