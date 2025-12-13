import {
  DASHBOARD_SALES_REQUEST,
  DASHBOARD_SALES_SUCCESS,
  DASHBOARD_SALES_FAIL,
  DASHBOARD_REVENUE_REQUEST,
  DASHBOARD_REVENUE_SUCCESS,
  DASHBOARD_REVENUE_FAIL,
  DASHBOARD_ORDERS_REQUEST,
  DASHBOARD_ORDERS_SUCCESS,
  DASHBOARD_ORDERS_FAIL,
  DASHBOARD_TOTALORDERS_REQUEST,
  DASHBOARD_TOTALORDERS_SUCCESS,
  DASHBOARD_TOTALORDERS_FAIL,
} from "../constants/dashboardConstants";

export const salesReducer = (state = { sales: [] }, action) => {
  switch (action.type) {
    case DASHBOARD_SALES_REQUEST:
      return { loading: true, sales: [] };
    case DASHBOARD_SALES_SUCCESS:
      return { loading: false, sales: action.payload };
    case DASHBOARD_SALES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const revenueReducer = (state = { revenue: [] }, action) => {
  switch (action.type) {
    case DASHBOARD_REVENUE_REQUEST:
      return { loading: true, revenue: [] };
    case DASHBOARD_REVENUE_SUCCESS:
      return { loading: false, revenue: action.payload };
    case DASHBOARD_REVENUE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const totalOrdersReducer = (state = { totalOrders: 0 }, action) => {
  switch (action.type) {
    case DASHBOARD_TOTALORDERS_REQUEST:
      return { loading: true, totalOrders: 0 };
    case DASHBOARD_TOTALORDERS_SUCCESS:
      return { loading: false, totalOrders: action.payload };
    case DASHBOARD_TOTALORDERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ordersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case DASHBOARD_ORDERS_REQUEST:
      return { loading: true, revenue: [] };
    case DASHBOARD_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload };
    case DASHBOARD_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
