import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import HomePage from './pages/HomePage';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForbiddenPage from './pages/ForbiddenPage';
import ProtectedRoleRoute from './components/ProtectedRoleRoute';
import { config } from './config';
import chakraTheme from './theme';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from './components/ui/toaster';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import ProductPage from './pages/ProductPage';
import BatchesPage from './pages/BatchesPage';
import BatchLocationsPage from './pages/BatchLocationsPage';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider attribute="class">
        <ChakraProvider value={chakraTheme}>
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
            <ToastProvider>
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
                    path="/products"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <ProductPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/batches/:productId"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <BatchesPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/batch"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <BatchesPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/batch-location"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <BatchLocationsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/batch-location/:batchId"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <BatchLocationsPage />
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
            </ToastProvider>
          </Auth0Provider>
        </ChakraProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
