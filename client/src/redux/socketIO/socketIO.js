import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name:'socketId',
    initialState:{value:''},
    reducers:{
        setSocketId(state, action){
            state.value = action.payload
        },
        removeSocketId(state){
            state.value = ''
        }
    }
})

export const {setSocketId, removeSocketId} = socketSlice.actions

export default socketSlice.reducer