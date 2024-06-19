import React, {
    createContext,
    useContext,
    useLayoutEffect,
    useState,
} from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('accessToken')
    )
    useLayoutEffect(() => {
        if (
            typeof window !== 'undefined' &&
            localStorage.getItem('accessToken')
        ) {
            login()
        }
    }, [])
    const login = () => {
        setIsAuthenticated(true)
        localStorage.setItem('accessToken', 'true')
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
