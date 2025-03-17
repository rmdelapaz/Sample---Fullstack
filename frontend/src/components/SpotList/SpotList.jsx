import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './SpotList.css';

const SpotList = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('/api/spots');
        const data = await response.json();

        // Fetch reviews 
        const spotsWithRatings = await Promise.all(
          data.Spots.map(async (spot) => {
            const reviewsRes = await fetch(`/api/spots/${spot.id}/reviews`);
            const reviewsData = await reviewsRes.json();

            //average rating
            const reviews = reviewsData.Reviews || [];
            const reviewCount = reviews.length;
            const averageRating = reviewCount
              ? (reviews.reduce((sum, review) => sum + review.stars, 0) / reviewCount).toFixed(1)
              : "New";

            return {
              ...spot,
              avgStarRating: averageRating,
              numReviews: reviewCount
            };
          })
        );
        const sortedSpots = spotsWithRatings.sort((a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
        );
        setSpots(sortedSpots);
      } catch (error) {
        console.error('Error fetching spots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

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
              {/* Spot name and rating */}
              <div className="spot-header">
                <h2 className="spot-name" title={spot.name}>{spot.name}</h2>
                <div className="spot-rating">
                  <span className="star-icon">★</span>
                  {spot.avgStarRating}{" "}
                  {spot.numReviews > 0 ? `· ${spot.numReviews} Review${spot.numReviews > 1 ? "s" : ""}` : ""}
                </div>
              </div>

              {/* Location and price */}
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
