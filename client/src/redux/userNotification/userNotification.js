import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatNotifications:[],
    userNotifications: '',
};

const notificationSlice = createSlice({
    name:'notifications ',
    initialState,
    reducers:{
        addChatNotification(state, action){
            state.chatNotifications.push(action.payload);
        },
        clearChatNotification(state){
            state.chatNotifications = []
        },
        adduserNotification(state, action){
            state.userNotifications = action.payload;
        },
        clearUserNotification(state){
            state.userNotifications = []
        },
    }
})

export const {addChatNotification, clearChatNotification, adduserNotification, clearUserNotification} = notificationSlice.actions

export default notificationSlice.reducer