import {
  SUBSCRIPTION_LIST_REQUEST,
  SUBSCRIPTION_LIST_SUCCESS,
  SUBSCRIPTION_LIST_FAIL,
  SUBSCRIPTION_CREATE_REQUEST,
  SUBSCRIPTION_CREATE_SUCCESS,
  SUBSCRIPTION_CREATE_FAIL,
  SUBSCRIPTION_CREATE_RESET,
  SUBSCRIPTION_UPDATE_REQUEST,
  SUBSCRIPTION_UPDATE_SUCCESS,
  SUBSCRIPTION_UPDATE_FAIL,
  SUBSCRIPTION_UPDATE_RESET,
  SUBSCRIPTION_TOGGLE_REQUEST,
  SUBSCRIPTION_TOGGLE_SUCCESS,
  SUBSCRIPTION_TOGGLE_FAIL,
  SUBSCRIPTION_ORDER_REQUEST,
  SUBSCRIPTION_ORDER_SUCCESS,
  SUBSCRIPTION_ORDER_FAIL,
  SUBSCRIPTION_CONFIRM_REQUEST,
  SUBSCRIPTION_CONFIRM_SUCCESS,
  SUBSCRIPTION_CONFIRM_FAIL,
  SUBSCRIPTION_DELETE_REQUEST,
  SUBSCRIPTION_DELETE_SUCCESS,
  SUBSCRIPTION_DELETE_RESET,
  SUBSCRIPTION_DELETE_FAIL,
} from "../constants/subscriptionConstants";

/* =======================
   LIST SUBSCRIPTIONS
======================= */
export const subscriptionListReducer = (
  state = { subscriptions: [] },
  action
) => {
  switch (action.type) {
    case SUBSCRIPTION_LIST_REQUEST:
      return { loading: true, subscriptions: [] };

    case SUBSCRIPTION_LIST_SUCCESS:
      return {
        loading: false,
        subscriptions: action.payload,
      };

    case SUBSCRIPTION_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

/* =======================
   CREATE SUBSCRIPTION
======================= */
export const subscriptionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_CREATE_REQUEST:
      return { loading: true };

    case SUBSCRIPTION_CREATE_SUCCESS:
      return { loading: false, success: true };

    case SUBSCRIPTION_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case SUBSCRIPTION_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

/* =======================
   UPDATE SUBSCRIPTION
======================= */
export const subscriptionUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_UPDATE_REQUEST:
      return { loading: true };

    case SUBSCRIPTION_UPDATE_SUCCESS:
      return { loading: false, success: true };

    case SUBSCRIPTION_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    case SUBSCRIPTION_UPDATE_RESET:
      return {};

    default:
      return state;
  }
};

/* =======================
   TOGGLE SUBSCRIPTION
======================= */
export const subscriptionToggleReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_TOGGLE_REQUEST:
      return { loading: true };

    case SUBSCRIPTION_TOGGLE_SUCCESS:
      return { loading: false, success: true };

    case SUBSCRIPTION_TOGGLE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const subscriptionOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_ORDER_REQUEST:
      return { loading: true };
    case SUBSCRIPTION_ORDER_SUCCESS:
      return { loading: false, order: action.payload };
    case SUBSCRIPTION_ORDER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const subscriptionConfirmReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_CONFIRM_REQUEST:
      return { loading: true };
    case SUBSCRIPTION_CONFIRM_SUCCESS:
      return { loading: false, success: true };
    case SUBSCRIPTION_CONFIRM_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


/* =======================
   DELETE SUBSCRIPTION
======================= */
export const subscriptionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_DELETE_REQUEST:
      return { loading: true };

    case SUBSCRIPTION_DELETE_SUCCESS:
      return { loading: false, success: true };

    case SUBSCRIPTION_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case SUBSCRIPTION_DELETE_RESET:
      return {};

    default:
      return state;
  }
};
