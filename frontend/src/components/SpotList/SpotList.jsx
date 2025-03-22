import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spot';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import './SpotList.css';


//  Memoized selector to avoid returning new array every time
const selectSpotsObj = state => state.spots.spots;
const selectSpots = createSelector(
  [selectSpotsObj],
  spotsObj => Object.values(spotsObj)
);


const SpotList = () => {
  const dispatch = useDispatch(); //Get Redux dispatcher
  const spots = useSelector(selectSpots);
  const loading = useSelector(state => !state.spots.spots || Object.keys(state.spots.spots).length === 0); //Loading check


  useEffect(() => {
    if (!spots.length) { //Only fetch spots if Redux store is empty
      dispatch(getAllSpots());
    }
  }, [dispatch, spots.length]); //Dependency array updated

  if (loading) {
    return <div className="loading">Loading spots...</div>;
  }

  return (
    <div className="spot-list">
      {spots.length > 0 ? (
        spots.map((spot) => (
          <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-tile">
            <img
              src={spot.previewImage || '/default-image.png'}
              alt={spot.name}
              className="spot-image"
            />
            <div className="spot-info">
              <div className="spot-header">
                <h2 className="spot-name" title={spot.name}>{spot.name}</h2>
                <div className="spot-rating">
                  <span className="star-icon">⭐️</span>
                  {spot.avgStarRating}{" "}
                  {spot.numReviews > 0 ? `· ${spot.numReviews} Review${spot.numReviews > 1 ? "s" : ""}` : ""}
                </div>
              </div>
              <p className="spot-location">
                {spot.city}, {spot.state}
              </p>
              <p className="spot-price">${spot.price} / night</p>
            </div>
          </Link>
        ))
      ) : (
        <p className='no-spots-message'>No spots available</p>
      )}
    </div>
  );
};

export default SpotList;