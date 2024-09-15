import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { apiGet } from '../services/apiRequest';
import Header from '../components/ui/Header';
import FilterBar from '../components/ui/FilterBar';
import AddAgentModal from '../components/modals/AddAgentModal';
import SkeletonCard from '../components/cards/lazy/ListingCardSkeleton';

const LazyRealEstateCard = lazy(() => import('/src/components/cards/ListingCard'));

const LoadingState = () => (
  <div className="grid grid-cols-4 gap-5">
    {[...Array(8)].map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

const MainPageContent = ({ listings, filteredListings, regions, bedrooms, handleAgentAdd, handleFilter }) => (
  <>
    <FilterBar onAgentAdd={handleAgentAdd} bedrooms={bedrooms} regions={regions} onFilter={handleFilter} />
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
  </>
);

const MainPage = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [regions, setRegions] = useState([]);
  const [bedrooms, setBedrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const agentModalRef = useRef();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsResponse, regionsResponse] = await Promise.all([
          apiGet('/real-estates'),
          apiGet('/regions'),
        ]);
        setListings(listingsResponse.data);
        setFilteredListings(listingsResponse.data);
        setRegions(regionsResponse.data);
        setBedrooms([...new Set(listingsResponse.data.map(listing => listing.bedrooms))]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
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
    <div className='max-w-[1920px] min-h-[1080px] overflow-x-hidden bg-white font-figaRO'>
      <Header />
      <div className="px-[162px] py-8">
        {isLoading ? (
          <LoadingState />
        ) : (
          <MainPageContent
            listings={listings}
            filteredListings={filteredListings}
            regions={regions}
            bedrooms={bedrooms}
            handleAgentAdd={handleAgentAdd}
            handleFilter={handleFilter}
          />
        )}
      </div>
      <AddAgentModal ref={agentModalRef} />
    </div>
  );
};

export default MainPage;