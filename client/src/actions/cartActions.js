import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADRESSE,
  CART_SAVE_PAYMENT,
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAIL,
  SAVE_SHIPPING_COST,
  SAVE_SHIPPING_RATES,
} from "../constants/cartConstants";

const API_URL = process.env.REACT_APP_API_URL;

// export const addToCart = (id, qty) => async (dispatch, getState) => {
//   const {
//     userLogin: { userInfo },
//   } = getState();
//   const config = {
//     headers: { Authorization: `Bearer ${userInfo.token}` },
//   };

//   const { data } = await axios.post(
//     `${API_URL}/api/products/${id}/addtocart`,
//     { id, qty },
//     config
//   );
//   console.log("Cart Items data", data);
//   dispatch({
//     type: CART_ADD_ITEM,
//     payload: data.cartItems,
//   });
// };

export const addToCart = (id, qty, size) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    if (!size) {
      console.error("❌ Size is required!");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.post(
      `${API_URL}/api/products/${id}/addtocart`,
      { qty, size }, // ✅ only qty & size
      config
    );

    dispatch({
      type: CART_ADD_ITEM,
      payload: data.cartItems,
    });
  } catch (error) {
    console.error(
      "❌ Add to cart failed:",
      error.response?.data?.message || error.message
    );
  }
};

export const fetchCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_FETCH_REQUEST }); // ✅ ADD THIS

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(`${API_URL}/api/products/getcart`, config);

    dispatch({
      type: CART_FETCH_SUCCESS,
      payload: data.cartItems || [],
    });
  } catch (error) {
    dispatch({
      type: CART_FETCH_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const removeFromCart = (cartItemId) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/products/${cartItemId}/deletecart`,
      config
    );

    dispatch({
      type: CART_REMOVE_ITEM,
      payload: data.cartItems,
    });
  } catch (error) {
    console.error(
      "❌ Remove cart failed:",
      error.response?.data?.message || error.message
    );
  }
};

export const saveAddressshipping = (data) => (dispatch, getState) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADRESSE,
    payload: data,
  });
};
export const savepaymentmethod = (data) => (dispatch, getState) => {
  dispatch({
    type: CART_SAVE_PAYMENT,
    payload: data,
  });
};

export const saveShippingCost = (shippingCost) => ({
  type: SAVE_SHIPPING_COST,
  payload: shippingCost,
});

export const saveShippingRates = (shippingRates) => ({
  type: SAVE_SHIPPING_RATES,
  payload: shippingRates,
});
