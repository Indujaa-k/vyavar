import axios from "axios";
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
} from "../constants/shippingConstants.js";

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Get shipping settings (ADMIN)
 */
export const getShippingSettings = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SHIPPING_GET_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/shipping/getshippingcost`,
      config
    );

    dispatch({
      type: SHIPPING_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SHIPPING_GET_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getShippingCost = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SHIPPING_GET_REQUEST });

    const {
      userLogin: { userInfo },
      userDetails: { user },
    } = getState();

    const defaultAddress =
      user?.addresses?.find((addr) => addr.isDefault) || user?.addresses?.[0];

    if (!defaultAddress?.state) {
      throw new Error("No default address found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // ✅ USE NEW ROUTE
    const { data } = await axios.get(
      `${API_URL}/api/shipping/cost?state=${defaultAddress.state}`,
      config
    );

    dispatch({
      type: SHIPPING_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SHIPPING_GET_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/**
 * Add new state (ADMIN)
 */
export const addStateShipping = (state, cost) => async (dispatch, getState) => {
  try {
    dispatch({ type: SHIPPING_ADD_STATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/shipping/addstate`,
      { state, cost },
      config
    );

    dispatch({
      type: SHIPPING_ADD_STATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SHIPPING_ADD_STATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/**
 * Update state cost (ADMIN)
 */
export const updateStateShipping = (id, cost) => async (dispatch, getState) => {
  try {
    dispatch({ type: SHIPPING_UPDATE_STATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/shipping/updatestate/${id}`,
      { cost },
      config
    );

    dispatch({
      type: SHIPPING_UPDATE_STATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SHIPPING_UPDATE_STATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/**
 * Update free shipping amount (ADMIN)
 */
export const updateFreeShipping =
  (freeShippingAbove) => async (dispatch, getState) => {
    try {
      dispatch({ type: SHIPPING_UPDATE_FREE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/shipping/updatefreeshipping`,
        { freeShippingAbove },
        config
      );

      dispatch({
        type: SHIPPING_UPDATE_FREE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SHIPPING_UPDATE_FREE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const deleteStateShipping = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SHIPPING_DELETE_STATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/shipping/deletestate/${id}`,
      config
    );

    dispatch({
      type: SHIPPING_DELETE_STATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SHIPPING_DELETE_STATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
