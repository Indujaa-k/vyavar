import axios from "axios";
import {
  SHIPPING_RATES_REQUEST,
  SHIPPING_RATES_SUCCESS,
  SHIPPING_RATES_FAIL,
  SELECT_SHIPPING_RATE,
  CREATE_SHIPMENT_REQUEST,
  CREATE_SHIPMENT_SUCCESS,
  CREATE_SHIPMENT_FAIL,
} from "../constants/deliveryConstants";

const API_URL = process.env.REACT_APP_API_URL;
export const fetchShippingRates =
  (userAddress, productId) => async (dispatch, getState) => {
    try {
      dispatch({ type: SHIPPING_RATES_REQUEST });

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
        `${API_URL}/api/delivery/shipmentrates`,
        { userAddress, productId },
        config
      );
      dispatch({
        type: SHIPPING_RATES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SHIPPING_RATES_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
// Select a shipping rate action
export const selectShippingRate = (rate) => (dispatch) => {
  dispatch({
    type: SELECT_SHIPPING_RATE,
    payload: rate,
  });
};

export const createShipment =
  (shipmentDetails) => async (dispatch, getState) => {
    console.log("🚀 Creating shipment with details:", shipmentDetails);

    try {
      dispatch({ type: CREATE_SHIPMENT_REQUEST });

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
        `${API_URL}/api/delivery/createShipment`,
        shipmentDetails, // Sending only shipment data
        config
      );

      dispatch({
        type: CREATE_SHIPMENT_SUCCESS,
        payload: data,
      });
      console.log("✅ Shipment Created Successfully:", data);
      return data;
    } catch (error) {
      dispatch({
        type: CREATE_SHIPMENT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      console.error("❌ Shipment Creation Error:", error);
    }
  };
