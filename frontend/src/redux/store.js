// import authSlice from "@/slices/authSlice";
// import { configureStore } from "@reduxjs/toolkit";

// const store=configureStore({
//     reducer:{
//         //iske andar hum slices rakhenge
//         auth:authSlice
//     }
// })

// export default store

import authSlice from "@/slices/authSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistReducer as createPersistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,  // Ensure authSlice is a reducer
});

const persistedReducer = createPersistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
