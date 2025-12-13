import {
  SHIPPING_RATES_REQUEST,
  SHIPPING_RATES_SUCCESS,
  SHIPPING_RATES_FAIL,
  SELECT_SHIPPING_RATE,
  CREATE_SHIPMENT_REQUEST,
  CREATE_SHIPMENT_SUCCESS,
  CREATE_SHIPMENT_FAIL,
} from "../constants/deliveryConstants";

const initialState = {
  rates: [],
  loading: false,
  error: null,
};

export const shippingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHIPPING_RATES_REQUEST":
      return { ...state, loading: true };
    case "SHIPPING_RATES_SUCCESS":
      return { loading: false, rates: action.payload };
    case "SHIPPING_RATES_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const shipmentReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SHIPMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_SHIPMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        shipmentData: action.payload,
        error: null,
      };
    case CREATE_SHIPMENT_FAIL:
      return {
        ...state,
        loading: false,
        shipmentData: null,
        error: action.payload,
      };
    default:
      return state;
  }
};
