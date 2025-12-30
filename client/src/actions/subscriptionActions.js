import axios from "axios";
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
} from "../constants/subscriptionConstants";

const API_URL = process.env.REACT_APP_API_URL;

// CREATE SUBSCRIPTION (ADMIN)
export const createSubscription =
  (subscriptionData) => async (dispatch, getState) => {
    try {
      dispatch({ type: SUBSCRIPTION_CREATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/subscriptions`,
        subscriptionData,
        config
      );

      dispatch({
        type: SUBSCRIPTION_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SUBSCRIPTION_CREATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// LIST SUBSCRIPTIONS (ADMIN)
export const listSubscriptions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/subscriptions`, config);

    dispatch({
      type: SUBSCRIPTION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// DELETE SUBSCRIPTION (ADMIN)
// DELETE SUBSCRIPTION
export const deleteSubscription = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`${API_URL}/api/subscriptions/${id}`, config);

    dispatch({ type: SUBSCRIPTION_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// UPDATE SUBSCRIPTION
export const updateSubscription =
  (id, subscriptionData) => async (dispatch, getState) => {
    try {
      dispatch({ type: SUBSCRIPTION_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/subscriptions/${id}`,
        subscriptionData,
        config
      );

      dispatch({
        type: SUBSCRIPTION_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SUBSCRIPTION_UPDATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
