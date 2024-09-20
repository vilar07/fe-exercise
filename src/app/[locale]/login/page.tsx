"use client";
import AnimatedText from "../../../components/AnimatedText";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslations, useLocale } from "next-intl"; 

export default function LoginPage() {

    interface User {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
      }

    const t = useTranslations('Login');
    const locale = useLocale(); // Get the current locale
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);


    // Para obter os utilizadores (em vez disto seria um post para o backend)
    useEffect(() => {
        axios.get('http://localhost:5001/users')
        .then((response) => {
            console.log(response.data)
            setUsers(response.data);
        })
        .catch((error) => {
            console.error(error);
        })
    }, []);

    async function login() {
        console.log("entrou")
        const user = users.find((user) => user.email === email && user.password === password);
        if (user) {
            console.log("User found");
            localStorage.setItem("user", email);
            localStorage.setItem("isAuthenticated", "true");
        } else {
            alert("User not found");
        }
    }
    
    return (
        <>
            <AnimatedText
                text="Login"
                className=" !text-5xl mb-16 mt-12 text-center !text-grat-500 lg:text-7xl sm:text-6xl xs:text-4xl sm:px-24 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            />
            <div className="flex flex-col items-center justify-center">
                <div className="w-full justify-center items-center max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8  drop-shadow-2xl">
                    <div className="space-y-6">
                        <h5 className="text-xl font-medium text-gray-900 ">{t('title')}</h5>
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">{t('email')}</label>
                            <input type="username" name="username" id="username" onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="name@company.com" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">{t('password')}</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required />
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 " />
                                </div>
                                <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 ">{t('rememberMe')}</label>
                            </div>
                            <a href="#" className="ml-auto text-sm text-blue-700 hover:underline ">{t('forgotPassword')}</a>
                        </div>
                        <button onClick={login} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">{t('login')}</button>
                        <div className="text-sm font-medium text-gray-500">
                        {t('notRegistered')} <a href={`/${locale}/register`} className="text-blue-700 hover:underline ">{t('register')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}