export const razorpayPaymentReducer = (state = {}, action) => {
  switch (action.type) {
    case RAZORPAY_PAYMENT_REQUEST:
      return { loading: true };

    case RAZORPAY_PAYMENT_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };

    case RAZORPAY_PAYMENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
