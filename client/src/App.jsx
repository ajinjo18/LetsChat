import { useEffect } from 'react';

import { Provider } from 'react-redux';
import {store, persistor} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useMediaQuery } from 'react-responsive'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

import MainRoutes from './routes/MainRoutes';

function App() {

  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
  const isDesktop = useMediaQuery({ minWidth: 992 })

  useEffect(() => {
    if (isDesktop || isTablet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isDesktop, isTablet]);

  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer />
            <GoogleOAuthProvider clientId="614436061374-37c26b1nng2s3vr0ul39gfjolmfv77gi.apps.googleusercontent.com">
              <MainRoutes />
            </GoogleOAuthProvider>
        </PersistGate>
      </Provider>

  );
}

export default App;
