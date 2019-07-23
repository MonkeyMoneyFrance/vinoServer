import rootReducer from "../reducers/index";
import rootSaga from "../saga/index"
import { createStore,applyMiddleware } from "redux";
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleWare = createSagaMiddleware()
const store = createStore(rootReducer,applyMiddleware(createLogger,sagaMiddleWare));

sagaMiddleWare.run(rootSaga)
export default store;
