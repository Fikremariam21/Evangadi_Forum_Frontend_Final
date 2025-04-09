import React, { createContext, useState, useEffect } from "react";

export const userProvider = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize state from localStorage
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { user_name: "", user_id: "" };
  });

  useEffect(() => {
    // Sync user state to localStorage whenever it changes
    if (user && user.user_name && user.user_id) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <userProvider.Provider value={[user, setUser]}>
      {children}
    </userProvider.Provider>
  );
};