import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { apiGet } from '../services/apiRequest';
import Header from '../components/ui/Header';
import FilterBar from '../components/ui/FilterBar';
import AddAgentModal from '../components/modals/AddAgentModal';
import SkeletonCard from '../components/cards/lazy/ListingCardSkeleton';

const LazyRealEstateCard = lazy(() => import('/src/components/cards/ListingCard'));

const MainPage = () => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [regions, setRegions] = useState([]);
    const agentModalRef = useRef();
    
    useEffect(() => {
        const fetchData = async () => {
            const [listingsResponse, regionsResponse] = await Promise.all([
                apiGet('/real-estates'),
                apiGet('/regions'),

            ]);
            setListings(listingsResponse.data);
            setFilteredListings(listingsResponse.data);
            setRegions(regionsResponse.data);
        }
        fetchData();
    }, [])

    const handleAgentAdd = () => {
        agentModalRef.current.toggleModal();
    };

    const handleFilter = (filters) => {
        const filtered = listings.filter(listing => {
            const price = Number(listing.price);
            const area = Number(listing.area);
            const bedrooms = Number(listing.bedrooms);

            return (
                (!filters.priceMin || price >= Number(filters.priceMin)) &&
                (!filters.priceMax || price <= Number(filters.priceMax)) &&
                (!filters.areaMin || area >= Number(filters.areaMin)) &&
                (!filters.areaMax || area <= Number(filters.areaMax)) &&
                (!filters.region || listing.city === filters.region) &&
                (!filters.bedrooms || (filters.bedrooms === '4+' ? bedrooms >= 4 : bedrooms === Number(filters.bedrooms)))
            );
        });

        setFilteredListings(filtered);
    };

    return (
        <div className='w-screen min-h-screen bg-white'>
            <Header />
            <div className="px-[162px] py-8">
                <FilterBar onAgentAdd={handleAgentAdd} regions={regions} onFilter={handleFilter} />
                <div className="grid grid-cols-4 gap-5">
                    {filteredListings.map((listing) => (
                        <Suspense key={listing.id} fallback={<SkeletonCard />}>
                            <LazyRealEstateCard 
                                price={listing.price}
                                city={listing.city}
                                location={listing.address}
                                bedrooms={listing.bedrooms}
                                area={listing.area}
                                zipcode={listing.zip_code}
                                imageUrl={listing.image}
                                isRental={listing.is_rental}
                            />
                        </Suspense>
                    ))}
                </div>
            </div>
            <AddAgentModal ref={agentModalRef} />
        </div>
    );
};

export default MainPage;