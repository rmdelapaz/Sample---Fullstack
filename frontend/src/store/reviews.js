import { csrfFetch } from './csrf';

// Action Types
const ADD_REVIEW = 'reviews/addReview';
const GET_REVIEWS = 'reviews/getReviews';
const DELETE_REVIEW = 'reviews/deleteReview';

// Action Creators
export const addReviewAction = (spotId, review) => ({
  type: ADD_REVIEW,
  payload: { spotId, review },
});

export const getReviewsAction = (spotId, reviews) => ({
  type: GET_REVIEWS,
  payload: { spotId, reviews },
});

export const deleteReviewAction = (spotId, reviewId) => ({
  type: DELETE_REVIEW,
  payload: { spotId, reviewId },
});

// Thunks
export const addReview = (spotId, reviewData) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });

  if (res.ok) {
    const newReview = await res.json();
    dispatch(addReviewAction(spotId, newReview));
    return newReview;
  } else {
    const errors = await res.json();
    throw errors;
  }
};

export const getReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const { Reviews } = await res.json(); // Assuming API returns an object with a "Reviews" array
    dispatch(getReviewsAction(spotId, Reviews));
  }
};

export const deleteReview = (spotId, reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(deleteReviewAction(spotId, reviewId));
  } else {
    const errors = await res.json();
    throw errors;
  }
};

// Initial State
const initialState = {
  reviews: {}, // Reviews keyed by spot ID
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REVIEW: {
      const { spotId, review } = action.payload;
      const updatedReviews = state.reviews[spotId]
        ? [...state.reviews[spotId], review]
        : [review];
      return {
        ...state,
        reviews: { ...state.reviews, [spotId]: updatedReviews },
      };
    }
    case GET_REVIEWS: {
      const { spotId, reviews } = action.payload;
      return {
        ...state,
        reviews: { ...state.reviews, [spotId]: reviews },
      };
    }
    case DELETE_REVIEW: {
      const { spotId, reviewId } = action.payload;
      const updatedReviews = state.reviews[spotId]?.filter(
        (review) => review.id !== reviewId
      );
      return {
        ...state,
        reviews: { ...state.reviews, [spotId]: updatedReviews },
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
