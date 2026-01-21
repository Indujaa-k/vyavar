import {
  CONTACT_SEND_REQUEST,
  CONTACT_SEND_SUCCESS,
  CONTACT_SEND_FAIL,
} from "../constants/contactConstants";

export const contactSendReducer = (state = {}, action) => {
  switch (action.type) {
    case CONTACT_SEND_REQUEST:
      return { loading: true };

    case CONTACT_SEND_SUCCESS:
      return { loading: false, success: true };

    case CONTACT_SEND_FAIL:
      return { loading: false, error: action.payload };

    case "CONTACT_SEND_RESET":
      return {};

    default:
      return state;
  }
};
