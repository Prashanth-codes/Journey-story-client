import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/cards/TravelStoryCard';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/cards/EmptyCard';
import EmptyImg from '../../assets/images/start.jpg';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/cards/FilterInfoTitle';
import { getEmptyCardMessage } from '../../utils/helper';
import StoryOptions from './StoryOptions';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });
  const [activeTab, setActiveTab] = useState('my'); // 'my' for My Stories, 'all' for All Stories

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  // Get all stories (My Stories or All Stories based on activeTab)
  const getAllTravelStories = async () => {
    try {
      const endpoint = activeTab === 'my' ? '/get-all-stories' : '/get-stories';
      const response = await axiosInstance.get(endpoint);
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again');
    }
  };

  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: 'edit', data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put('update-is-favourite/' + storyId, {
        isFavourite: !storyData.isFavourite,
      });
      if (response.data && response.data.story) {
        toast.success('Story updated successfully');
        getAllTravelStories();
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again');
    }
  };

  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete('/delete-story/' + storyId);
      if (response.data && !response.data.error) {
        toast.error('Story deleted successfully');
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again');
    }
  };
  const onSearchStory = async(query) => {
    try{
      const response = await axiosInstance.get("/search",{
        params: {
          query,
        },
      });

      if(response.data && response.data.stories){
        setFilterType("search");
        setAllStories(response.data.stories);
      }

      
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("An unexpected error occured.Please try again");
      }
    }
  }

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  }

  const filterStoriesByDate = async(day) => {
    try{
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if(startDate && endDate){
        const response = await axiosInstance.get("/travel-stories/filter",{
          params: {startDate,endDate}
        })
        if(response.data && response.data.stories){
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    }catch(error){
      console.log("An unexpected error occured. Please try again");
    }
  }

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  }

  const resetFilter = () => {
    setDateRange({from: null, to: null});
    setFilterType("");
    getAllTravelStories("");
  }

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, [activeTab]); // Re-fetch stories when activeTab changes

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className='container mx-auto py-10 bg-cyan-50'>
        {/* New StoryOptions Component */}
        <StoryOptions activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <FilterInfoTitle filterType={filterType} filterDates={dateRange} onClear={() => resetFilter()} />
        
        <div className='flex gap-7'>
          <div className='flex-1'></div>
          {allStories.length > 0 ? (
            <div className='grid grid-cols-2 gap-4'>
              {allStories.map((item) => (
                <TravelStoryCard
                  key={item._id}
                  imgUrl={item.imageUrl}
                  title={item.title}
                  story={item.story}
                  date={item.visitedDate}
                  visitedLocation={item.visitedLocation}
                  isFavourite={item.isFavourite}
                  onClick={() => handleViewStory(item)}
                  onFavouriteClick={() => updateIsFavourite(item)}
                  showEditDelete={userInfo?._id === item.userId}
                />
              ))}
            </div>
          ) : (
            <EmptyCard imgSrc={EmptyImg} message={getEmptyCardMessage(filterType)} />
          )}
          <div className='w-[340px] mr-3'>
            <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
              <div className='p-3'>
                <DayPicker
                  captionLayout='dropdown-buttons'
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add and edit travel story model */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
          },
        }}
        appElement={document.getElementById('root')}
        className='model-box'
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: 'add', data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View travel story modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
          },
        }}
        appElement={document.getElementById('root')}
        className='model-box'
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
          isOwner={userInfo?._id === openViewModal.data?.userId}
        />
      </Modal>

      <button
        className='w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 fixed right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: 'add', data: null });
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
