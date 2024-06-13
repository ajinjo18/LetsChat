import { createSlice } from '@reduxjs/toolkit';

const newPostAddedSlice = createSlice({
    name: 'isNewPostAdded',
    initialState: { post: null },
    reducers: {
        setNewPost: (state, action) => {
            state.post = action.payload;
        },
        removeNewPost: (state) => {
            state.post = null;
        },
    },
});

export const { setNewPost, removeNewPost } = newPostAddedSlice.actions;
export default newPostAddedSlice.reducer;

export const removeNewPostAfterOneDay = () => (dispatch) => {
    setTimeout(() => {
        dispatch(removeNewPost());
    }, 24 * 60 * 60 * 1000);
};
