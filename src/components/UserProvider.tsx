// ThemeContext.js
import React, { createContext, useContext, useState } from "react";

// Create a Context
export const UserContent = createContext<Express.User | null>(null);

// Create a Provider Component
export const UserProvider = ({
  children,
  state,
}: {
  children: React.ReactNode;
  state: Express.User | null;
}) => {
  return <UserContent.Provider value={state}>{children}</UserContent.Provider>;
};
export function useAuth(): Express.User | null {
  return useContext(UserContent);
}
