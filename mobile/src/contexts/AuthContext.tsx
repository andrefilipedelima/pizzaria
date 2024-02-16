import React, { useState, createContext, ReactNode, useEffect } from 'react';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextData = {
    user: userProps;
    isAuthenticated: boolean;
    loadingAuth: boolean;
    loading: boolean;
    signIn: (credentials: SingInProps) => Promise<void>;
    signOut: () => Promise<void>;
}

type userProps = {
    id: string;
    name: string;
    email: string;
    token: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SingInProps = {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps) {

    const [ user, setUser ] = useState<userProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    });

    const [ loadingAuth, setLoadingAuth ] = useState(false);

    const [ loading, setLoading ] = useState(true);

    const isAuthenticated = !!user.name;

    useEffect(() => {

        async function getUser() {
            const userInfo = await AsyncStorage.getItem('@sujeitopizzaria');
            let hasUser: userProps = JSON.parse(userInfo || '{}');

            if (Object.keys(hasUser).length > 0) {

                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;

                setUser({
                    id: hasUser.id,
                    name: hasUser.name,
                    email: hasUser.email,
                    token: hasUser.token
                });

            }
            
            setLoading(false);
        }   

        getUser();

    }, [])

    async function signIn({ email, password}: SingInProps) {
        setLoadingAuth(true);

        try {
            const response = await api.post('/session', {
                email,
                password
            });

            const { id, name, token } = response.data;

            const data = {
                ...response.data
            };

            await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(data));

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser({
                id,
                name,
                email,
                token
            });

            setLoadingAuth(false);

        } catch(error) {
            console.log('Erro ao acessar', error);
            setLoadingAuth(false);
        }
    }

    async function signOut() {
        await AsyncStorage.clear()
            .then(() => {
                setUser({
                    id: '',
                    name: '',
                    email: '',
                    token: ''
                });
            })
    }

    return(
        <AuthContext.Provider 
            value={{ 
                user,
                isAuthenticated,
                loadingAuth,
                loading,
                signIn,
                signOut
            }}>

            { children }
        </AuthContext.Provider>
    )
}