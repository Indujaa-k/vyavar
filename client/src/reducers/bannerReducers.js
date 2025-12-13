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
  VIDEO_BANNER_UPLOAD_REQUEST,
  VIDEO_BANNER_UPLOAD_SUCCESS,
  VIDEO_BANNER_UPLOAD_FAIL,
  VIDEO_BANNER_LIST_REQUEST,
  VIDEO_BANNER_LIST_SUCCESS,
  VIDEO_BANNER_LIST_FAIL,
  VIDEO_BANNER_DELETE_REQUEST,
  VIDEO_BANNER_DELETE_SUCCESS,
  VIDEO_BANNER_DELETE_FAIL,
  USER_VIDEO_BANNER_LIST_REQUEST,
  USER_VIDEO_BANNER_LIST_SUCCESS,
  USER_VIDEO_BANNER_LIST_FAIL,
} from "../constants/bannerConstants";

export const bannerListReducer = (state = { banners: [] }, action) => {
  switch (action.type) {
    case BANNER_LIST_REQUEST:
      return { loading: true, banners: [] };
    case BANNER_LIST_SUCCESS:
      return { loading: false, banners: action.payload };
    case BANNER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const bannerAddReducer = (state = {}, action) => {
  switch (action.type) {
    case BANNER_ADD_REQUEST:
      return { loading: true };
    case BANNER_ADD_SUCCESS:
      return { loading: false, success: true, banner: action.payload };
    case BANNER_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const bannerDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case BANNER_DELETE_REQUEST:
      return { loading: true };
    case BANNER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case BANNER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// videobanner
export const videoBannerListReducer = (state = { videos: [] }, action) => {
  switch (action.type) {
    case VIDEO_BANNER_LIST_REQUEST:
      return { loading: true, videos: [] };
    case VIDEO_BANNER_LIST_SUCCESS:
      return { loading: false, videos: action.payload };
    case VIDEO_BANNER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const videoBannerUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case VIDEO_BANNER_UPLOAD_REQUEST:
      return { loading: true };
    case VIDEO_BANNER_UPLOAD_SUCCESS:
      return { loading: false, success: true, video: action.payload };
    case VIDEO_BANNER_UPLOAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const videoBannerDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case VIDEO_BANNER_DELETE_REQUEST:
      return { loading: true };
    case VIDEO_BANNER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case VIDEO_BANNER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const userVideoBannerListReducer = (state = { videos: [] }, action) => {
  switch (action.type) {
    case "USER_VIDEO_BANNER_LIST_REQUEST":
      return { loading: true, videos: [] };
    case "USER_VIDEO_BANNER_LIST_SUCCESS":
      return { loading: false, videos: action.payload };
    case "USER_VIDEO_BANNER_LIST_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
