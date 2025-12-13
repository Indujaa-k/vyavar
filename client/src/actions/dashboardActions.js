import axios from "axios";
import {
  DASHBOARD_SALES_REQUEST,
  DASHBOARD_SALES_SUCCESS,
  DASHBOARD_SALES_FAIL,
  DASHBOARD_REVENUE_REQUEST,
  DASHBOARD_REVENUE_SUCCESS,
  DASHBOARD_REVENUE_FAIL,
  DASHBOARD_TOTALORDERS_REQUEST,
  DASHBOARD_TOTALORDERS_SUCCESS,
  DASHBOARD_TOTALORDERS_FAIL,
  DASHBOARD_ORDERS_REQUEST,
  DASHBOARD_ORDERS_SUCCESS,
  DASHBOARD_ORDERS_FAIL,
} from "../constants/dashboardConstants";

const API_URL = process.env.REACT_APP_API_URL;
// Fetch sales data
export const getSalesData = (filter) => async (dispatch, getState) => {
  try {
    dispatch({ type: DASHBOARD_SALES_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(
      `${API_URL}/api/dashboard/sales?filter=${filter}`,
      config
    );

    dispatch({ type: DASHBOARD_SALES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DASHBOARD_SALES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getRevenueData = (filter) => async (dispatch, getState) => {
  try {
    dispatch({ type: DASHBOARD_REVENUE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(
      `${API_URL}/api/dashboard/revenue?filter=${filter}`,
      config
    );

    dispatch({ type: DASHBOARD_REVENUE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DASHBOARD_REVENUE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getTotalOrders = (filter) => async (dispatch, getState) => {
  try {
    dispatch({ type: DASHBOARD_TOTALORDERS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(
      `${API_URL}/api/dashboard/getTotalOrders?filter=${filter}`,
      config
    );

    dispatch({ type: DASHBOARD_TOTALORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DASHBOARD_TOTALORDERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getDashboardOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DASHBOARD_ORDERS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(`${API_URL}/api/dashboard/orders`, config);

    dispatch({ type: DASHBOARD_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DASHBOARD_ORDERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
