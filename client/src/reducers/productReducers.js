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
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_RESET,
  REVIEW_LIST_REQUEST,
  REVIEW_LIST_SUCCESS,
  REVIEW_LIST_FAIL,
  REVIEW_APPROVE_REQUEST,
  REVIEW_APPROVE_SUCCESS,
  REVIEW_APPROVE_FAIL,
  REVIEW_DELETE_REQUEST,
  REVIEW_DELETE_SUCCESS,
  REVIEW_DELETE_FAIL,
  REVIEW_DELETE_RESET,
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
  PRODUCT_GROUP_REQUEST,
  PRODUCT_GROUP_SUCCESS,
  PRODUCT_GROUP_FAIL,
  
} from "../constants/productConstants";
export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const productDetailsReducer = (
  state = {
    product: { reviews: [], images: [], productdetails: {} },
    variants: [],
  },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };

    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload.product || action.payload, // ✅ backward safe
        variants: action.payload.variants || [], // ✅ new
      };

    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/products/${id}`);

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

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productBulkUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_BULK_UPLOAD_REQUEST:
      return { loading: true };
    case PRODUCT_BULK_UPLOAD_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case PRODUCT_BULK_UPLOAD_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_BULK_UPLOAD_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return { product: {} };
    default:
      return state;
  }
};

export const productreviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_REVIEW_RESET:
      return {};
    default:
      return state;
  }
};
export const reviewListReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case REVIEW_LIST_REQUEST:
      return { loading: true, reviews: [] };

    case REVIEW_LIST_SUCCESS:
      return {
        loading: false,
        reviews: Array.isArray(action.payload) ? action.payload : [], // ✅ safety
      };

    case REVIEW_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
        reviews: [],
      };

    default:
      return state;
  }
};

// Approve a review (Admin)
export const reviewApproveReducer = (state = {}, action) => {
  switch (action.type) {
    case REVIEW_APPROVE_REQUEST:
      return { loading: true };
    case REVIEW_APPROVE_SUCCESS:
      return { loading: false, success: true };
    case REVIEW_APPROVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const reviewDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case REVIEW_DELETE_REQUEST:
      return { loading: true };

    case REVIEW_DELETE_SUCCESS:
      return { loading: false, success: true };

    case REVIEW_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case REVIEW_DELETE_RESET:
      return {};

    default:
      return state;
  }
};
export const productVariantsReducer = (state = { variants: [] }, action) => {
  switch (action.type) {
    case PRODUCT_VARIANTS_REQUEST:
      return { loading: true, variants: [] };

    case PRODUCT_VARIANTS_SUCCESS:
      return { loading: false, variants: action.payload };

    case PRODUCT_VARIANTS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const productGroupDetailsReducer = (
  state = { products: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_GROUP_DETAILS_REQUEST:
      return { loading: true, products: [] };

    case PRODUCT_GROUP_DETAILS_SUCCESS:
      return { loading: false, products: action.payload };

    case PRODUCT_GROUP_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};


export const productVariantAddReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_VARIANT_ADD_REQUEST:
      return { loading: true };

    case PRODUCT_VARIANT_ADD_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_VARIANT_ADD_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const productEditReducer = (
  state = { loading: false, product: {}, variants: [], group: {} },
  action
) => {
  switch (action.type) {
    case PRODUCT_EDIT_REQUEST:
      return { ...state, loading: true };

    case PRODUCT_EDIT_SUCCESS:
      return {
        loading: false,
        product: action.payload.product,
        variants: action.payload.variants,
        group: action.payload.group,
      };

    case PRODUCT_EDIT_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
export const productGroupReducer = (
  state = { common: {}, variants: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_GROUP_REQUEST:
      return { loading: true, common: {}, variants: [] };

    case PRODUCT_GROUP_SUCCESS:
      return {
        loading: false,
        common: action.payload.common,
        variants: action.payload.variants,
      };

    case PRODUCT_GROUP_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productGroupUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_GROUP_UPDATE_REQUEST:
      return { loading: true };

    case PRODUCT_GROUP_UPDATE_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_GROUP_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productVariantUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_VARIANT_UPDATE_REQUEST:
      return { loading: true };

    case PRODUCT_VARIANT_UPDATE_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_VARIANT_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productListByGroupReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_BY_GROUP_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_BY_GROUP_SUCCESS:
      return { loading: false, products: action.payload };
    case PRODUCT_LIST_BY_GROUP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
