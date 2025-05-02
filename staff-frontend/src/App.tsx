import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import HomePage from './pages/HomePage';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  console.log({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirect_uri: window.location.origin,
  });
  return (
    <ChakraProvider value={defaultSystem}>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN!}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
        authorizationParams={{
          redirect_uri: window.location.origin,
          scope: 'openid profile email read:users',
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/start"
              element={
                <ProtectedRoute>
                  <StartPage />
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