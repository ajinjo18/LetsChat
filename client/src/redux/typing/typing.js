import { createSlice } from "@reduxjs/toolkit";

const typingSlice = createSlice({
    name:'typing',
    initialState: {value: ''},
    reducers: {
        addTyping: (state, action) => {
            state.value = action.payload
        },
        removeTyping: (state) => {
            state.value = false
        }
    }
})

export const {addTyping, removeTyping} = typingSlice.actions

export default typingSlice.reducer