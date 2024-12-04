import { configureStore } from "@reduxjs/toolkit";
import login from "./login";
import userexplist from './api';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";

// Import AsyncStorage for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

// Persist configuration
const persistConfig = {
  key: 'Accosoft',  // Key for persistence
  version: 1,  // Version of the persistence state
  storage: AsyncStorage,  // Use AsyncStorage for persistence in React Native
};

// Combine your reducers
const reducer = combineReducers({
  login: login,
  userexplist: userexplist,
});

// Wrap your reducer with persistReducer to enable persistence
const persistedReducer = persistReducer(persistConfig, reducer);

// Configure the Redux store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,  // Disable serializable check (necessary for persistence)
    }),
});

// Create the persistor object, which is used to persist the store
export const persistor = persistStore(store);

export default store;
