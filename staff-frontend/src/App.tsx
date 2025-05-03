import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import HomePage from './pages/HomePage';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForbiddenPage from './pages/ForbiddenPage';
import ProtectedRoleRoute from './components/ProtectedRoleRoute';
import { config } from './config';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Auth0Provider
        domain={config.auth0.domain}
        clientId={config.auth0.clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: config.auth0.audience,
          scope: 'openid profile email offline_access',
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/start"
              element={
                <ProtectedRoute>
                  <ProtectedRoleRoute>
                    <StartPage />
                  </ProtectedRoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/forbidden"
              element={
                <ProtectedRoute>
                  <ForbiddenPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </Auth0Provider>
    </ChakraProvider>
  );
}

export default App;
