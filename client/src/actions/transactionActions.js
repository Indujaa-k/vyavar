import axios from "axios";
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

// Delivery - Deposit
export const depositRequest =
  (amount, orderId) => async (dispatch, getState) => {
    try {
      dispatch({ type: DELIVERY_DEPOSIT_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(`${API_URL}/api/delivery/deposit`, { amount, orderId }, config);

      dispatch({ type: DELIVERY_DEPOSIT_SUCCESS });
    } catch (error) {
      dispatch({
        type: DELIVERY_DEPOSIT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Delivery - Withdraw
export const withdrawRequest =
  (amount, orderId) => async (dispatch, getState) => {
    try {
      dispatch({ type: DELIVERY_WITHDRAW_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        `${API_URL}/api/delivery/request-withdraw`,
        { amount, orderId },
        config
      );

      dispatch({ type: DELIVERY_WITHDRAW_SUCCESS });
    } catch (error) {
      dispatch({
        type: DELIVERY_WITHDRAW_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Delivery - Get My Transactions
export const getMyTransactions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DELIVERY_GET_MY_TRANSACTIONS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/delivery/my-transactions`, config);

    dispatch({ type: DELIVERY_GET_MY_TRANSACTIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELIVERY_GET_MY_TRANSACTIONS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Admin - Pending Deposits
export const fetchPendingDeposits = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ADMIN_GET_PENDING_DEPOSITS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get(`${API_URL}/api/admin/pending-deposits`, config);

    dispatch({ type: ADMIN_GET_PENDING_DEPOSITS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADMIN_GET_PENDING_DEPOSITS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Admin - Confirm Deposit
export const confirmDeposit =
  (orderId, transactionId) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.put(
        `${API_URL}/api/admin/confirm-deposit/${orderId}/${transactionId}`,
        {},
        config
      );

      dispatch({
        type: ADMIN_CONFIRM_DEPOSIT_SUCCESS,
        payload: { orderId, transactionId },
      });
    } catch (error) {
      // Handle error if needed
      console.error(error);
    }
  };

// Admin - Pending Withdrawals
export const fetchPendingWithdrawals = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ADMIN_GET_PENDING_WITHDRAWALS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get(`${API_URL}/api/admin/pending-withdrawals`, config);

    dispatch({ type: ADMIN_GET_PENDING_WITHDRAWALS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADMIN_GET_PENDING_WITHDRAWALS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Admin - Approve Withdrawal
export const approveWithdrawal =
  (orderId, transactionId) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.put(
        `${API_URL}/api/admin/approve-withdraw/${orderId}/${transactionId}`,
        {},
        config
      );

      dispatch({
        type: ADMIN_APPROVE_WITHDRAW_SUCCESS,
        payload: { orderId, transactionId },
      });
    } catch (error) {
      // Handle error if needed
      console.error(error);
    }
  };

// Admin - Reject Withdrawal
export const rejectWithdrawal =
  (orderId, transactionId, reason) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.put(
        `${API_URL}/api/admin/reject-withdraw/${orderId}/${transactionId}`,
        { reason },
        config
      );

      dispatch({
        type: ADMIN_REJECT_WITHDRAW_SUCCESS,
        payload: { orderId, transactionId },
      });
    } catch (error) {
      // Handle error if needed
      console.error(error);
    }
  };
