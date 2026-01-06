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
  OFFER_BANNER_LIST_REQUEST,
  OFFER_BANNER_LIST_SUCCESS,
  OFFER_BANNER_LIST_FAIL,
  OFFER_BANNER_ADD_REQUEST,
  OFFER_BANNER_ADD_SUCCESS,
  OFFER_BANNER_ADD_FAIL,
  OFFER_BANNER_UPDATE_REQUEST,
  OFFER_BANNER_UPDATE_SUCCESS,
  OFFER_BANNER_UPDATE_FAIL,
  OFFER_BANNER_DELETE_REQUEST,
  OFFER_BANNER_DELETE_SUCCESS,
  OFFER_BANNER_DELETE_FAIL,
  OFFER_BANNER_ACTIVE_REQUEST,
  OFFER_BANNER_ACTIVE_SUCCESS,
  OFFER_BANNER_ACTIVE_FAIL,
  CLEAR_ACTIVE_OFFER_BANNER,
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
export const offerBannerListReducer = (
  state = { offerBanners: [] },
  action
) => {
  switch (action.type) {
    case OFFER_BANNER_LIST_REQUEST:
      return { loading: true, offerBanners: [] };

    case OFFER_BANNER_LIST_SUCCESS:
      return { loading: false, offerBanners: action.payload };

    case OFFER_BANNER_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const offerBannerAddReducer = (state = {}, action) => {
  switch (action.type) {
    case OFFER_BANNER_ADD_REQUEST:
      return { loading: true };

    case OFFER_BANNER_ADD_SUCCESS:
      return { loading: false, success: true, banner: action.payload };

    case OFFER_BANNER_ADD_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const offerBannerUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case OFFER_BANNER_UPDATE_REQUEST:
      return { loading: true };

    case OFFER_BANNER_UPDATE_SUCCESS:
      return { loading: false, success: true };

    case OFFER_BANNER_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const offerBannerDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case OFFER_BANNER_DELETE_REQUEST:
      return { loading: true };

    case OFFER_BANNER_DELETE_SUCCESS:
      return { loading: false, success: true };

    case OFFER_BANNER_DELETE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const activeOfferBannerReducer = (state = { banner: null }, action) => {
  switch (action.type) {
    case OFFER_BANNER_ACTIVE_REQUEST:
      return { loading: true };

    case OFFER_BANNER_ACTIVE_SUCCESS:
      return { loading: false, banner: action.payload };

    case OFFER_BANNER_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ACTIVE_OFFER_BANNER:
      return {};

    default:
      return state;
  }
};
