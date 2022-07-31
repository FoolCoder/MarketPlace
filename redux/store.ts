import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authSlice from './reducer/authSlice';
import dashboardSlice from './reducer/dashboardSlice';
import {persistReducer} from 'redux-persist';
// ...

export const rootReducer = combineReducers({
  authReducer: authSlice,
  dashboardReducer: dashboardSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['authReducer', 'dashboardReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk, logger],
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<any>>;
