import {
  SHIPPING_GET_REQUEST,
  SHIPPING_GET_SUCCESS,
  SHIPPING_GET_FAIL,
  SHIPPING_ADD_STATE_REQUEST,
  SHIPPING_ADD_STATE_SUCCESS,
  SHIPPING_ADD_STATE_FAIL,
  SHIPPING_UPDATE_STATE_REQUEST,
  SHIPPING_UPDATE_STATE_SUCCESS,
  SHIPPING_UPDATE_STATE_FAIL,
  SHIPPING_UPDATE_FREE_REQUEST,
  SHIPPING_UPDATE_FREE_SUCCESS,
  SHIPPING_UPDATE_FREE_FAIL,
  SHIPPING_DELETE_STATE_REQUEST,
  SHIPPING_DELETE_STATE_SUCCESS,
  SHIPPING_DELETE_STATE_FAIL,
} from "../constants/shippingConstants";

const initialState = {
  loading: false,
  shippingCost: 0,
  freeShippingAbove: 0,
  shippingRules: [],
  error: null,
};

export const shippingReducers = (state = initialState, action) => {
  switch (action.type) {
    case SHIPPING_GET_REQUEST:
    case SHIPPING_ADD_STATE_REQUEST:
    case SHIPPING_UPDATE_STATE_REQUEST:
    case SHIPPING_UPDATE_FREE_REQUEST:
    case SHIPPING_DELETE_STATE_REQUEST:
      return { ...state, loading: true };

    case SHIPPING_GET_SUCCESS:
      return {
        loading: false,
        shippingCost: action.payload.shippingCost || 0,
        freeShippingAbove: action.payload.freeShippingAbove || 0,
        shippingRules: action.payload.shippingRules || [],
        error: null,
      };

    case SHIPPING_ADD_STATE_SUCCESS:
    case SHIPPING_UPDATE_STATE_SUCCESS:
    case SHIPPING_DELETE_STATE_SUCCESS:
      return {
        ...state,
        loading: false,
        shippingRules: action.payload.shippingRules,
      };

    case SHIPPING_UPDATE_FREE_SUCCESS:
      return {
        ...state,
        loading: false,
        freeShippingAbove: action.payload.freeShippingAbove,
      };

    case SHIPPING_GET_FAIL:
    case SHIPPING_ADD_STATE_FAIL:
    case SHIPPING_UPDATE_STATE_FAIL:
    case SHIPPING_UPDATE_FREE_FAIL:
    case SHIPPING_DELETE_STATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
