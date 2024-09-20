"use client";
import { useTranslations, useLocale } from "next-intl";
import React from "react";
import homepageImage from "../../../public/images/homepageImage.jpg";
import Image from "next/image";
import LoopingText from "@/components/LoopingText";
import { motion } from "framer-motion";

export default function Home() {
  const t = useTranslations('Index');
  const locale = useLocale(); // Get the current locale

  return (
    <div className="w-full grid grid-cols-1 gap-1 p-16 mt-8">
      <div className="w-full grid grid-cols-2 gap-1">
        <motion.div className="w-full flex justify-center items-center" initial={{ opacity: 0, width:'0%' }} whileInView={{ opacity:100, width: '100%' }} transition={{duration:2.5}}>
          <Image src={homepageImage} alt="Logo" width={500} height={500} className="border-1 rounded-xl shadow-xl"/>
        </motion.div>
        <div className="w-full flex flex-col justify-start items-center p-8 mt-32">
          <h1 className="w-full text-6xl font-serif text-black drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            FE-Exercise
          </h1>
          <motion.hr
            initial={{ width: 0 }} // Inicialmente com largura 0
            whileInView={{ width: '100%' }} // Animar até 100% da largura do container quando estiver em vista
            transition={{ duration: 1 }} // Duração da animação
            viewport={{ once: true }} // A animação será executada apenas uma vez
            className="w-full mt-6 mb-8 h-1 border-0 rounded-xl bg-black"
          />
          <LoopingText 
            className='w-full !text-4xl !text-blue-400' 
            text="Developed by Tiago Bastos"
          />
        </div>
      </div>
    </div>
  );
}
