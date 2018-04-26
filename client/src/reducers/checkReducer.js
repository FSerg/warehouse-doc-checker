import {
  CHECK_STARTED,
  CHECK_FINISHED,
  CHECK_ERROR,
  CHECK_RESET
} from '../actions/checkTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case CHECK_STARTED:
      return { answer: {}, isLoading: true, error: '' };
    case CHECK_FINISHED:
      return { answer: action.payload, isLoading: false, error: '' };
    case CHECK_RESET:
      return { answer: {}, isLoading: false, error: '' };
    case CHECK_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};
