import { call, put, takeLatest, takeEvery,take } from 'redux-saga/effects'
import { setUser,sessionFailure,fetchGame} from '../actions'
import { REQUEST_FETCH_USER,REQUEST_SET_USER,REQUEST_FETCH_GAME} from '../constants'
const URL = (process.env.NODE_ENV == 'production') ? '' : "http://localhost:3000/"


function* requestFetchGame (action = '') {
  console.log('ERE')
  try {
  const options = {
    credentials: 'include',
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }
  let params = ''
  params = "?" + Object.keys(action)
           .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(action[k]))
           .join('&')
  const res = yield call(fetch, URL + 'matchs' + params, options)
  const games = yield res.json()

  yield put(fetchGame(games))
  } catch (e) {
    console.log(e)
  }
}
function* requestFetchUser (action) {
  try {
  const options = {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(action.payload),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }
  const res = yield call(fetch, URL + 'login', options)
  const user = yield res.json()

  yield put(setUser(user))
  } catch (e) {
    yield put(sessionFailure({authenticated:'UNAUTHENTICATED'}))
  }
}
function* requestSetUser (action) {
  try {
  const options = {
    credentials: 'include',
    method: 'GET',
  }
  const res = yield call(fetch, URL + 'user', options)
  if (res.status == 200){
    const user = yield res.json()
    yield put(setUser(user))
  }

  } catch (e) {
    console.log(e)
  }
}

// function* requestFetchUser (action) {
//   try {
//   yield call(fetch, URL + `v1/todos/${action.id}`, { method: 'DELETE' })
//   } catch (e) {
//     console.log(e)
//   // yield put(todosFailure(e.message))
//   }
// }

// function* updateTodo (action) {
// try {
// yield call(fetch, `v1/todos/${action.id}`, { method: 'POST' })
// } catch (e) {
// yield put(todosFailure(e.message))
// }
// }

function* rootSaga() {
  yield takeLatest(REQUEST_FETCH_GAME,requestFetchGame)
  yield takeLatest(REQUEST_SET_USER ,requestSetUser)
  yield takeLatest(REQUEST_FETCH_USER, requestFetchUser)
}

export default rootSaga
