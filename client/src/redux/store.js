import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import user from './user/user';
import socketIO from './socketIO/socketIO';

import userNotification from './userNotification/userNotification';
import deletePost from './deletePost/deletePost';
import sentFollowRequest from './sentFollowRequest/sentFollowRequest';
import newPostAdded from './newPostAdded/newPostAdded';
import typing from './typing/typing';
import currentConversation from './currentConversation/currentConversation';
import roomSlice from './roomSlice/roomSlice';

import isAdminLogged from './admin/isAdminLogged';
import center from './admin/center';
import themes from './admin/themes';

const persistConfig = {
    key: 'root',
    storage,
};

const adminPersistConfig = {
    key: 'admin',
    storage,
};

const persistedThemeReducer = persistReducer(persistConfig, themes);
const persistedUserReducer = persistReducer(persistConfig, user);


const persistedIsAdminReducer = persistReducer(adminPersistConfig, isAdminLogged);
const persistedCenterReducer = persistReducer(adminPersistConfig, center);
const persistedThemesReducer = persistReducer(adminPersistConfig, themes);

const persistedReducers = {
    theme: persistedThemeReducer,
    user: persistedUserReducer,
    deletePost: deletePost,
    sentFollowRequest: sentFollowRequest,
    typing: typing,
    isAdmin: persistedIsAdminReducer,
    adminCenter: persistedCenterReducer,
    adminTheme: persistedThemesReducer,
    socketId: socketIO,
    room: roomSlice,
    notifications: userNotification,
    isNewPostAdded: newPostAdded,
    currentConversation: currentConversation
};

const store = configureStore({
    reducer: persistedReducers,
});

const persistor = persistStore(store);

export { store, persistor };
