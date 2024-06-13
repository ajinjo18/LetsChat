import { createSlice } from '@reduxjs/toolkit'

const initialTheme = localStorage.getItem('theme') || 'lightMode';

if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'lightMode');
}

const themeSlice = createSlice({
    name:'theme',
    initialState: { value: initialTheme },
    reducers: {
        toggleTheme: (state) => {
            state.value = state.value === 'lightMode' ? 'darkMode' : 'lightMode';
            localStorage.setItem('theme', state.value);
        }
    }
})

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;