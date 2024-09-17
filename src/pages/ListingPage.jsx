import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import { apiGet } from '../services/apiRequest';

const ListingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const { id } = location.state || {};

    useEffect(() => {
        if (!id) {
            navigate('/');
            return;
        }
        const fetchData = async () => {
            try {
                const res = await apiGet(`/real-estates/${id}`);
                setListing(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchData();
    }, [id, navigate]);

    if (!listing) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-[1920px] min-h-[1080px] overflow-x-hidden bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 mb-6">
                    ← Back
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src={listing.image} alt={listing.description} className="w-full h-auto rounded-lg shadow-lg" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{listing.price.toLocaleString()} ₾</h1>
                        <p className="text-gray-600 mb-2">
                            📍 {listing.address}, {listing.city.name}
                        </p>
                        <p className="text-gray-600 mb-4">ZIP: {listing.zip_code}</p>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="border p-4 rounded">
                                <span>{listing.area} m²</span>
                            </div>
                            <div className="border p-4 rounded">
                                <span>{listing.bedrooms} Bedrooms</span>
                            </div>
                            <div className="border p-4 rounded">
                                <span>{listing.is_rental ? 'For Rent' : 'For Sale'}</span>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">{listing.description}</p>
                        <div className="flex items-center">
                            <img src={listing.agent.avatar} alt={listing.agent.name} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold">{listing.agent.name} {listing.agent.surname}</p>
                                <p className="text-gray-600">{listing.agent.email}</p>
                                <p className="text-gray-600">{listing.agent.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ListingPage;