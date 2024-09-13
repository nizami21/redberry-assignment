import React, { useEffect, useState } from 'react';
import { apiGet } from '../services/apiRequest';
import RealEstateCard from '../components/ListingCard';
import Header from '../components/Header';

const MainPage = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await apiGet('/real-estates');
            setListings(res.data);
            console.log(res.data);
        }

        fetchData();
    }, [])

    return (
        <div className='w-screen min-h-screen bg-gray-100'>
            <Header />
            <div className="px-[162px] py-8">
                <div className="grid grid-cols-4 gap-5">
                    {listings.map((listing) => (
                        <RealEstateCard 
                            key={listing.id}
                            price={listing.price}
                            city={listing.city}
                            location={listing.address}
                            bedrooms={listing.bedrooms}
                            area={listing.area}
                            zipcode={listing.zip_code}
                            imageUrl={listing.image}
                            isRental={listing.is_rental}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPage;