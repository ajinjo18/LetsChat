import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    currentRoom: null,
  },
  reducers: {
    setRoom(state, action) {
      state.currentRoom = action.payload;
    },
    clearRoom(state) {
      state.currentRoom = null;
    },
  },
});

export const { setRoom, clearRoom } = roomSlice.actions;

export default roomSlice.reducer;
