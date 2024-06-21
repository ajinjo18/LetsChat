import { createSlice } from "@reduxjs/toolkit";

const postDeleteSlice = createSlice({
    name:'postDelete',
    initialState: {value: false},
    reducers: {
        updateDeletedPostStateTrue: (state) => {
            state.value = true
        },
        updateDeletedPostStateFalse: (state) => {
            state.value = false
        }
    }
})

export const {updateDeletedPostStateTrue, updateDeletedPostStateFalse} = postDeleteSlice.actions

export default postDeleteSlice.reducer