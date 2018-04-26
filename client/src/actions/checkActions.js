import axios from 'axios';

import {
  CHECK_STARTED,
  CHECK_FINISHED,
  CHECK_ERROR,
  CHECK_RESET
} from './checkTypes';

export const checkError = error => {
  return {
    type: CHECK_ERROR,
    payload: error
  };
};

export const doCheck = barcode => dispatch => {
  dispatch({ type: CHECK_STARTED });
  axios
    .get('/api/docs/check', { params: { barcode } })
    .then(response => {
      return dispatch({
        type: CHECK_FINISHED,
        payload: response.data
      });
    })
    .catch(error => {
      if (error.response && error.response.status === 400) {
        return dispatch(checkError(error.response.data.result));
      }
      return dispatch(checkError('Внутренняя ошибка сервера!'));
    });
};

export const resetCheck = () => dispatch => {
  dispatch({ type: CHECK_RESET });
};
