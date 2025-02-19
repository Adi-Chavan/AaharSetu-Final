import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setUser(data.user || null);
    } catch (error) {
      setUser(null);
    }
  };

  // ✅ Define the login function to update state
  const login = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    fetchUser(); // 🔥 Fetch user on app load
  }, []);

  return <AuthContext.Provider value={{ user, setUser, fetchUser, login }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);




// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       return storedUser ? JSON.parse(storedUser) : null;
//     } catch (error) {
//       console.error("Error parsing stored user:", error);
//       return null;
//     }
//   });

//   // Sync user state with localStorage
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [user]);

//   // Function to handle login
//   const login = (userData) => {
//     setUser(userData);
//   };

//   // Function to handle logout
//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Custom Hook to use AuthContext
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }
