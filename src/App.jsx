import { React, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ Ensure correct import
import { Navbar } from "./components/layout/navbar";
import { HomePage } from "./pages/home";
import { DonorDashboard } from "./pages/donor/dashboard";
import { DonateForm } from "./pages/donor/donate";
import { NgoDashboard } from "./pages/ngo/dashboard";
import { VolunteerDashboard } from "./pages/volunteer/dashboard";
import { VolunteerRegister } from "./pages/volunteer/register";
import { LiveMap } from "./pages/live-map";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
// import { AdminPanel } from "./pages/admin/dashboard";     
import { Leaderboard } from "./pages/volunteer/leaderboard";
import { NGORegister } from "./pages/ngo/register"
import { Recommend } from "./pages/ml";
import { CertificateGenerator } from './components/layout/CertificateGenerator'


// 🔐 Protected Route Wrapper

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};


function App() {

  useEffect(() => {
    const initLandbot = () => {
      if (!window.myLandbot) {
        const script = document.createElement("script");
        script.type = "module";
        script.async = true;
        script.src = "https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs";

        script.addEventListener("load", () => {
          window.myLandbot = new window.Landbot.Livechat({
            configUrl: "https://storage.googleapis.com/landbot.online/v3/H-2787110-EFXHOM3SAHZ14HLK/index.json",
          });
        });

        document.body.appendChild(script);
      }
    };

    window.addEventListener("mouseover", initLandbot, { once: true });
    window.addEventListener("touchstart", initLandbot, { once: true });

    return () => {
      window.removeEventListener("mouseover", initLandbot);
      window.removeEventListener("touchstart", initLandbot);
    };
  }, []);

  return (
    <AuthProvider> 
      <Router>
        <div className="min-h-screen bg-neutral-50">
          <Navbar />
          <Routes>
            {/* 🏠 Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/map" element={<LiveMap />} />

            {/* 🎗 Donor Routes */}
            <Route path="/donor-dashboard" element={<ProtectedRoute element={<DonorDashboard />} allowedRoles={["donor"]} />} />
            <Route path="/donor/donate" element={<ProtectedRoute element={<DonateForm />} allowedRoles={["donor"]} />} />           
            <Route path="/generate-certificate" element={<ProtectedRoute element={<CertificateGenerator />} allowedRoles={["donor"]} />} />           

            {/* 🏥 NGO Routes */}
            <Route path="/ngo-dashboard" element={<ProtectedRoute element={<NgoDashboard />} allowedRoles={["ngo"]} />} />
            <Route path="/ngo/register" element={<ProtectedRoute element={<NGORegister />} allowedRoles={["ngo"]} /> } /> 
            <Route path="/ml" element={<ProtectedRoute element={<Recommend />} allowedRoles={["ngo"]} /> } />


            {/* 🦸 Volunteer Routes */}
            <Route path="/volunteer-dashboard" element={<ProtectedRoute element={<VolunteerDashboard />} allowedRoles={["volunteer"]} />} />
            <Route path="/volunteer/register" element={<ProtectedRoute element={<VolunteerRegister />} allowedRoles={["volunteer"]} />} />
            <Route path="/volunteer/leaderboard" element={<Leaderboard />} />

            {/* 🛠 Admin Routes */}
            {/* <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminPanel />} allowedRoles={["admin"]} />} /> */}

            {/* 🔄 Redirect Unknown Routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
   </AuthProvider> 
  );
}

export default App;






// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Navbar } from './components/layout/navbar';
// import { HomePage } from './pages/home';
// import { DonorDashboard } from './pages/donor/dashboard';
// import { DonateForm } from './pages/donor/donate';
// import { NgoDashboard } from './pages/ngo/dashboard';
// import { VolunteerDashboard } from './pages/volunteer/dashboard';
// import { VolunteerRegister } from './pages/volunteer/register';
// import { LiveMap } from './pages/live-map';
// import { SignIn } from './pages/auth/sign-in';
// import { SignUp } from './pages/auth/sign-up';
// import { AdminPanel } from './pages/admin/dashboard';
// import { Leaderboard } from './pages/volunteer/leaderboard';
// import { NGODashboard } from './pages/ngo/dashboard';
// import { VolunteerPanel } from './pages/volunteer/dashboard';
// import { DonorPanel } from './pages/donor/dashboard';
// import { AdminDashboard } from './pages/admin/dashboard';


// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-neutral-50">
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
          
//           {/* Auth Routes */}
//           <Route path="/sign-in" element={<SignIn />} />
//           <Route path="/sign-up" element={<SignUp />} />
          
//           {/* Donor Routes */}
//           <Route path="/donor" element={<DonorDashboard />} />
//           <Route path="/donor/donate" element={<DonateForm />} />
          
//           {/* NGO Routes */}
//           <Route path="/ngo" element={<NgoDashboard />} />
          
//           {/* Volunteer Routes */}
//           <Route path="/volunteer" element={<VolunteerDashboard />} />
//           <Route path="/volunteer/register" element={<VolunteerRegister />} />
//           <Route path="/volunteer/leaderboard" element={<Leaderboard />} />
          
//           {/* Admin Routes */}
//           <Route path="/admin" element={<AdminPanel />} />
          
//           {/* Common Routes */}
//           <Route path="/map" element={<LiveMap />} />


//           {/* Currently Not using by Aditya*/}
//           {/* <Route path="/a" element={<NGODashboard />} />

//           <Route path="/VolunteerPanel" element={<VolunteerPanel />} />

 
//           <Route path="/AdminDashboard" element={<AdminDashboard />} /> */}






//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default Appimport