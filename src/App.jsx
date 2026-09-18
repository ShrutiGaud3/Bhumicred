import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { router } from './app/router.jsx';
import { fetchCurrentUser } from './features/auth/authSlice.js';
import { tokenStorage } from './utils/tokenStorage.js';

import { ToastProvider } from './components/ui/ToastContext.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (tokenStorage.getAccessToken()) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
