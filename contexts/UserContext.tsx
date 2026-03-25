// contexts/UserContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type UserContextType = {
  team: string | null;
  setTeam: (team: string) => void;
};

const UserContext = createContext<UserContextType>({
  team: null,
  setTeam: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [team, setTeam] = useState<string | null>(null);
  return (
    <UserContext.Provider value={{ team, setTeam }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
