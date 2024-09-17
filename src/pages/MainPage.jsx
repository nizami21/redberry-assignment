import React, { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react';
import { apiGet } from '../services/apiRequest';
import Header from '../components/ui/Header';
import FilterBar from '../components/ui/FilterBar';
import AddAgentModal from '../components/modals/AddAgentModal';
import SkeletonCard from '../components/cards/lazy/ListingCardSkeleton';
import { useNavigate } from 'react-router-dom';

const LazyRealEstateCard = lazy(() => import('/src/components/cards/ListingCard'));
const LoadingState = () => (
  <div className="grid grid-cols-4 gap-5">
    {[...Array(8)].map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

const MainPageContent = ({ filteredListings, regions, bedrooms, handleAgentAdd, handleFilter, handleListingClick }) => {
  const navigate = useNavigate();

  handleListingClick = useCallback((id) => {
    navigate('/listing', { state: { id } });
  }, [navigate]);

  return (
    <>
      <FilterBar onAgentAdd={handleAgentAdd} bedrooms={bedrooms} regions={regions} onFilter={handleFilter} />
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-4 gap-5">
          {filteredListings.map((listing) => (
            <Suspense key={listing.id} fallback={<SkeletonCard />}>
              <LazyRealEstateCard 
                onClick={() => handleListingClick(listing.id)}
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
      ) : (
        <div className='font-figaRO text-xl leading-6 font-medium text-left w-full'>აღნიშნული მონაცემებით განცხადება არ იძებნება</div>
      )}
    </>
  );
};

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
  }, []);

  const handleAgentAdd = useCallback(() => {
    agentModalRef.current.toggleModal();
  }, []);

  const handleFilter = useCallback((filters) => {
    setFilteredListings(prevListings => 
      listings.filter(listing => {
        if (filters.region.length > 0 && !filters.region.some(region => region.id === listing.city.region_id)) {
          return false;
        }
    
        if (filters.priceCategory.length > 0) {
          const priceFilter = filters.priceCategory[0];
          if (
            (priceFilter.min !== null && listing.price < priceFilter.min) ||
            (priceFilter.max !== null && listing.price > priceFilter.max)
          ) {
            return false;
          }
        }
    
        if (filters.area.length > 0) {
          const areaFilter = filters.area[0];
          if (
            (areaFilter.min !== null && listing.area < areaFilter.min) ||
            (areaFilter.max !== null && listing.area > areaFilter.max)
          ) {
            return false;
          }
        }
    
        if (filters.bedrooms.length > 0 && !filters.bedrooms.some(bedroom => parseInt(bedroom.name) === listing.bedrooms)) {
          return false;
        }
    
        return true;
      })
    );
  }, [listings]);



  return (
    <div className='max-w-[1920px] min-h-[1080px] overflow-x-hidden bg-white'>
      <Header />
      <div className="px-[162px] py-8">
        {isLoading ? (
          <LoadingState />
        ) : (
          <MainPageContent
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