import {
  REQUEST_SET_USER,
  SET_USER,
  TODOS_FAILURE,
  REQUEST_FETCH_USER
} from "../constants/index";

export const sessionFailure = item => ({ type: TODOS_FAILURE, payload: item });
export const requestSetUser = item => ({ type: REQUEST_SET_USER, payload: item });
export const requestFetchUser = item => ({ type: REQUEST_FETCH_USER, payload: item });
export const setUser = item => ({ type: SET_USER, payload: item });
