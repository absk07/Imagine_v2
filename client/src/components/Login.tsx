import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { useAppDispatch } from '../app/hooks';
import { setShowLogin, setToken, setUser } from '../features/user/userSlice';
import { useLoginMutation, useRegisterMutation } from '../api/userApi';

const loginSchema = z.object({
  email: z.email('Invalid email format.'),
//   password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  email: z.email('Invalid email format.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

const Login: React.FC = () => {
    const [modalState, setModalState] = useState<string>('Sign In');
    const [ userDetails, setUserDetails ] = useState<{ username: string; email: string; password: string }>({
        username: '',
        email: '',
        password: ''
    });
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();


    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        let validationResult;

        if (modalState === 'Sign In') {
            validationResult = loginSchema.safeParse({
                email: userDetails.email,
                password: userDetails.password,
            });
        } else {
            validationResult = registerSchema.safeParse({
                username: userDetails.username,
                email: userDetails.email,
                password: userDetails.password,
            });
        }

        console.log(validationResult)
        // console.log(validationResult?.error?.issues)

        if (!validationResult?.success) {
            validationResult?.error.issues.forEach(err => {
                toast.error(err.message);
            });
            return;
        }

        if (modalState === 'Sign In') {
            const response = await login({
                email: userDetails.email,
                password: userDetails.password,
            });
    
            if ('data' in response) {
                const { data } = response;
                console.log('Login successful:', data);
                dispatch(setToken(data.token));
                dispatch(setUser(data.user));
                dispatch(setShowLogin(false));
                toast.success(data.message);
            } else if ('error' in response) {
                const err = response.error as any;
                console.error('Login error:', err);
                toast.error(err?.data?.message || 'Sign in failed');
            }
        } else {
            const response = await register({
                username: userDetails.username,
                email: userDetails.email,
                password: userDetails.password,
            });
    
            if ('data' in response) {
                const { data } = response;
                console.log('Registeration successful:', data);
                dispatch(setToken(data.token));
                dispatch(setUser(data.user));
                dispatch(setShowLogin(false));
                toast.success(data.message);
            } else if ('error' in response) {
                const err = response.error as any;
                console.error('Registeration error:', err);
                toast.error(err?.data?.message || 'Sign up failed');
            }
        }
        setUserDetails({ username: '', email: '', password: '' });
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form
                onSubmit={onSubmitHandler}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='w-96 sm:w-auto relative bg-white p-10 rounded-xl text-slate-500'
            >
                <h1 className='text-center text-2xl text-neutral-900 font-medium'>{modalState}</h1>
                {
                    modalState === 'Sign In' ? (
                        <p className='text-sm text-center mt-2'>Welcome back! Please enter your details.</p>
                    ) : (
                        <p className='text-sm text-center mt-2'>Welcome! Create a new account to get started.</p>
                    )
                }
                {
                    modalState !== 'Sign In' && (
                        <div className='border border-gray-500 rounded-full p-2 flex items-center gap-2 mt-5'>
                            <img src={assets.profile_icon} alt='' width={25} />
                            <input type='text' placeholder='Username' name='username' onChange={handleInputChange} value={userDetails.username} className='outline-none text-sm' required />
                        </div>
                    )
                }
                <div className='border border-gray-500 rounded-full p-2 flex items-center gap-2 mt-4'>
                    <img src={assets.email_icon} alt='' width={13} />
                    <input type='email' placeholder='Email' name='email' onChange={handleInputChange} value={userDetails.email} className='outline-none text-sm' required />
                </div>
                <div className='border border-gray-500 rounded-full p-2 flex items-center gap-2 mt-4'>
                    <img src={assets.lock_icon} alt='' width={10} />
                    <input type='password' placeholder='Password' name='password' onChange={handleInputChange} value={userDetails.password} className='outline-none text-sm' required />
                </div>
                <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-black w-full text-white hover:text-orange-600 py-2 rounded-full cursor-pointer flex items-center justify-center'
                    disabled={modalState === 'Sign In' ? isLoginLoading : isRegisterLoading}
                >
                    {
                        (modalState === 'Sign In' && isLoginLoading) ||
                        (modalState === 'Sign Up' && isRegisterLoading) && (
                            <svg aria-hidden='true' role='status' className='inline w-4 h-4 me-3 text-orange-600 animate-spin' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='#E5E7EB'/>
                                <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentColor'/>
                            </svg>
                        ) 
                    }
                    {modalState === 'Sign In' ? 'Sign In' : 'Sign Up'}
                </motion.button>
                {
                    modalState === 'Sign In' ? (
                        <p className='mt-5 text-center'>
                            Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setModalState('Sign Up')}>Sign Up</span>
                        </p>
                    ) : (
                        <p className='mt-5 text-center'>
                            Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setModalState('Sign In')}>Sign In</span>
                        </p>
                    )
                }
                <img onClick={() => dispatch(setShowLogin(false))} src={assets.cross_icon} alt='' className='absolute top-5 right-5 cursor-pointer' />
            </motion.form>
        </div>
    )
}

export default Login;