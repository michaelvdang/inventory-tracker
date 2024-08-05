'use client'
import React, { createContext } from 'react'
import {User} from 'firebase/auth';

type UserContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const UserProvider = ({children}: {children: React.ReactNode}) => {

  const [user, setUser] = React.useState<User | null>(null);
  
  return (
    // wrap in provider
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}

const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a MyProvider');
  }
  return context;
}

export { UserProvider, useUserContext}