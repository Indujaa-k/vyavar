import {
  CART_ADD_ITEM,
  CART_FETCH_ITEMS,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADRESSE,
  CART_SAVE_PAYMENT,
  SAVE_SHIPPING_COST,
  SAVE_SHIPPING_RATES,
} from "../constants/cartConstants";
export const cartReducer = (
  state = {
    cartItems: [],
    shippingAddress: {},
    shippingCost: 0,
    images: [],
  },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };
    case CART_FETCH_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
      };
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item._id !== action.payload
        ),
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
    case SAVE_SHIPPING_RATES:
      return {
        ...state,
        shippingRates: action.payload,
      };
    default:
      return state;
  }
};
