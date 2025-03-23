import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSpots } from "../../store/spot";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpot/DeleteSpot";
import "./ManageSpots.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sessionUser = useSelector((state) => state.session.user);
  const spotsObj = useSelector((state) => state.spots.spots);
  const allSpots = Object.values(spotsObj);
  const userSpots = allSpots.filter((spot) => spot.ownerId === sessionUser?.id);

  useEffect(() => {
    if (sessionUser) {
      dispatch(getAllSpots());
    }
  }, [dispatch, sessionUser]);

  const handleUpdate = (spotId) => navigate(`/spots/${spotId}/edit`);

  const handleTileClick = (spotId) => navigate(`/spots/${spotId}`);

  if (!sessionUser) return <p>Please log in to manage your spots.</p>;


  return (
    <div className="manage-spots-page">
      <h1>Manage Spots</h1>
      {userSpots.length === 0 ? (
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
          {userSpots.map((spot) => (
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
                    <span className="star-icon">⭐️</span>
                    {spot.avgStarRating}{" "}
                    {spot.numReviews > 0
                      ? `· ${spot.numReviews} Review${spot.numReviews > 1 ? "s" : ""}`
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
                        onDelete={() => dispatch(getAllSpots())}
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