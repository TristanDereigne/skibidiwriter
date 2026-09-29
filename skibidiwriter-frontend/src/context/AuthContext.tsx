import * as React from "react";
import { createContext, useState } from "react";

type AuthContextType = {
    user: string | null;
    register: (username: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<string | null>(null);

    const register = (username: string) => {
        setUser(username);
    };

    return (
        <AuthContext.Provider value={{ user, register }}>
            {children}
        </AuthContext.Provider>
);
};