import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './propertySlice';

export const store = configureStore({
  reducer: {
    property: propertyReducer,
  },
});
