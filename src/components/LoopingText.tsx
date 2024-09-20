import React from 'react'
import { motion } from 'framer-motion';

interface LoopingTextProps {
    text: string;
    className?: string;
  }

  const LoopingText: React.FC<LoopingTextProps> = ({ text, className = "" }) => {
    const words = text.split(" "); // Dividimos o texto em palavras
  return (
    <div className='flex items-center justify-center w-full py-2 mx-auto overflow-hidden sm:py-0'>
      <motion.div
        className={`flex ${className}`}
        initial={{ x: '100%' }} // Começa fora da tela, do lado direito
        animate={{ x: '-100%' }} // Termina fora da tela, do lado esquerdo
        transition={{
          duration: 10, // Duração do loop
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          padding: '20px 0', // Adiciona espaço acima e abaixo
        }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            className="mx-2 font-serif  drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" 
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0], rotate: [0, -5, 0], scale: [1, 1.2, 1] }} // Efeito de saltitar com rotação e escala
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5, // Pausa entre saltos
              delay: index * 0.2, // Atraso para cada palavra
            }}
            style={{
              display: 'inline-block', // Garante que cada palavra ocupe o seu próprio espaço
              lineHeight: '1.2', // Ajusta o espaço entre as palavras
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export default LoopingText