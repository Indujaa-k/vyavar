import { Box } from "@chakra-ui/react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import About from "./pages/About/About";
import Contactus from "./pages/Contactus/Contactus";
import Productpage from "./pages/Product/Productpage";
import Cartpage from "./pages/Cart/Cartpage";
import Footer from "./pages/Footer/Footer";
import LoginScreen from "./pages/Login/LoginScreen";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ScrollIntoView from "./components/Scrollintoview";
import RegisterScreen from "./components/RegisterScreen";
import ProfileScreen from "./components/ProfileScreen";
import Checkout from "./pages/checkout/Checkout";
import Placeorder from "./pages/placeorder/Placeorder";
import Order from "./pages/Order/Order";
import Users from "./pages/Userslist/Users";
import NotFoundPage from "./components/Notfoundpage";
import Edituser from "./pages/Useredit/Edituser";
import Products from "./pages/products/products";
import Editproduct from "./pages/Editproduct/Editproduct";
import Orders from "./pages/Orders/Orders";
import AssignOrderScreen from "./pages/Delivery/AssignOrderScreen";
import { useSelector } from "react-redux";
import InvoiceScreen from "./pages/InvoiceScreen/InvoiceScreen";
import DeliveryHomepage from "./pages/Delivery/DeliveryHomepage";
import OrdersScreen from "./pages/Admin/OrdersScreen";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminBannerScreen from "./pages/AdminBanner/AdminBannerScreen";
import CreateProductPage from "./pages/Editproduct/CreateProductPage";
import AdminVideoBanner from "./pages/AdminBanner/AdminVideoBanner";
import ProductsListPage from "./pages/ProductsListPage/ProductsListPage";
import { useNavigate } from "react-router-dom";
import BulkUploadPage from "./pages/Editproduct/BulkUpload";
import Overview from "./pages/products/productOverview";
import IncomeByCity from "./components/IncomeBycity/Incomebycity";
import TransactionTable from "./pages/Transactions/Transaction";
import AdminReviewPage from "./pages/Admin/AdminReviewPage";
import ScrollButtons from "./components/ScrollButtons";
import FavoritesPage from "./pages/Favourites/FavoritesPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import OrderStatusScreen from "./pages/Admin/OrderStatus";
import DeliveryLayout from "./pages/Delivery/DeliveryLayout";
import DeliveryOrdersPage from "./pages/Delivery/DeliveryOrdersPage";
import DeliveryDetails from "./pages/Delivery/DeliveryDetails";
import DeliveryTransactionsScreen from "./pages/Delivery/DeliveryTransactionScreen";
import AdminTransactionsScreen from "./pages/Admin/AdminTransactionScreen";
import BillingInvoice from "./pages/Admin/BillingInvoice";
import ForgotPasswordScreen from "./components/ForgotPassword/ForgetPasswordScreen";
import ResetPasswordScreen from "./components/ForgotPassword/ResetPasswordScreen";
// import ProtectedRoute from "./pages/ProtectedRoutes";
const App = () => {
  const { userInfo } = useSelector((state) => state.userLogin);

  return (
    <div className="main">
      <ChakraProvider>
        <Router>
          <ScrollIntoView>
            <Routes>
              {/* Authentication Routes */}
              <Route
                path="/login"
                element={
                  userInfo ? (
                    userInfo.isAdmin ? (
                      <Navigate to="/admin" replace />
                    ) : userInfo.isDelivery ? (
                      <Navigate to="/deliveryhomepage" replace />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  ) : (
                    <LoginScreen />
                  )
                }
              />
            </Routes>

            {userInfo && userInfo.isDelivery ? (
              <DeliveryLayout>
                <Routes>
                  <Route
                    path="/deliveryhomepage"
                    element={<DeliveryHomepage />}
                  />
                  <Route
                    path="/deliveryorders/:status"
                    element={<DeliveryOrdersPage />}
                  />
                  <Route path="/profile" element={<ProfileScreen />} />{" "}
                  <Route path="*" element={<NotFoundPage />} />
                  <Route
                    path="/delivery/transactions"
                    element={<DeliveryTransactionsScreen />}
                  />
                </Routes>
              </DeliveryLayout>
            ) : userInfo && userInfo.isAdmin ? (
              <AdminLayout>
                <Routes>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/admin/userlist" element={<Users />} />
                  <Route path="/admin/productlist" element={<Products />} />
                  <Route path="/product/:id" element={<Productpage />} />
                  <Route path="/admin/orderlist" element={<Orders />} />
                  <Route path="/orders" element={<OrdersScreen />} />
                  <Route path="/orders/:status" element={<OrdersScreen />} />
                  <Route path="/order/:id" element={<Order />} />
                  <Route path="/admin/user/:id/edit" element={<Edituser />} />
                  <Route
                    path="/deliverydetails"
                    element={<DeliveryDetails />}
                  />
                  <Route
                    path="/:orderId/orderscreenstatus"
                    element={<OrderStatusScreen />}
                  />
                  <Route
                    path="/admin/incomebycity"
                    element={<IncomeByCity />}
                  />
                  <Route
                    path="/admin/product/create"
                    element={<CreateProductPage />}
                    exact
                  />
                  <Route
                    path="/admin/bulkupload"
                    element={<BulkUploadPage />}
                  />
                  <Route
                    path="/admin/product/:id/edit"
                    element={<Editproduct />}
                  />
                  <Route
                    path="/admin/assignorders"
                    element={<AssignOrderScreen />}
                    exact
                  />{" "}
                  <Route path="/products/" element={<ProductsListPage />} />
                  <Route path="/search/:keyword" element={<Home />} />
                  <Route path="/adminbanner" element={<AdminBannerScreen />} />
                  <Route
                    path="/adminvideobanner"
                    element={<AdminVideoBanner />}
                  />
                  <Route
                    path="/admin/order/:id/invoice"
                    element={<InvoiceScreen />}
                    exact
                  />
                  <Route
                    path="/products/:category"
                    element={<ProductsListPage />}
                  />
                  <Route path="/billinginvoice" element={<BillingInvoice />} />
                  <Route path="/productsoverview" element={<Overview />} />
                  <Route path="/transactions" element={<TransactionTable />} />
                  <Route path="/adminreview" element={<AdminReviewPage />} />
                  <Route path="/adminDashboard" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFoundPage />} />
                  <Route
                    path="/admin/delivery/transactions"
                    element={<AdminTransactionsScreen />}
                  />
                </Routes>{" "}
              </AdminLayout>
            ) : (
              <>
                <Nav />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Favorites" element={<FavoritesPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contactus" element={<Contactus />} />
                  <Route path="/product/:id" element={<Productpage />} />
                  <Route path="/cart/:id?" element={<Cartpage />} />
                  <Route path="/login/*" element={<Navigate to="/login" />} />
                  <Route path="/register" element={<RegisterScreen />} />
                  <Route
                    path="/forgetpassword"
                    element={<ForgotPasswordScreen />}
                  />
                  <Route
                    path="/resetPassword"
                    element={<ResetPasswordScreen />}
                  />

                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/shipping" element={<Checkout />} />
                  <Route path="/placeorder" element={<Placeorder />} />
                  <Route path="/order/:id" element={<Order />} />
                  <Route path="/search/:keyword" element={<Home />} />
                  <Route
                    path="/admin/order/:id/invoice"
                    element={<InvoiceScreen />}
                    exact
                  />
                  <Route path="/products/" element={<ProductsListPage />} />
                
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <ScrollButtons />
                <Footer />
                {/* path="/products/:category" */}
              </>
            )}
          </ScrollIntoView>
        </Router>
      </ChakraProvider>
    </div>
  );
};
export default App;
