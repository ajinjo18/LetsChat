import { createSlice } from "@reduxjs/toolkit";

const sentFollowRequestSlice = createSlice({
    name:'sentFollowRequest',
    initialState: {value: false},
    reducers: {
        updatesentFollowRequestTrue: (state) => {
            state.value = true
        },
        updatesentFollowRequestFalse: (state) => {
            state.value = false
        }
    }
})

export const {updatesentFollowRequestTrue, updatesentFollowRequestFalse} = sentFollowRequestSlice.actions

export default sentFollowRequestSlice.reducer