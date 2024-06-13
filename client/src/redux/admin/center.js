import { createSlice } from '@reduxjs/toolkit'

const landerPageSlice = createSlice({
    name:'adminCenter',
    initialState:{value:'dashboard'},
    reducers:{
        showAllUsers: (state)=>{
            state.value = 'showAllUsers'
        },
        showDashboard: (state)=>{
            state.value = 'dashboard'
        }
    }
})

export const { showAllUsers, showDashboard } = landerPageSlice.actions
export default landerPageSlice.reducer