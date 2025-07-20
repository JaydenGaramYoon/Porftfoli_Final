import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users.jsx";
import Signup from "./user/Signup.jsx";
import Signin from './lib/Signin.jsx'
import Profile from "./user/Profile.jsx";
import PrivateRoute from "./lib/PrivateRoute.jsx";
import AdminRoute from "./lib/AdminRoute.jsx";
import EditProfile from "./user/EditProfile.jsx";
import Contact from "./pages/Contact.jsx";
import Projects from "./pages/Projects.jsx";
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import DeleteUser from "./user/DeleteUser.jsx";
// import Qaulification from "./pages/Qualifications.jsx";

import Menu from "./core/Menu";
function MainRouter() {
  return (
    <div>
      <Menu />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        {/* <Route path="/qaulification" element={<Qaulification />} /> */}
        
        <Route path="/users" element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route
          path="/user/edit/:userId"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/delete/:userId"
          element={
            <PrivateRoute>
              <DeleteUser />
            </PrivateRoute>
          }
        />
        
        <Route path="/user/:userId" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default MainRouter;
