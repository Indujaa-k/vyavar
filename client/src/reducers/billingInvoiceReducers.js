import {
  BILLING_INVOICE_CREATE_REQUEST,
  BILLING_INVOICE_CREATE_SUCCESS,
  BILLING_INVOICE_CREATE_FAIL,
  BILLING_INVOICE_FETCH_REQUEST,
  BILLING_INVOICE_FETCH_SUCCESS,
  BILLING_INVOICE_FETCH_FAIL,
} from "../constants/billingInvoiceConstants";

export const billingInvoiceCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case BILLING_INVOICE_CREATE_REQUEST:
      return { loading: true };
    case BILLING_INVOICE_CREATE_SUCCESS:
      return { loading: false, success: true, billingInvoice: action.payload };
    case BILLING_INVOICE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const billingInvoiceDetailsReducer = (
  state = { invoice: {} },
  action
) => {
  switch (action.type) {
    case "BILLING_INVOICE_FETCH_REQUEST":
      return { loading: true, ...state };
    case "BILLING_INVOICE_FETCH_SUCCESS":
      return { loading: false, invoice: action.payload };
    case "BILLING_INVOICE_FETCH_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
