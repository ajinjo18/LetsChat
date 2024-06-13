import { createSlice } from '@reduxjs/toolkit'

const isAdminSlice = createSlice({
    name:'isAdmin',
    initialState : {
        isAuthenticated: false,
    },
    reducers:{
        isAuthenticated: (state) => {
            state.isAuthenticated = true;
        },
        isNotAuthenticated: (state) => {
            state.isAuthenticated = false;
        }
    }
})

export const { isAuthenticated, isNotAuthenticated } = isAdminSlice.actions
export default isAdminSlice.reducer