import { createSlice } from '@reduxjs/toolkit'

const initialTheme = localStorage.getItem('adminTheme') || 'lightMode';

if (!localStorage.getItem('adminTheme')) {
    localStorage.setItem('adminTheme', 'lightMode');
}

const adminThemeSlice = createSlice({
    name:'adminTheme',
    initialState: { value: initialTheme },
    reducers: {
        toggleTheme: (state) => {
            state.value = state.value === 'lightMode' ? 'darkMode' : 'lightMode';
            localStorage.setItem('adminTheme', state.value);
        }
    }
})

export const { toggleTheme } = adminThemeSlice.actions;
export default adminThemeSlice.reducer;