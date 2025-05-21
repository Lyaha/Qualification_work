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
import WarehousesPage from './pages/WarehousesPage';
import StorageZonesPage from './pages/StorageZone';
import ReportsPage from './pages/ReportsPage';
import MovementsPage from './pages/MovementsPage';
import BoxesPage from './pages/BoxPage';
import CategoriesPage from './pages/CategoriesPage';
import DiscountsPage from './pages/DiscountsPage';
import OrderItemsPage from './pages/OrderItemsPage';
import OrdersPage from './pages/OrdersPage';
import ParkingSpotsPage from './pages/ParkingSpotsPage';
import PriceHistoryPage from './pages/PriceHistoryPage';
import ReviewsPage from './pages/ReviewsPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplyOrderItemsPage from './pages/SupplyOrderItemsPage';
import SupplyOrdersPage from './pages/SupplyOrdersPage';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';

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
                    path="/category"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <CategoriesPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/discount"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <DiscountsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-item"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <OrderItemsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-item/:orderId"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <OrderItemsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <OrdersPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/parking-spot"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <ParkingSpotsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/price-history"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <PriceHistoryPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/review"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <ReviewsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supplier"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <SuppliersPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supply-order-item"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <SupplyOrderItemsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supply-order-item/:supplyOrderId"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <SupplyOrderItemsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supply-order"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <SupplyOrdersPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/task"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <TasksPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <UsersPage />
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
                  <Route
                    path="/warehouse"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <WarehousesPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/storage-zone"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <StorageZonesPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/storage-zone/:warehouse_id"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <StorageZonesPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/movements"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <MovementsPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/box"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <BoxesPage />
                        </ProtectedRoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <ProtectedRoleRoute>
                          <ReportsPage />
                        </ProtectedRoleRoute>
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
