import axios from "axios";
import {
  OFFER_CREATE_REQUEST,
  OFFER_CREATE_SUCCESS,
  OFFER_CREATE_FAIL,
  OFFER_LIST_REQUEST,
  OFFER_LIST_SUCCESS,
  OFFER_LIST_FAIL,
  OFFER_UPDATE_REQUEST,
  OFFER_UPDATE_SUCCESS,
  OFFER_UPDATE_FAIL,
  OFFER_DELETE_REQUEST,
  OFFER_DELETE_SUCCESS,
  OFFER_DELETE_FAIL,
  OFFER_VALIDATE_REQUEST,
  OFFER_VALIDATE_SUCCESS,
  OFFER_VALIDATE_FAIL,
} from "../constants/offerConstants";
const API_URL = process.env.REACT_APP_API_URL;

export const createOffer = (offerData) => async (dispatch, getState) => {
  try {
    dispatch({ type: OFFER_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/api/offers`, offerData, config);

    dispatch({
      type: OFFER_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: OFFER_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listOffers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: OFFER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/offers`, config);

    dispatch({
      type: OFFER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: OFFER_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateOffer =
  (offerId, offerData) => async (dispatch, getState) => {
    try {
      dispatch({ type: OFFER_UPDATE_REQUEST });

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
        `${API_URL}/api/offers/${offerId}`,
        offerData,
        config
      );

      dispatch({
        type: OFFER_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: OFFER_UPDATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const deleteOffer = (offerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: OFFER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`${API_URL}/api/offers/${offerId}`, config);

    dispatch({
      type: OFFER_DELETE_SUCCESS,
    });
    dispatch(listOffers());
  } catch (error) {
    dispatch({
      type: OFFER_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getOfferByCouponCode =
  (couponCode) => async (dispatch, getState) => {
    try {
      dispatch({ type: OFFER_VALIDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/offers/${couponCode}`,
        config
      );

      dispatch({
        type: OFFER_VALIDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: OFFER_VALIDATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
