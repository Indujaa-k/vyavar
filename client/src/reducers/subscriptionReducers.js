import {
  SUBSCRIPTION_CREATE_REQUEST,
  SUBSCRIPTION_CREATE_SUCCESS,
  SUBSCRIPTION_CREATE_FAIL,
  SUBSCRIPTION_LIST_REQUEST,
  SUBSCRIPTION_LIST_SUCCESS,
  SUBSCRIPTION_LIST_FAIL,
  SUBSCRIPTION_DELETE_REQUEST,
  SUBSCRIPTION_DELETE_SUCCESS,
  SUBSCRIPTION_DELETE_FAIL,
  SUBSCRIPTION_UPDATE_REQUEST,
  SUBSCRIPTION_UPDATE_SUCCESS,
  SUBSCRIPTION_UPDATE_FAIL,
  SUBSCRIPTION_DELETE_RESET,
} from "../constants/subscriptionConstants";

// CREATE
export const subscriptionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_CREATE_REQUEST:
      return { loading: true };

    case SUBSCRIPTION_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        subscription: action.payload,
      };

    case SUBSCRIPTION_CREATE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

// LIST
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


export const subscriptionUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBSCRIPTION_UPDATE_REQUEST:
      return { loading: true };

    case SUBSCRIPTION_UPDATE_SUCCESS:
      return { loading: false, success: true };

    case SUBSCRIPTION_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
