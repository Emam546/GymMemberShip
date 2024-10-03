// ThemeContext.js
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { createContext, useContext, useState } from "react";

// Create a Context
export const UserContent = createContext<{
  user: Express.User | null;
  setUser: (user: Express.User | null) => any;
}>({
  user: null,
  setUser: () => {},
});

// Create a Provider Component
export const UserProvider = ({
  children,
  state,
}: {
  children: React.ReactNode;
  state: Express.User | null;
}) => {
  const [user, setUser] = useState(state);
  return (
    <UserContent.Provider
      value={{
        setUser,
        user,
      }}
    >
      {children}
    </UserContent.Provider>
  );
};
export function useAuth(): Express.User | null {
  return useContext(UserContent).user;
}
export function useLogUser() {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: async (user: Express.User | null = null) => {
      setUser(user);
    },
  });
  const setUser = useContext(UserContent).setUser;
  return mutate;
}
