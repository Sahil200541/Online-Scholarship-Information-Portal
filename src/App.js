import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/JSX/Navbar';
import Footer from './Components/JSX/Footer';
import Home from './Components/JSX/Home';
import ScholarshipList from './Components/JSX/ScholarshipList';
import ScholarshipDetails from './Components/JSX/ScholarshipDetails';
import About from './Components/JSX/About';
import UserLogin from './Components/JSX/UserLogin';
import UserRegister from './Components/JSX/UserRegister';
import AdminLogin from './Components/JSX/AdminLogin';
import AdminRegister from './Components/JSX/AdminRegister';
import AdminDashboard from './Components/JSX/AdminDashboard';
import Profile from './Components/JSX/Profile';
import CreateScholarship from './Components/JSX/CreateScholarship';
import ManageScholarships from './Components/JSX/ManageScholarships';
import AdminLayout from './Components/JSX/AdminLayout';
import AuthLayout from './Components/JSX/AuthLayout';
import ViewScholarship from './Components/JSX/ViewScholarship';
import EditScholarship from './Components/JSX/EditScholarship';
import FeaturedScholarships from './Components/JSX/FeaturedScholarships';
import ContactUs from './Components/JSX/ContactUs';
import ViewUserQuery from './Components/JSX/ViewUserQuery';
import ViewQueryDetails from './Components/JSX/ViewQueryDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Auth Routes - Without AdminLayout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Admin Routes - Using AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="login" element={<AdminLogin />} />
            <Route path="register" element={<AdminRegister />} />
            <Route path="manage-scholarships" element={<ManageScholarships />} />
            <Route path="create-scholarship" element={<CreateScholarship />} />
            <Route path="scholarships/:id" element={<ViewScholarship />} />
            <Route path="edit-scholarship/:id" element={<EditScholarship />} />
            <Route path="featured-scholarships" element={<FeaturedScholarships />} />
            <Route path="user-queries" element={<ViewUserQuery />} />
            <Route path="user-queries/:queryId" element={<ViewQueryDetails />} />
          </Route>

          {/* Auth Routes - Using AuthLayout */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<UserLogin />} />
            <Route path="register" element={<UserRegister />} />
          </Route>

          {/* Profile Route - With Navbar but No Footer */}
          <Route path="/profile" element={
            <>
              <Navbar />
              <main className="main-content">
                <Profile />
              </main>
            </>
          } />

          {/* Scholarship Routes - With Navbar but No Footer */}
          <Route path="/scholarships" element={
            <>
              <Navbar />
              <main className="main-content">
                <ScholarshipList />
              </main>
            </>
          } />
          <Route path="/scholarship/:id" element={
            <>
              <Navbar />
              <main className="main-content">
                <ScholarshipDetails />
              </main>
            </>
          } />

          {/* Contact Route - With Navbar but No Footer */}
          <Route path="/contact" element={
            <>
              <Navbar />
              <main className="main-content">
                <ContactUs />
              </main>
            </>
          } />

          {/* About Route - With Navbar but No Footer */}
          <Route path="/about" element={
            <>
              <Navbar />
              <main className="main-content">
                <About />
              </main>
            </>
          } />

          {/* Home Route - With Navbar and Footer */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="main-content">
                <Home />
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
