'use client';
import AnimatedText from "../../../components/AnimatedText";
import Image from "next/image";
import defaultProfilePic from "../../../../public/images/profileImage.jpg";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { useState } from "react";

export default function Profile() {

    const [visible, setVisible] = useState(false);
    const [nome, setNome] = useState<string>('');
    const [phone, setPhone] = useState<number | null>(null);
    const [email, setEmail] = useState<string>('');

    async function updateAccount() {
        console.log(nome, phone, email);
    }

    return (
        <div className='w-full p-8'>
            <div className='w-full grid grid-cols-1 gap-1'>
                <div className='w-full flex items-center jusify-center'>
                    <AnimatedText
                    text="Profile"
                    className="font-serif text-gray-100 text-center text-4xl lg:text-6xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] break-words"
                    />
                </div>
                <div className='w-full grid grid-cols-1 gap-1 p-6  bg-opacity-30 rounded-xl shadow-xl mt-32'>
                        <div className='w-full flex items-center justify-center '>
                            <Image 
                                src={defaultProfilePic} 
                                alt='Default Profile Picture' 
                                width={150} 
                                height={150} 
                                className='w-64 h-64 border-2 shadow-xl rounded-full -translate-y-20 bg-gray-50' 
                            />
                        </div>                  
                        <div className='w-full flex text-center items-center justify-center '>
                            <h1 className='text-4xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-serif font-bold'>Nome</h1>
                        </div>
                        <div className='w-full  flex flex-col items-center justify-center bg-light p-4 rounded-xl shadow-md mt-4'>
                            <div className='w-full flex flex-row items-center justify-start'>
                                <i className="pi pi-phone mr-10" style={{ fontSize: '2rem' }}></i>
                                <h1 className='text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-serif '>Telemovel</h1>
                            </div> 
                            <div className='w-full flex flex-row items-center justify-start my-4'>
                                <i className="pi pi-book mr-10" style={{ fontSize: '2rem' }}></i>
                                <h1 className='text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-serif '>Email</h1>
                            </div> 
                            <div className='w-full flex items-center justify-center'>
                                <Button label='Editar' 
                                className='w-24 mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised' 
                                onClick={() => setVisible(true)}/>
                                <Dialog header="Editar Perfil" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                                    <div className='w-full grid grid-cols-1 p-16'>
                                        <div className='w-full grid grid-cols-2 gap-8'>
                                            <div className='w-full flex items-center justify-start'>
                                                <FloatLabel>
                                                    <InputText id="username" value={nome} onChange={(e) => setNome(e.target.value)} className='p-2 border-2 rounded-xl'/>
                                                    <label htmlFor="username">Nome</label>
                                                </FloatLabel>
                                            </div>
                                            <div className='w-full flex items-center justify-start'>
                                                <FloatLabel>
                                                    <InputNumber className="w-full h-12 border-2 rouded-lg" inputId="withoutgrouping" value={phone} onValueChange={(e: InputNumberValueChangeEvent) => setPhone(e.value ?? null)} useGrouping={false} />
                                                    <label htmlFor="username">Nº Telemóvel</label>
                                                </FloatLabel>
                                            </div>
                                            <div className='w-full flex items-center justify-start'>
                                                <FloatLabel>
                                                    <InputText disabled id="username" value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 border-2 rounded-xl'/>
                                                    <label htmlFor="username">Email</label>
                                                </FloatLabel>
                                            </div>
                                        </div>
                                        <div className='w-full flex items-center justify-center mt-4'>
                                            <Button label="Salvar" className='w-24 mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised' onClick={updateAccount} />
                                        </div>
                                    </div>
                                </Dialog>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}