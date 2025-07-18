import {useState, createContext, useContext} from "react";
import getToken from "./getToken";

export interface User {
  email: string;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {
    throw new Error("AuthProvider not initialized");
  },
  logout: () => {
    throw new Error("AuthProvider not initialized");
  },
  checkAuth: () => {
    throw new Error("AuthProvider not initialized");
  },
});

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    const response = await getToken(email, password);
    if (response) {
      const storedToken = localStorage.getItem("accessToken");

      if (storedToken) {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUser({email: payload.sub});
        setIsAuthenticated(true);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const storedToken = localStorage.getItem("accessToken");

    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp > currentTime) {
          return true;
        } else {
          logout();
          return false;
        }
      } catch (error) {
        logout();
        return false;
      }
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
