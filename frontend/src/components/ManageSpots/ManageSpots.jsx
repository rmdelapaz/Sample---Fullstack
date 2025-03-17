import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpot/DeleteSpot";
import "./ManageSpots.css";

function ManageSpots() {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpots = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/spots/current`);
        const data = await response.json();

        const spotsWithRatings = await Promise.all(
          data.Spots.map(async (spot) => {
            const reviewsRes = await fetch(`/api/spots/${spot.id}/reviews`);
            const reviewsData = await reviewsRes.json();

            const reviews = reviewsData.Reviews || [];
            const reviewCount = reviews.length;
            const averageRating =
              reviewCount > 0
                ? (
                  reviews.reduce((sum, review) => sum + review.stars, 0) /
                  reviewCount
                ).toFixed(1)
                : "New";

            return {
              ...spot,
              avgStarRating: averageRating,
              numReviews: reviewCount,
            };
          })
        );

        const sortedSpots = spotsWithRatings.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );

        setSpots(sortedSpots);
      } catch (error) {
        console.error("Error fetching spots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionUser) fetchSpots();
  }, [sessionUser]);

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };
  const handleDelete = async (spotId) => {
    try {
      const response = await fetch(`/api/spots/${spotId}`, { method: "DELETE" });

      if (response.ok) {
        setSpots((prevSpots) => prevSpots.filter((spot) => spot.id !== spotId));
      } else {
        console.error("Failed to delete spot");
      }
    } catch (error) {
      console.error("Error deleting spot:", error);
    }
  };
  const handleTileClick = (spotId) => {

    navigate(`/spots/${spotId}`);
  };

  if (!sessionUser) return <p>Please log in to manage your spots.</p>;

  return (
    <div className="manage-spots-page">
      <h1>Manage Spots</h1>
      {isLoading ? (
        <div className="loading">
          <p>Loading spots...</p>
        </div>
      ) : spots.length === 0 ? (
        <div className="no-spots">
          <p className="no-spots-message">You have not created any spots yet.</p>
          <button
            onClick={() => navigate("/spots/new")}
            className="create-spot-button"
          >
            Create a New Spot
          </button>
        </div>
      ) : (
        <div className="spot-list">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className="spot-tile"
              onClick={() => handleTileClick(spot.id)}
            >
              <img
                src={spot.previewImage || "/default-image.png"}
                alt={spot.name}
                className="spot-image"
              />
              <div className="spot-info">
                <div className="spot-header">
                  <h2 className="spot-name" title={spot.name}>
                    {spot.name}
                  </h2>
                  <div className="spot-rating">
                    <span className="star-icon">★</span>
                    {spot.avgStarRating}{" "}
                    {spot.numReviews > 0
                      ? `· ${spot.numReviews} Review${spot.numReviews > 1 ? "s" : ""
                      }`
                      : ""}
                  </div>
                </div>

                <p className="spot-location">
                  {spot.city}, {spot.state}
                </p>
                <p className="spot-price">${spot.price} / night</p>

                <div className="spot-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(spot.id);
                    }}
                    className="update-button"
                  >
                    Update
                  </button>
                  <OpenModalButton
                    className="custom-delete-button"
                    buttonText="Delete"
                    modalComponent={
                      <DeleteSpotModal
                        spotId={spot.id}
                        onDelete={() => handleDelete(spot.id)}
                      />
                    }
                    onButtonClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageSpots;
