import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';
import DeleteReview from "../DeleteReview/DeleteReview";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import './SpotDetail.css';

function SpotDetail() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {

    const fetchSpotDetails = async () => {
      const response = await fetch(`/api/spots/${spotId}`);
      const data = await response.json();
      setSpot(data);
    };


    const fetchReviews = async () => {
      const response = await fetch(`/api/spots/${spotId}/reviews`);
      const data = await response.json();
      setReviews(data.Reviews || []);
    };

    fetchSpotDetails();
    fetchReviews();
  }, [spotId]);
  const handleAddReview = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };
  if (!spot) return <div>Loading...</div>;

  // Calculate average rating and review count 
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? (reviews.reduce((sum, review) => sum + review.stars, 0) / reviewCount).toFixed(1)
      : "New";

  const handleReserve = () => {
    alert("Feature coming soon!");
  };

  return (
    <div className="spot-detail-page">
      {/* Header Section */}
      <div className="spot-header">
        <h1>{spot.name}</h1>
        <h2>
          {spot.city}, {spot.state}, {spot.country}
        </h2>
      </div>

      {/* Images Section */}
      <div className="spot-images">
        <div className="main-image-container">
          <img
            src={spot.SpotImages?.[0]?.url || "/placeholder.jpg"}
            alt="Main"
            className="main-image"
          />
        </div>
        <div className="thumbnail-grid">
          {spot.SpotImages?.slice(1, 5).map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail"
            />
          ))}
        </div>
      </div>

      <div className="content-container">
        {/* Left Side - Spot Info */}
        <div className="spot-info">
          <p>
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </p>
          <p>{spot.description}</p>
        </div>

        {/* Right Side - Reserve Box */}
        <div className="reserve-box">
          <div className="info-container">
            <span className="price">{`$${spot.price}`}</span>
            <span className="per-night">/ night</span>
            <div className="rating">
              <span>★ {averageRating}</span>
              {reviewCount > 0 && (
                <span>
                  {" "}
                  · {reviewCount} Review{reviewCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleReserve} className="reserve-button">
            Reserve
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>
          ⭐️ {averageRating} · {reviewCount} Review{reviewCount > 1 ? "s" : ""}
        </h3>

        {/* Post Your Review Button */}
        {sessionUser && sessionUser.id !== spot.ownerId && !reviews.some((review) => review.userId === sessionUser.id) && (
          <div className="post-review-container">
            <OpenModalButton
              buttonText="Post Your Review"
              className="post-review-button"
              modalComponent={<ReviewFormModal spotId={spotId} onAddReview={handleAddReview} />}
            />
          </div>
        )}
        {/* List of Reviews */}
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <p>
                  <strong>{review.User?.firstName}</strong> -{" "}
                  {new Date(review.createdAt).toLocaleString("en-us", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>{review.review}</p>

                {/* Delete button only for review owner */}
                {sessionUser && sessionUser.id === review.userId && (
                  <OpenModalButton
                    buttonText="Delete"
                    className="delete-review-button"
                    modalComponent={
                      <DeleteReview
                        reviewId={review.id}
                        onReviewDeleted={(deletedReviewId) =>
                          setReviews((prevReviews) =>
                            prevReviews.filter((review) => review.id !== deletedReviewId)
                          )
                        }
                      />
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews-text">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default SpotDetail;
