import {
  OFFER_CREATE_REQUEST,
  OFFER_CREATE_SUCCESS,
  OFFER_CREATE_FAIL,
  OFFER_CREATE_RESET,
  OFFER_DELETE_REQUEST,
  OFFER_DELETE_SUCCESS,
  OFFER_DELETE_FAIL,
  OFFER_DELETE_RESET,
  OFFER_UPDATE_REQUEST,
  OFFER_UPDATE_SUCCESS,
  OFFER_UPDATE_FAIL,
  OFFER_UPDATE_RESET,
  OFFER_LIST_REQUEST,
  OFFER_LIST_SUCCESS,
  OFFER_LIST_FAIL,
  OFFER_VALIDATE_REQUEST,
  OFFER_VALIDATE_SUCCESS,
  OFFER_VALIDATE_FAIL,
  OFFER_VALIDATE_RESET,
} from "../constants/offerConstants";

export const offerCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case OFFER_CREATE_REQUEST:
      return { loading: true };

    case OFFER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        offer: action.payload,
      };

    case OFFER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case OFFER_CREATE_RESET:
      return {};

    default:
      return state;
  }
};
export const offerDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case OFFER_DELETE_REQUEST:
      return { loading: true };

    case OFFER_DELETE_SUCCESS:
      return { loading: false, success: true };

    case OFFER_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case OFFER_DELETE_RESET:
      return {};

    default:
      return state;
  }
};
export const offerUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case OFFER_UPDATE_REQUEST:
      return { loading: true };

    case OFFER_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        offer: action.payload,
      };

    case OFFER_UPDATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case OFFER_UPDATE_RESET:
      return {};

    default:
      return state;
  }
};
export const offerListReducer = (state = { offers: [] }, action) => {
  switch (action.type) {
    case OFFER_LIST_REQUEST:
      return { loading: true, offers: [] };

    case OFFER_LIST_SUCCESS:
      return { loading: false, offers: action.payload };

    case OFFER_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const offerValidateReducer = (state = {}, action) => {
  switch (action.type) {
    case OFFER_VALIDATE_REQUEST:
      return { loading: true };

    case OFFER_VALIDATE_SUCCESS:
      return {
        loading: false,
        offer: action.payload,
      };

    case OFFER_VALIDATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case OFFER_VALIDATE_RESET:
      return {};

    default:
      return state;
  }
};
