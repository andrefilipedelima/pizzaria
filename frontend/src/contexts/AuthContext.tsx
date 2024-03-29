import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from 'next/router';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext =  createContext({} as AuthContextData);

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token');
        Router.push('/');
    }
    catch {
        console.log("Erro ao deslogar");
    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [ user, setUser ] = useState<UserProps>();

    const isAuthenticated = !!user;

    useEffect(() => {

        //verificar existencia de cookie
        const { '@nextauth.token': token } = parseCookies();

        if (token) {
            api.get('/me').then(response => {
                const { id, name , email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                //se der erro, deslogar usuário
                signOut();
            });
        }

    }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            });

            const { id, name, token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,  // expira em um mês
                path: '/'
            });

            setUser({
                id,
                name,
                email
            });

            //Passar para as próximas requisições
            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success('Usuário logado');

            Router.push('/dashboard');

            //console.log(response.data);
        }
        catch(error) {
            toast.error('Erro ao acessar');
            console.log("Erro ao acessar ", error);
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {

            const response = await api.post('/users', {
                name,
                email,
                password
            });

            toast.success('Conta criada');

            Router.push('/');
        }
        catch(error) {
            toast.error('Erro ao criar conta');
            console.log("Erro ao criar conta ", error);
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            { children }
        </AuthContext.Provider>
    )
}