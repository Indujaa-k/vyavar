import axios from "axios";
import {
  SUBSCRIPTION_LIST_REQUEST,
  SUBSCRIPTION_LIST_SUCCESS,
  SUBSCRIPTION_LIST_FAIL,
  SUBSCRIPTION_CREATE_REQUEST,
  SUBSCRIPTION_CREATE_SUCCESS,
  SUBSCRIPTION_CREATE_FAIL,
  SUBSCRIPTION_UPDATE_REQUEST,
  SUBSCRIPTION_UPDATE_SUCCESS,
  SUBSCRIPTION_UPDATE_FAIL,
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
  SUBSCRIPTION_DELETE_FAIL,
} from "../constants/subscriptionConstants";

const API_URL = process.env.REACT_APP_API_URL;

export const listSubscriptions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.get(`${API_URL}/api/subscriptions`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: SUBSCRIPTION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// CREATE SUBSCRIPTION
export const createSubscription = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.post(`${API_URL}/api/subscriptions`, payload, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: SUBSCRIPTION_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// UPDATE SUBSCRIPTION
export const updateSubscription =
  (id, payload) => async (dispatch, getState) => {
    try {
      dispatch({ type: SUBSCRIPTION_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const { data } = await axios.put(
        `${API_URL}/api/subscriptions/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );

      dispatch({ type: SUBSCRIPTION_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: SUBSCRIPTION_UPDATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// TOGGLE ACTIVE / INACTIVE
export const toggleSubscription = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_TOGGLE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.put(
      `${API_URL}/api/subscriptions/${id}/toggle`,
      {},
      { headers: { Authorization: `Bearer ${userInfo.token}` } },
    );

    dispatch({ type: SUBSCRIPTION_TOGGLE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_TOGGLE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Create Razorpay order
export const createSubscriptionOrder = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_ORDER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.post(
      `${API_URL}/api/subscriptions/order/${id}`,
      {},
      { headers: { Authorization: `Bearer ${userInfo.token}` } },
    );

    dispatch({
      type: SUBSCRIPTION_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_ORDER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Confirm payment
export const confirmSubscriptionPayment =
  (paymentData) => async (dispatch, getState) => {
    try {
      dispatch({ type: SUBSCRIPTION_CONFIRM_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const { data } = await axios.post(
        `${API_URL}/api/subscriptions/confirm`,
        paymentData,
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );

      dispatch({
        type: SUBSCRIPTION_CONFIRM_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SUBSCRIPTION_CONFIRM_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const getActiveSubscription = () => async (dispatch) => {
  try {
    dispatch({ type: SUBSCRIPTION_LIST_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/subscriptions/active`);

    dispatch({
      type: SUBSCRIPTION_LIST_SUCCESS,
      payload: [data], // wrap as array
    });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteSubscription = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    await axios.delete(`${API_URL}/api/subscriptions/${id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: SUBSCRIPTION_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_DELETE_FAIL,
      payload: error.response?.data?.message || "Failed to delete subscription",
    });
  }
};
