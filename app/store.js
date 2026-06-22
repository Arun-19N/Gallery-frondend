import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';
import storage from 'redux-persist/lib/storage'; // ✅ Use `lib/storage` not `es/storage`
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

// 🔐 Redux Persist Config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};
// console.log('Persist Config:', persistConfig);

// 🔁 Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🏗 Create Store (no need to add `thunk`)
export const store = configureStore({
  reducer: persistedReducer,
  // thunk is included by default, so no need to add it manually
});

// 🔄 Export persistor for PersistGate
export const persistor = persistStore(store);

// console.log('Store and Persistor created:', { store, persistor });

