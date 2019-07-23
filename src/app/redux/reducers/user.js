import {
  SET_USER,REQUEST_SET_USER,TODOS_FAILURE,REQUEST_FETCH_USER
} from "../constants/index";

const initialState = {}
export default function user(state = initialState, action){

  switch (action.type) {
    case REQUEST_FETCH_USER:
    return {...state,authenticated:'AUTHENTICATING'}
      break;
    case SET_USER:
    return {...state,...action.payload}
      break;
    case TODOS_FAILURE:
     return {authenticated:'UNAUTHENTICATED'}
    break;
    default:
      return state
    break;

  }
}
