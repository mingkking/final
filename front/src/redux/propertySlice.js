import { createSlice } from '@reduxjs/toolkit';

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    selectedProperty: null,
  },
  reducers: {
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
  },
});

export const { setSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;
