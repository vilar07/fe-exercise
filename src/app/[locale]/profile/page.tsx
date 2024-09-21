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
import defaultPubImage from "../../../../public/images/defaultPub.jpg";
import { motion } from "framer-motion";
import { InputTextarea } from "primereact/inputtextarea";
import { useTranslations, useLocale} from 'next-intl'
import { format } from 'date-fns';

export default function Profile() {

    const t = useTranslations('Profile');
    const locale = useLocale();
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
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [nome, setNome] = useState<string>('');
    const [phone, setPhone] = useState<number | null>(null);
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [user, setUser] = useState<User>();
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [postTitle, setPostTitle] = useState<string>('');
    const [postText, setPostText] = useState<string>('');
    //Modal para editar perfil
    const [visible, setVisible] = useState(false);
    //Modal para adicionar publicação
    const [visiblePub, setVisiblePub] = useState(false);
    //Modal para Editar Publicações
    const [visibleDialogs1, setVisibleDialogs1] = useState<boolean[]>([]);
    const openDialog1 = (index: number) => {
        const newVisibleDialogs = [...visibleDialogs1];
        newVisibleDialogs[index] = true;
        setVisibleDialogs1(newVisibleDialogs);
    };
    const closeDialog1 = (index: number) => {
        const newVisibleDialogs = [...visibleDialogs1];
        newVisibleDialogs[index] = false;
        setVisibleDialogs1(newVisibleDialogs);
    };

    //verificar se está autenticado
    useEffect(() => {
        if(localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null) {
            alert('Por favor faça login para aceder a esta página');
            window.location.href = `/${locale}/login`;
        }
        setIsAuthenticated(true);
    }, []);

    //Carregar dados do utilizador, verifica primeiro se existem dados guardados no localStorage
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

    //Carregar publicações do utilizador , verifica primeiro se existem publicações guardadas no localStorage
    useEffect(() => {
        if(user === undefined) return;
        const savedPosts = localStorage.getItem('posts');
        if (savedPosts !== null) {
            const parsedPosts = JSON.parse(savedPosts);
            
            // Ordenar os posts pela data original
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

    //Atualizar dados do utilizador e guardar no localStorage
    async function updateAccount() {
        const updatedUser = {
            id: user?.id,
            email: email,
            password: user?.password,
            firstName: nome,
            lastName: user?.lastName,
            phoneNumber: phone,
            address: address
        }
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Perfil atualizado com sucesso!');
        window.location.reload();
    }

    //Atualizar publicação e guardar no localStorage
    async function updatePost(index: number) {
        const updatedPosts = [...userPosts];
        updatedPosts[index] = {
            userId: user!.id,
            postedAt: new Date().toISOString(),
            title: postTitle,
            text: postText
        }
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        alert('Publicação atualizada com sucesso!');
        window.location.reload();
    }

    //Criar nova publicação e guardar no localStorage
    async function createPost() {
        const newPost = {
            userId: user!.id,
            postedAt: new Date().toISOString(),
            title: postTitle,
            text: postText
        }
        const updatedPosts = [...userPosts];
        updatedPosts.unshift(newPost);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        setPostText(""); setPostTitle("");
        alert('Publicação criada com sucesso!');
        window.location.reload();
    }

    //Apagar publicação e guardar no localStorage
    async function deletePost(index: number) {
        const updatedPosts = [...userPosts];
        updatedPosts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        alert('Publicação apagada com sucesso!');
        window.location.reload();
    }

    return (
        <div className='w-full p-8'>
            {isAuthenticated === true && (
                <div className='w-full grid grid-cols-1 gap-1'>
                    <div className='w-full flex items-center jusify-center'>
                        <AnimatedText
                        text={t('title')}
                        className="font-serif text-gray-100 text-center text-4xl lg:text-6xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] break-words mt-4"
                        />
                    </div>
                    <motion.div className="w-full flex justify-end items-end px-16 translate-y-28 hidden lg:flex"
                    initial={{opacity:0}} whileInView={{opacity:100}} transition={{duration:3}}>
                        <Button label={t('addPublication')} className='w-30 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised mr-2' 
                        onClick={() => {setVisiblePub(true); setPostText(""); setPostTitle("");}} />
                        <Dialog header={t('addPublication')} visible={visiblePub} style={{ width: '50vw' }} onHide={() => {setVisiblePub(false)}}>
                            <div className='w-full grid grid-cols-1 p-4 py-16 mt-2'>
                                <div className='w-full grid grid-cols-1 gap-1'>
                                    <div className='w-full flex items-center justify-start'>
                                        <FloatLabel>
                                            <InputText id="nome" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className='w-full p-2 border-2 rounded-xl'/>
                                            <label htmlFor="nome">{t('pubTitle')}</label>
                                        </FloatLabel>
                                    </div>
                                    <div className='w-full flex items-center justify-center p-float-label mt-8'>
                                        <InputTextarea autoResize value={postText} rows={5} cols={30} 
                                        onChange={(e) => setPostText(e.target.value)}
                                        className='border-2 w-full p-6'/>
                                        
                                        <label htmlFor="username">{t('description')}</label>
                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-center mt-4'>
                                    <Button label={t('save')} className='w-24 mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised' onClick={createPost} />
                                </div>
                            </div>
                        </Dialog>
                    </motion.div>
                    <div className="w-full grid lg:grid-cols-3 grid-cols-1 gap-1">             
                        <motion.div className='w-full h-[650px] grid grid-cols-1 gap-1 p-6  bg-opacity-30 rounded-xl shadow-xl mt-32 bg-stone-300 border-2'
                        initial={{opacity:0, x:-200}} whileInView={{opacity:100, x:0}} transition={{duration:1.5}}>
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
                                    <Button label={t('editButton')}
                                    className='w-24 mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised' 
                                    onClick={() => setVisible(true)}/>
                                    <Dialog header="Editar Perfil" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                                        <div className='w-full grid grid-cols-1 p-16'>
                                            <div className='w-full grid grid-cols-2 gap-8'>
                                                <div className='w-full flex items-center justify-start'>
                                                    <FloatLabel>
                                                        <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className='p-2 border-2 rounded-xl'/>
                                                        <label htmlFor="nome">{t('name')}</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className='w-full flex items-center justify-start'>
                                                    <FloatLabel>
                                                        <InputNumber className="w-full h-12 border-2 rouded-lg" inputId="withoutgrouping" value={phone} onValueChange={(e: InputNumberValueChangeEvent) => setPhone(e.value ?? null)} useGrouping={false} />
                                                        <label htmlFor="phone">{t('phoneNumber')}</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className='w-full flex items-center justify-start'>
                                                    <FloatLabel>
                                                        <InputText disabled id="email" value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 border-2 rounded-xl'/>
                                                        <label htmlFor="email">{t('email')}</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className='w-full flex items-center justify-start'>
                                                    <FloatLabel>
                                                        <InputText id="address" value={address} onChange={(e) => setAddress(e.target.value)} className='p-2 border-2 rounded-xl'/>
                                                        <label htmlFor="address">{t('address')}</label>
                                                    </FloatLabel>
                                                </div>
                                            </div>
                                            <div className='w-full flex items-center justify-start mt-4'>
                                                <Button label={t('save')} className='w-24 mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised' onClick={updateAccount} />
                                            </div>
                                        </div>
                                    </Dialog>
                                </div>
                            </div>
                        </motion.div>
                        <div className="w-full col-span-2 grid grid-cols-1 gap-1 mt-16 lg:mt-32 lg:px-16">
                        <motion.div className="w-full flex justify-start  flex lg:hidden"
                        initial={{opacity:0}} whileInView={{opacity:100}} transition={{duration:3}}>
                            <Button label={t('addPublication')} className='w-30 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised mr-2' 
                            onClick={() => {setVisiblePub(true); setPostText(""); setPostTitle("");}} />
                                <Dialog header="Adicionar Publicação" visible={visiblePub} style={{ width: '50vw' }} onHide={() => {setVisiblePub(false)}}>
                                    <div className='w-full grid grid-cols-1 p-4 py-16 mt-2'>
                                        <div className='w-full grid grid-cols-1 gap-1'>
                                            <div className='w-full flex items-center justify-start'>
                                                <FloatLabel>
                                                    <InputText id="nome" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className='w-full p-2 border-2 rounded-xl'/>
                                                    <label htmlFor="nome">{t('pubTitle')}</label>
                                                </FloatLabel>
                                            </div>
                                            <div className='w-full flex items-center justify-center p-float-label mt-8'>
                                                <InputTextarea autoResize value={postText} rows={5} cols={30} 
                                                onChange={(e) => setPostText(e.target.value)}
                                                className='border-2 w-full p-6'/>
                                                
                                                <label htmlFor="username">{t('description')}</label>
                                            </div>
                                        </div>
                                        <div className='w-full flex items-center justify-center mt-4'>
                                            <Button label={t('save')} className='w-24 mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised' onClick={createPost} />
                                        </div>
                                    </div>
                                </Dialog>
                            </motion.div>
                            <motion.div className="w-full h-[660px] grid grid-cols-1 gap-4 lg:overflow-y-scroll"
                            initial={{opacity:0, x:200}} whileInView={{opacity:100, x:0}} transition={{duration:1.5}}>
                                {userPosts.length > 0 ? (
                                    userPosts.map((post: Post, index: number) => (
                                        <div key={index} className="w-full h-52 grid grid-cols-1 md:grid-cols-3 gap-1 border-2 rounded-xl shadow-lg p-4">
                                            <div className="w-full flex items-center justify-end col-span-3">
                                                <h3 className="w-full text-end text-black text-opacity-70">
                                                    {format(new Date(post.postedAt), 'dd/MM/yyyy HH:mm:ss')}
                                                </h3>
                                            </div>
                                            <div className="w-full flex items-center justify-center">
                                                <Image src={defaultPubImage} alt='Default Profile Picture' width={150} height={150} className='rounded-xl shadow-2xl hover:scale-105 ' />
                                            </div>
                                            <div className="w-full grid grid-cols-1 gap-1 col-span-2">
                                                <div className="w-full flex items-center">
                                                    <h1 className="w-full text-2xl font-bold font-serif">{post.title}</h1>
                                                </div>
                                                <motion.hr
                                                    initial={{ width: 0 }} 
                                                    whileInView={{ width: '100%' }}
                                                    transition={{ duration: 1 }}
                                                    viewport={{ once: true }}
                                                    className="w-full h-1 rounded-xl bg-black bg-opacity-40 -translate-y-2"
                                                />
                                                <div className="w-full flex items-start justify-start">
                                                    <h1 className="w-full text-lg font-serif">{post.text}</h1>
                                                </div>
                                                <div className='w-full flex flex-row justify-end'>
                                                    <Button label={t('editButton')} className='w-24 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised mr-2' onClick={() => {openDialog1(index); setPostTitle(post.title); setPostText(post.text)}} />
                                                    <Button label={t('deleteButton')} className='w-24 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-700 raised' onClick={()=>{deletePost(index)}}/>
                                                    <Dialog header="Editar Publicação" visible={visibleDialogs1[index]} style={{ width: '50vw' }} onHide={() => {closeDialog1(index)}}>
                                                        <div className='w-full grid grid-cols-1 p-4 py-16 mt-2'>
                                                            <div className='w-full grid grid-cols-1 gap-1'>
                                                                <div className='w-full flex items-center justify-start'>
                                                                    <FloatLabel>
                                                                        <InputText id="nome" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className='w-full p-2 border-2 rounded-xl'/>
                                                                        <label htmlFor="nome">{t('pubTitle')}</label>
                                                                    </FloatLabel>
                                                                </div>
                                                                <div className='w-full flex items-center justify-center p-float-label mt-8'>
                                                                    <InputTextarea autoResize value={postText} rows={5} cols={30} 
                                                                    onChange={(e) => setPostText(e.target.value)}
                                                                    className='border-2 w-full p-6'/>
                                                                    <label htmlFor="username">{t('description')}</label>
                                                                </div>
                                                            </div>
                                                            <div className='w-full flex items-center justify-center mt-4'>
                                                                <Button label={t('save')} className='w-24 mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 raised' onClick={() => updatePost(index)} />
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='w-full flex items-center justify-center'>
                                        <h1 className='text-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-serif font-bold'>{t('noPublications')}</h1>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            )}    
        </div>
    )
}