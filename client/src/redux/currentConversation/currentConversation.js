import { createSlice } from "@reduxjs/toolkit";

const currentConversationSlice = createSlice({
    name: 'currentConversation',
    initialState:{value:''},
    reducers: {
        setCurrentConversation: (state, action) => {
            state.value = action.payload
        },
        removeCurrentConversation: (state) => {
            state.value = ''
        }
    }
})

export const {setCurrentConversation, removeCurrentConversation} = currentConversationSlice.actions
export default currentConversationSlice.reducer