import axios from "axios";
import {
  BILLING_INVOICE_CREATE_REQUEST,
  BILLING_INVOICE_CREATE_SUCCESS,
  BILLING_INVOICE_CREATE_FAIL,
  BILLING_INVOICE_FETCH_REQUEST,
  BILLING_INVOICE_FETCH_SUCCESS,
  BILLING_INVOICE_FETCH_FAIL,
} from "../constants/billingInvoiceConstants";

const API_URL = process.env.REACT_APP_API_URL;

export const createBillingInvoice =
  (invoiceData) => async (dispatch, getState) => {
    try {
      dispatch({ type: BILLING_INVOICE_CREATE_REQUEST });

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
        `${API_URL}/api/orders/billinginvoice`,
        invoiceData,
        config
      );

      dispatch({
        type: BILLING_INVOICE_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: BILLING_INVOICE_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
export const fetchBillingInvoice =
  (invoiceNumber) => async (dispatch, getState) => {
    try {
      dispatch({ type: BILLING_INVOICE_FETCH_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/orders/${invoiceNumber}`,
        config
      );

      dispatch({ type: BILLING_INVOICE_FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: BILLING_INVOICE_FETCH_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
