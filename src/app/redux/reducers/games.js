import {
  REQUEST_FETCH_GAME,TODOS_FAILURE,FETCH_GAME
} from "../constants/index";

const initialState = null
export default function user(state = initialState, action){

  switch (action.type) {
    case REQUEST_FETCH_GAME:
    return []
      break;
    case FETCH_GAME:
    return [...state,...action.payload]
      break;
    case TODOS_FAILURE:
     return {error:action.payload}
    break;
    default:
      return state
    break;

  }
}
