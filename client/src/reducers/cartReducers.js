import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADRESSE,
  CART_SAVE_PAYMENT,
  SAVE_SHIPPING_COST,
  SAVE_SHIPPING_RATES,
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAIL,
  CART_CLEAR_ITEMS,
} from "../constants/cartConstants";
export const cartReducer = (
  state = {
    cartItems: [],
    shippingAddress: {},
    shippingCost: 0,
    images: [],
    loading: false,
    error: null,
  },
  action
) => {
  switch (action.type) {
    case CART_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CART_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: action.payload,
      };

    case CART_FETCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        cartItems: [],
      };

    case CART_ADD_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };

    // ❌ REMOVE ITEM
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };

    case CART_SAVE_SHIPPING_ADRESSE:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case CART_SAVE_PAYMENT:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case SAVE_SHIPPING_COST:
      return {
        ...state,
        shippingCost: action.payload,
      };
    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      };

    case SAVE_SHIPPING_RATES:
      return {
        ...state,
        shippingRates: action.payload,
      };
      

    default:
      return state;
  }
};
