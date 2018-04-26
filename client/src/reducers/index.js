import { combineReducers } from 'redux';
import checkReducer from './checkReducer';
import modalReducer from './modalReducer';

export default combineReducers({
  checkStore: checkReducer,
  modal: modalReducer
});
