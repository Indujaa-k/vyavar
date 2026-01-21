import axios from "axios";
import {
  CONTACT_SEND_REQUEST,
  CONTACT_SEND_SUCCESS,
  CONTACT_SEND_FAIL,
} from "../constants/contactConstants";

const API_URL = process.env.REACT_APP_API_URL;

export const sendContactMessage = (email, message) => async (dispatch) => {
  try {
    dispatch({ type: CONTACT_SEND_REQUEST });

    await axios.post(`${API_URL}/api/contact/send`, {
      email,
      message,
    });

    dispatch({ type: CONTACT_SEND_SUCCESS });
  } catch (error) {
    dispatch({
      type: CONTACT_SEND_FAIL,
      payload: error.response?.data?.message || "Message sending failed",
    });
  }
};

export const resetContact = () => (dispatch) => {
  dispatch({ type: "CONTACT_SEND_RESET" });
};
