import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signInWithPopup, 
    signOut,
    GoogleAuthProvider 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase-config';

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Auth Provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, 
            (user) => {
                setUser(user);
                setLoading(false);
                setError(null);
            },
            (error) => {
                console.error('Auth state error:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            setError(null);
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            
            console.log('User signed in:', user.displayName);
            return { user, token };
        } catch (error) {
            console.error('Sign in error:', error);
            setError(error.message);
            throw error;
        }
    };

    // Sign out
    const logout = async () => {
        try {
            await signOut(auth);
            console.log('User signed out');
        } catch (error) {
            console.error('Sign out error:', error);
            setError(error.message);
            throw error;
        }
    };

    // Get user token (for API calls)
    const getToken = async () => {
        if (user) {
            return await user.getIdToken();
        }
        return null;
    };

    const value = {
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
        getToken,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
