import { call, put, takeLatest, takeEvery,take } from 'redux-saga/effects'
import { setUser,sessionFailure} from '../actions'
import { REQUEST_FETCH_USER} from '../constants'
const URL = (process.env.NODE_ENV == 'production') ? '' : "http://localhost:3000/"

//
// function* getAllTodos () {
// try {
//   const res = yield call(fetch, 'v1/todos')
//   const todos = yield res.json()
//   yield put(loadedTodos(todos))
//   } catch (e) {
//   yield put(todosFailure(e.message))
//   }
// }

function* requestSetUser (action) {

  try {
  const options = {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(action.payload),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }

  const res = yield call(fetch, 'login', options)
  const user = yield res.json()

  yield put(setUser(user))
  } catch (e) {
    yield put(sessionFailure({authenticated:'UNAUTHENTICATED'}))
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
  yield takeLatest(REQUEST_FETCH_USER, requestSetUser)
}

export default rootSaga
