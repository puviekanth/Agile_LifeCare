// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from './pages/Inventory';
import AddMedicine from './pages/AddMedicine';
import ProductDetails from './pages/ProductDetails';
import BillProduct from './pages/BillProducts';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Suppliers from './pages/Suppliers'
import AddSuppliers from './pages/AddSupplier'
import Home from './pages/Home';
import Profile from './pages/Profile';
import Products from './pages/Products';
import ViewProduct from './pages/ProductDescription';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import BookConsultation from './pages/BookConsultation';
import UploadPrescription from './pages/UploadPrescription';
import Prescriptions from './pages/Prescriptions';
import UploadList from './pages/UploadList';
import ManualPrescriptions from './pages/ManualPrescriptions';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import VerifiedPrescriptions from './pages/VerifiedPrescriptions';
import CompletedPrescription from './pages/CompletedPrescriptions';
import VerifyConsultation from './pages/VerifyConsultation'; 
import Analytics from './pages/Analytics';
import Orders from './pages/Order';
import PendingOrders from './pages/PendingOrders';
import ProcessingOrders from './pages/ProcessingOrders';
import CompletedOrders from './pages/CompletedOrders';


function App() {
  return (
    <Router>
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={< Home />}/>
          <Route path='/home' element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/addproduct" element={<AddMedicine />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path='/bill' element={<BillProduct />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/suppliers' element={<Suppliers />} />
          <Route path='/addSuppliers' element={<AddSuppliers />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/products' element={<Products />} />
          <Route path="/view/:id" element={<ViewProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path='/checkout' element={<Checkout />}/>
          <Route path='/consultation' element={<BookConsultation />}/>
          <Route path='/prescription' element={<UploadPrescription />} />
          <Route path='/prescriptions' element={<Prescriptions />} />
          <Route path='/upload-list' element={<UploadList />} />
          <Route path='/manual-presc' element={<ManualPrescriptions />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/veri-presc' element={<VerifiedPrescriptions />} />
          <Route path='/comp-presc' element={<CompletedPrescription />} />
          <Route path="/verify-consultation/:token" element={<VerifyConsultation />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/pending-orders' element={<PendingOrders />} />
          <Route path='/processing-orders' element={<ProcessingOrders />} />
          <Route path='/comp-orders' element={<CompletedOrders />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
