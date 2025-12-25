import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_RESET,
  PRODUCT_BULK_UPLOAD_REQUEST,
  PRODUCT_BULK_UPLOAD_SUCCESS,
  PRODUCT_BULK_UPLOAD_FAIL,
  PRODUCT_BULK_UPLOAD_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  REVIEW_LIST_REQUEST,
  REVIEW_LIST_SUCCESS,
  REVIEW_LIST_FAIL,
  REVIEW_APPROVE_REQUEST,
  REVIEW_APPROVE_SUCCESS,
  REVIEW_APPROVE_FAIL,
  REVIEW_DELETE_REQUEST,
  REVIEW_DELETE_SUCCESS,
  REVIEW_DELETE_FAIL,
  PRODUCT_VARIANTS_REQUEST,
  PRODUCT_VARIANTS_SUCCESS,
  PRODUCT_VARIANTS_FAIL,
  PRODUCT_GROUP_DETAILS_REQUEST,
  PRODUCT_GROUP_DETAILS_SUCCESS,
  PRODUCT_GROUP_DETAILS_FAIL,
  PRODUCT_GROUP_UPDATE_REQUEST,
  PRODUCT_GROUP_UPDATE_SUCCESS,
  PRODUCT_GROUP_UPDATE_FAIL,
  PRODUCT_VARIANT_UPDATE_REQUEST,
  PRODUCT_VARIANT_UPDATE_SUCCESS,
  PRODUCT_VARIANT_UPDATE_FAIL,
  PRODUCT_VARIANT_ADD_REQUEST,
  PRODUCT_VARIANT_ADD_SUCCESS,
  PRODUCT_VARIANT_ADD_FAIL,
  PRODUCT_EDIT_REQUEST,
  PRODUCT_EDIT_SUCCESS,
  PRODUCT_EDIT_FAIL,
  PRODUCT_LIST_BY_GROUP_REQUEST,
  PRODUCT_LIST_BY_GROUP_SUCCESS,
  PRODUCT_LIST_BY_GROUP_FAIL,
  VARIANT_ADD_REQUEST,
  VARIANT_ADD_SUCCESS,
  VARIANT_ADD_FAIL,
} from "../constants/productConstants";

const API_URL = process.env.REACT_APP_API_URL;

export const listProducts =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });
      const { data } = await axios.get(
        `${API_URL}/api/products?keyword=${keyword}`
      );

      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const Listproductbyfiters = (filters) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    let queryString = "?";
    for (let key in filters) {
      if (filters[key]) {
        queryString += `&${key}=${filters[key]}`;
      }
    }
    const { data } = await axios.get(`${API_URL}/api/products/${queryString}`);
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    console.log(data);
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listProductVariants = (sku) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_VARIANTS_REQUEST });

    const skuPrefix = sku.split("-")[0];
    const { data } = await axios.get(`${API_URL}/api/products/variants/${sku}`);

    dispatch({
      type: PRODUCT_VARIANTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_VARIANTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/products/${id}`);

    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const DeleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`${API_URL}/api/products/${id}`, config);
    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const CreateProduct = (productData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.post(
      `/api/products/create`,
      productData,
      config
    );

    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};
export const getProductBySkuDetails = (sku) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/products/sku/${sku}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const uploadBulkProducts = (file) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_BULK_UPLOAD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(
      `${API_URL}/api/products/upload`,
      formData,
      config
    );

    dispatch({
      type: PRODUCT_BULK_UPLOAD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_BULK_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const UpdateProduct =
  (productId, formData) => async (dispatch, getState) => {
    console.log(productId);

    try {
      dispatch({
        type: PRODUCT_UPDATE_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/products/${productId}`,
        formData,
        config
      );
      dispatch({
        type: PRODUCT_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const createproductReview =
  (productId, review) => async (dispatch, getState) => {
    try {
      dispatch({
        type: PRODUCT_CREATE_REVIEW_REQUEST,
      });

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
        `${API_URL}/api/products/${productId}/reviews`,
        { ...review, approved: false },
        config
      );
      dispatch({
        type: PRODUCT_CREATE_REVIEW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_CREATE_REVIEW_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
// Fetch pending reviews
// Fetch pending reviews
export const listPendingReviews = () => async (dispatch, getState) => {
  try {
    dispatch({ type: REVIEW_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/products/reviews/pending`,
      config
    );
    console.log("Pending reviews from backend:", data);

    dispatch({
      type: REVIEW_LIST_SUCCESS,
      payload: data, // ✅ ONLY ARRAY
    });
  } catch (error) {
    dispatch({
      type: REVIEW_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Approve a review
export const approveReview =
  (productId, reviewId) => async (dispatch, getState) => {
    try {
      dispatch({ type: REVIEW_APPROVE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/products/${productId}/reviews/${reviewId}/approve`,
        {},
        config
      );

      dispatch({
        type: REVIEW_APPROVE_SUCCESS,
        payload: data, // future use
      });
    } catch (error) {
      dispatch({
        type: REVIEW_APPROVE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const deleteReview = (reviewId) => async (dispatch, getState) => {
  try {
    console.log("Deleting reviewId from frontend:", reviewId);
    dispatch({ type: REVIEW_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Call the correct backend endpoint
    const { data } = await axios.delete(
      `${API_URL}/api/products/reviews/${reviewId}`,
      config
    );

    dispatch({ type: REVIEW_DELETE_SUCCESS, payload: data });
  } catch (error) {
    console.error(
      "❌ deleteReview frontend error:",
      error.response?.data || error.message
    );
    dispatch({
      type: REVIEW_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
export const getProductsByGroupId = (groupId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_GROUP_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get(`/api/products/group/${groupId}`, config);

    dispatch({ type: PRODUCT_GROUP_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_GROUP_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update common fields
export const updateGroupCommonFields =
  (groupId, updateData) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_GROUP_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      const { data } = await axios.put(
        `/api/products/group/${groupId}/common`,
        updateData,
        config
      );

      dispatch({ type: PRODUCT_GROUP_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_GROUP_UPDATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Update variant
export const updateProductVariant =
  (productId, formData) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_VARIANT_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      const { data } = await axios.put(
        `/api/products/${productId}`,
        formData,
        config
      );

      dispatch({ type: PRODUCT_VARIANT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_VARIANT_UPDATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Add new variant(s)
export const addVariantToGroup =
  (groupId, formData) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_VARIANT_ADD_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      const { data } = await axios.post(
        `/api/products/group/${groupId}/variant`,
        formData,
        config
      );

      dispatch({ type: PRODUCT_VARIANT_ADD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_VARIANT_ADD_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
export const getProductFull = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_EDIT_REQUEST });

    const { data } = await axios.get(`/api/products/${id}/full`);

    dispatch({
      type: PRODUCT_EDIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_EDIT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateProductGroup =
  (groupId, updatedData) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_GROUP_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/products/group/${groupId}`,
        updatedData,
        config
      );

      dispatch({ type: PRODUCT_GROUP_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_GROUP_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
export const listProductsByGroupId =
  (groupId) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_LIST_BY_GROUP_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/products/group/${groupId}`,
        config
      );

      dispatch({
        type: PRODUCT_LIST_BY_GROUP_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_BY_GROUP_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
