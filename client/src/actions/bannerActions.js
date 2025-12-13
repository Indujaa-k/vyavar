import axios from "axios";
import {
  BANNER_LIST_REQUEST,
  BANNER_LIST_SUCCESS,
  BANNER_LIST_FAIL,
  BANNER_ADD_REQUEST,
  BANNER_ADD_SUCCESS,
  BANNER_ADD_FAIL,
  BANNER_DELETE_REQUEST,
  BANNER_DELETE_SUCCESS,
  BANNER_DELETE_FAIL,
  VIDEO_BANNER_LIST_REQUEST,
  VIDEO_BANNER_LIST_SUCCESS,
  VIDEO_BANNER_LIST_FAIL,
  VIDEO_BANNER_UPLOAD_REQUEST,
  VIDEO_BANNER_UPLOAD_SUCCESS,
  VIDEO_BANNER_UPLOAD_FAIL,
  VIDEO_BANNER_DELETE_REQUEST,
  VIDEO_BANNER_DELETE_SUCCESS,
  VIDEO_BANNER_DELETE_FAIL,
  USER_VIDEO_BANNER_LIST_REQUEST,
  USER_VIDEO_BANNER_LIST_SUCCESS,
  USER_VIDEO_BANNER_LIST_FAIL,
} from "../constants/bannerConstants";

const API_URL = process.env.REACT_APP_API_URL;
//   const { data } = await axios.get(`${API_URL}/api/banners/banners`);

// Fetch banners
export const listBanners = () => async (dispatch) => {
  try {
    dispatch({ type: BANNER_LIST_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/banners/banners`);
    dispatch({ type: BANNER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BANNER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Add banner
export const addBanner = (bannerData) => async (dispatch, getState) => {
  try {
    dispatch({ type: BANNER_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/banners/banner`,
      bannerData,
      config
    );
    console.log("bannerData", bannerData);
    dispatch({ type: BANNER_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BANNER_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete banner
export const deleteBanner = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BANNER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`${API_URL}/api/banners/banners/${id}`, config);

    dispatch({ type: BANNER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: BANNER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// add video banner
export const uploadVideoBanner = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: VIDEO_BANNER_UPLOAD_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/banners/addvideobanner`,
      formData,
      config
    );
    console.log("Sending Form Data:", formData);

    dispatch({ type: VIDEO_BANNER_UPLOAD_SUCCESS, payload: data });
  } catch (error) {
    console.error("Upload Error:", error);
    dispatch({
      type: VIDEO_BANNER_UPLOAD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
//list video banner
export const listVideoBanners =
  (productId = "") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: VIDEO_BANNER_LIST_REQUEST });
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
        `${API_URL}/api/banners/getvideobanner?productId=${productId}`,
        config
      );
      dispatch({ type: VIDEO_BANNER_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: VIDEO_BANNER_LIST_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// delete videobanner
export const deleteVideoBanner =
  (productId, videoId) => async (dispatch, getState) => {
    try {
      dispatch({ type: VIDEO_BANNER_DELETE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.delete(
        `${API_URL}/api/banners/deletevideobanner/${productId}/${videoId}`,
        config
      );
      dispatch({ type: VIDEO_BANNER_DELETE_SUCCESS, payload: videoId });
    } catch (error) {
      dispatch({
        type: VIDEO_BANNER_DELETE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const listUserVideoBanners = () => async (dispatch) => {
  try {
    dispatch({ type: USER_VIDEO_BANNER_LIST_REQUEST });
    // const {
    //   userLogin: { userInfo },
    // } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/banners/getuservideobanners`,
      config
    );

    dispatch({ type: USER_VIDEO_BANNER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_VIDEO_BANNER_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
