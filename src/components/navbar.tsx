'use client'
import { useTranslations, useLocale} from 'next-intl'
import Link from 'next/link'
import React from 'react'
import LocalSwitcher from './local-switcher';
import logo from '../../public/images/applicationLogo.png'
import Image from 'next/image';
import {Button} from 'primereact/button';
import { useEffect, useState } from "react";


export default function Navbar() {
    const t = useTranslations('Navigation');
    const locale = useLocale();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (isAuthenticated) {
        setIsAuthenticated(true);
      }
    }, [])

    async function logout(){
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('email');
      // localStorage.removeItem('user');
      // localStorage.removeItem('posts');
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  return (
      <nav className='w-full grid grid-cols-3 gap-2 shadow-xl font-serif p-4'>
        <div className='w-full  grid-cols-4 gap-1 text-lg hidden md:grid'>
          <Link href="/" className=' flex items-center justify-end'>
            <h2 className='hover:scale-110 hover:text-gray-500'>
              {t('home')}
            </h2>
          </Link>
          <Link href="/" className=' flex items-center justify-end'>
            <h2 className='hover:scale-110 hover:text-gray-500'>
            {t('about')}
            </h2>
          </Link>
          <Link href={`/${locale}/animals`} className=' flex items-center justify-end'>
            <h2 className='hover:scale-110 hover:text-gray-500'>
            {t('services')}
            </h2>
          </Link>
          <Link href="/" className=' flex items-center justify-end'>
            <h2 className='hover:scale-110 hover:text-gray-500'>
            {t('contact')}
            </h2>
          </Link>
        </div>
        <div className='w-full flex items-center justify-center md:hidden'>
          <i
            className="pi pi-align-justify hover:text-white hover:scale-105" 
            style={{ fontSize: '1.5rem', cursor: 'pointer' }} 
            onClick={toggleMenu}
          ></i>
        </div>
        {isMenuOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 font-serif">
          <div className="relative bg-white py-4 px-24 rounded-lg shadow-lg text-center">
            <button
              className="absolute top-4 right-4 text-black text-4xl -translate-y-3"
              onClick={toggleMenu}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <ul>
              <li className="mb-2"><a href="#home" className="text-black ">{t('home')}</a></li>
              <li className="mb-2"><a href="#about" className="text-black ">{t('about')}</a></li>
              <li className="mb-2"><a href="#services" className="text-black ">{t('services')}</a></li>
              <li className="mb-2"><a href="#contact" className="text-black ">{t('contact')}</a></li>
            </ul>
            <div className='flex items-center justify-center'>
              <LocalSwitcher />
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" 
              onClick={toggleMenu}
            >
              Close
            </button>
          </div>
        </div>
      )}
        <div className='w-full flex items-center justify-center'>
          <Link href="/" className='flex items-center justify-center'>
              <Image src={logo} alt="Amigo dos Animais" width={100} height={100} className='hover:scale-105'/>
          </Link>
        </div>
        <div className='w-full flex items-center justify-end md:pr-8'>
            <div className='items-center justify-center hidden md:flex '>
              <LocalSwitcher />
            </div>
            {!isAuthenticated && (
                <>
                    <Link href={`/${locale}/login`} className='flex items-center justify-center mx-2'>
                        <Button label={t('login')} className="w-full shadow-lg bg-white p-3 rounded-2xl hover:bg-gray-200" />
                    </Link>
                    <Link href={`/${locale}/register`} className='items-center justify-center hidden md:flex'>
                        <Button label={t('register')} className="w-full shadow-lg bg-white p-3 rounded-2xl hover:bg-gray-200" />
                    </Link>
                </>
            )}
            {isAuthenticated && (
                <>
                    <Link href={`/${locale}/profile`} className='flex items-center justify-center mx-2'>
                        <Button label="Perfil" className="w-full shadow-lg bg-white p-3 rounded-2xl hover:bg-gray-200" />
                    </Link>
                    <div>
                      <Button label="Logout" onClick={logout} className="w-full shadow-lg bg-white p-3 rounded-2xl hover:bg-gray-200" />
                    </div>   
                </>
            )}
        </div>
      </nav>
  )
}