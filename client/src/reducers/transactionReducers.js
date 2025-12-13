// transactionReducers.js
import {
  DELIVERY_DEPOSIT_REQUEST,
  DELIVERY_DEPOSIT_SUCCESS,
  DELIVERY_DEPOSIT_FAIL,
  DELIVERY_WITHDRAW_REQUEST,
  DELIVERY_WITHDRAW_SUCCESS,
  DELIVERY_WITHDRAW_FAIL,
  ADMIN_GET_PENDING_DEPOSITS_REQUEST,
  ADMIN_GET_PENDING_DEPOSITS_SUCCESS,
  ADMIN_GET_PENDING_DEPOSITS_FAIL,
  ADMIN_CONFIRM_DEPOSIT_SUCCESS,
  ADMIN_GET_PENDING_WITHDRAWALS_REQUEST,
  ADMIN_GET_PENDING_WITHDRAWALS_SUCCESS,
  ADMIN_GET_PENDING_WITHDRAWALS_FAIL,
  ADMIN_APPROVE_WITHDRAW_SUCCESS,
  ADMIN_REJECT_WITHDRAW_SUCCESS,
  DELIVERY_GET_MY_TRANSACTIONS_REQUEST,
  DELIVERY_GET_MY_TRANSACTIONS_SUCCESS,
  DELIVERY_GET_MY_TRANSACTIONS_FAIL,
} from "../constants/transactionConstants";

export const deliveryDepositReducer = (state = {}, action) => {
  switch (action.type) {
    case DELIVERY_DEPOSIT_REQUEST:
      return { loading: true };
    case DELIVERY_DEPOSIT_SUCCESS:
      return { loading: false, success: true };
    case DELIVERY_DEPOSIT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const deliveryWithdrawReducer = (state = {}, action) => {
  switch (action.type) {
    case DELIVERY_WITHDRAW_REQUEST:
      return { loading: true };
    case DELIVERY_WITHDRAW_SUCCESS:
      return { loading: false, success: true };
    case DELIVERY_WITHDRAW_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const adminPendingDepositsReducer = (
  state = { deposits: [] },
  action
) => {
  switch (action.type) {
    case ADMIN_GET_PENDING_DEPOSITS_REQUEST:
      return { loading: true, deposits: [] };
    case ADMIN_GET_PENDING_DEPOSITS_SUCCESS:
      return { loading: false, deposits: action.payload };
    case ADMIN_GET_PENDING_DEPOSITS_FAIL:
      return { loading: false, error: action.payload };
    case ADMIN_CONFIRM_DEPOSIT_SUCCESS:
      return {
        ...state,
        deposits: state.deposits.filter(
          (tx) => tx._id !== action.payload.transactionId
        ),
      };
    default:
      return state;
  }
};

export const adminPendingWithdrawalsReducer = (
  state = { withdrawals: [] },
  action
) => {
  switch (action.type) {
    case ADMIN_GET_PENDING_WITHDRAWALS_REQUEST:
      return { loading: true, withdrawals: [] };
    case ADMIN_GET_PENDING_WITHDRAWALS_SUCCESS:
      return { loading: false, withdrawals: action.payload };
    case ADMIN_GET_PENDING_WITHDRAWALS_FAIL:
      return { loading: false, error: action.payload };
    case ADMIN_APPROVE_WITHDRAW_SUCCESS:
    case ADMIN_REJECT_WITHDRAW_SUCCESS:
      return {
        ...state,
        withdrawals: state.withdrawals.filter(
          (tx) => tx._id !== action.payload.transactionId
        ),
      };
    default:
      return state;
  }
};

export const deliveryMyTransactionsReducer = (
  state = { transactions: [] },
  action
) => {
  switch (action.type) {
    case DELIVERY_GET_MY_TRANSACTIONS_REQUEST:
      return { loading: true, transactions: [] };
    case DELIVERY_GET_MY_TRANSACTIONS_SUCCESS:
      return { loading: false, transactions: action.payload };
    case DELIVERY_GET_MY_TRANSACTIONS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
