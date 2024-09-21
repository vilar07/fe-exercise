import React from 'react'
import Image from 'next/image'
import applicationLogo from '../../public/images/applicationLogo.png'
import { useTranslations, useLocale } from "next-intl";  
import LocalSwitcher from "./local-switcher";  

export const Footer = () => {
    const t = useTranslations('Footer');
    const locale = useLocale(); 
  return (

    <footer className='shadow'>
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 text-black font-serif">
            <div className="w-full flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-between font-serif">
                <a href="/" className="flex items-center mb-4 sm:mb-0">
                    <Image
                    className='hover:scale-105 mr-3 rounded-full shadow-xl'
                    src={applicationLogo}
                    width={100}
                    priority={true}
                    alt="SVCortinados Logo"
                    />
                    <span className="self-center text-xl  whitespace-nowrap hover:scale-105">Fe Exercise</span>
                </a>
                <ul className="flex mt-8 flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 sm:mt-0">
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 ">{t('about')}</a>
                    </li>
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6">{t('privacyPolicy')}</a>
                    </li>
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 ">{t('License')}</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">{t('Contact')}</a>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
            <div className='w-full flex items-center justify-center'>
                <span className="block text-sm sm:text-center ">© 2024 <a href="/" className="hover:underline">Fe Exercise™</a>. All Rights Reserved.</span>
            </div>
        </div>
    </footer>

  )
}