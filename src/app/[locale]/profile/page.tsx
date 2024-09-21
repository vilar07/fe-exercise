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
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {

    interface User {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phoneNumber: number;
        address: string;
    }
    interface Post {
        userId: string;     
        postedAt: string;   
        title: string;      
        text: string;       
      }
    const [visible, setVisible] = useState(false);
    const [nome, setNome] = useState<string>('');
    const [phone, setPhone] = useState<number | null>(null);
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [user, setUser] = useState<User>();
    const [userPosts, setUserPosts] = useState<Post[]>([]);

    useEffect(() => {
        console.log(localStorage);
        const emailToFind = localStorage.getItem('email');
        const currentUser = localStorage.getItem('user');
        if(currentUser !== null) {
            setUser(JSON.parse(currentUser));
            setNome(JSON.parse(currentUser).firstName);
            setPhone(JSON.parse(currentUser).phoneNumber);
            setEmail(JSON.parse(currentUser).email);
            setAddress(JSON.parse(currentUser).address);
            return;
        }
        axios.get('http://localhost:5001/users')
            .then((response) => {
                const foundUser = response.data.find((u: User) => u.email === emailToFind); 
                localStorage.setItem('user', JSON.stringify(foundUser));
                setUser(foundUser); 
                setNome(foundUser.firstName);
                setPhone(foundUser.phoneNumber);
                setEmail(foundUser.email);
                setAddress(foundUser.address);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if(user === undefined) return;
        const savedPosts = localStorage.getItem('posts');
        if(savedPosts !== null) {
            const parsedPosts = JSON.parse(savedPosts);
            parsedPosts.sort((a: Post, b: Post) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
            setUserPosts(parsedPosts);
            return;
        }
        axios.get('http://localhost:5001/posts')
            .then((response) => {
              const allPosts = response.data;
              const userId = user?.id; 
              const filtered = allPosts.filter((post: Post) => post.userId === userId); 
              filtered.sort((a: Post, b: Post) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
              setUserPosts(filtered); 
              localStorage.setItem('posts', JSON.stringify(filtered));
            })
            .catch((error) => {
              console.error(error);
            });
    }, [user]);

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
                <div className="w-full grid grid-cols-3 gap-1">
                    <div className='w-full grid grid-cols-1 gap-1 p-6  bg-opacity-30 rounded-xl shadow-xl mt-32 bg-stone-300 border-2'>
                            <div className='w-full flex items-center justify-center '>
                                <Image 
                                    src={defaultProfilePic} 
                                    alt='Default Profile Picture' 
                                    width={150} 
                                    height={150} 
                                    className='w-64 h-64 border-2 shadow-xl rounded-full -translate-y-20 bg-gray-50 hover:scale-105' 
                                />
                            </div>                  
                            <div className='w-full flex text-center items-center justify-center '>
                                <h1 className='text-4xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-serif font-bold'>{user?.firstName}</h1>
                            </div>
                            <div className='w-full  flex flex-col items-center justify-center bg-light p-4 rounded-xl shadow-md mt-4 bg-stone-200'>
                                <div className='w-full flex flex-row items-center justify-start'>
                                    <i className="pi pi-phone mr-10" style={{ fontSize: '2rem' }}></i>
                                    <h1 className='text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-serif '>{user?.phoneNumber}</h1>
                                </div> 
                                <hr className="w-full h-1 border-1 bg-black text-black bg-opacity-30 mt-2"/>
                                <div className='w-full flex flex-row items-center justify-start my-4'>
                                    <i className="pi pi-book mr-10" style={{ fontSize: '2rem' }}></i>
                                    <h1 className='text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-serif '>{user?.email}</h1>
                                </div> 
                                <hr className="w-full h-1 border-1 bg-black text-black bg-opacity-30"/>
                                <div className='w-full flex flex-row items-center justify-start my-4'>
                                    <i className="pi pi-directions mr-10" style={{ fontSize: '2rem' }}></i>
                                    <h1 className='text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-serif '>{user?.address}</h1>
                                </div> 
                                <hr className="w-full h-1 border-1 bg-black text-black bg-opacity-30"/>
                                <div className='w-full flex items-center justify-center'>
                                    <Button label='Editar' 
                                    className='w-24 mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised' 
                                    onClick={() => setVisible(true)}/>
                                    <Dialog header="Editar Perfil" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                                        <div className='w-full grid grid-cols-1 p-16'>
                                            <div className='w-full grid grid-cols-2 gap-8'>
                                                <div className='w-full flex items-center justify-start'>
                                                    <FloatLabel>
                                                        <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className='p-2 border-2 rounded-xl'/>
                                                        <label htmlFor="nome">Nome</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className='w-full flex items-center justify-start'>
                                                    <FloatLabel>
                                                        <InputNumber className="w-full h-12 border-2 rouded-lg" inputId="withoutgrouping" value={phone} onValueChange={(e: InputNumberValueChangeEvent) => setPhone(e.value ?? null)} useGrouping={false} />
                                                        <label htmlFor="phone">Nº Telemóvel</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className='w-full flex items-center justify-start'>
                                                    <FloatLabel>
                                                        <InputText disabled id="email" value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 border-2 rounded-xl'/>
                                                        <label htmlFor="email">Email</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className='w-full flex items-center justify-start'>
                                                    <FloatLabel>
                                                        <InputText id="address" value={address} onChange={(e) => setAddress(e.target.value)} className='p-2 border-2 rounded-xl'/>
                                                        <label htmlFor="address">Endereço</label>
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
        </div>
    )
}