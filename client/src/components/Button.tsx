import React from 'react'
import { motion } from 'motion/react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setShowLogin } from '../features/user/userSlice';

const Button: React.FC = () => {
    const user = useAppSelector(state => state.user.user);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onClickHandler = () => {
        if (user) {
            navigate('/text-to-image');
        } else {
            dispatch(setShowLogin(true));
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0.2, y: 120 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='pb-16 text-center'
        >
            <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-950 py-6 md:py-14'>
                You are the wizard. Try now
            </h1>
            <motion.button
                onClick={onClickHandler}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ default: { duration: 0.5 }, opacity: { duration: 1, delay: 0.8 } }}
                className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto cursor-pointer border border-orange-600 shadow-[0_0_16px_4px_rgba(0,0,0,0.7)]'
            >
                Generate Images
                <img className='h-6' src={assets.star_group} alt='' />
            </motion.button>
        </motion.div>
    )
}

export default Button;