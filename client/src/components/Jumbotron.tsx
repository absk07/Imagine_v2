import React from 'react';
import { motion } from 'motion/react';
import { motion as fmotion } from 'framer-motion';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setShowLogin } from '../features/user/userSlice';

const sample_imgs = [
    assets.sample_img_1,
    assets.sample_img_2,
    assets.sample_img_3,
    assets.sample_img_4,
    assets.sample_img_5
];

const Jumbotron: React.FC = () => {
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

    const sentence = 'Bring your imagination to life - just type a prompt and watch AI instantly turn your words into breathtaking visuals.';

    const words = sentence.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: {
            staggerChildren: 0.04,
            delayChildren: 0.3 * i,
            },
        }),
    };

    const child = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
            type: 'spring' as const,
            damping: 12,
            stiffness: 100,
            },
        },
    };

    return (
        <motion.div 
            className='flex flex-col items-center justify-center text-center my-20 group' 
            initial={{ opacity: 0.2, y: 100 }} 
            transition={{ duration: 0.5 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            {/* <div className='text-gray-300 inline-flex text-center gap-2 px-6 py-1 rounded-full border border-orange-300 shadow-[0_0_16px_4px_rgba(255,140,0,0.7)]'>
                <p className=''>Text to Image Generator</p>
                <img src={assets.star_icon} alt='' />
            </div> */}
            <motion.h1 
                className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center text-gray-300'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.4 }}
            >
                AI Powered <br /> 
                <span className='text-orange-500 leading-[0.70em] outline-none animate-dimlight box-reflect'>Image</span> Generation.
            </motion.h1>
            <fmotion.p 
                className='text-center max-w-xl mx-auto mt-5 text-gray-300'
                // initial={{ opacity: 0, y: 20 }}
                // animate={{ opacity: 1, y: 1 }}
                // transition={{ duration: 0.8, delay: 0.6 }}
                variants={container}
                initial='hidden'
                animate='visible'
            >
                {words.map((word, index) => (
                    <fmotion.span 
                        key={index} 
                        variants={child} 
                        className='inline-block mr-1'
                    >
                        {word}
                    </fmotion.span>
                ))}
            </fmotion.p>
            <motion.button
                onClick={onClickHandler}
                className='sm:text-lg text-gray-300 bg-black w-auto mt-8 mx-12 px-12 py-2.5 flex items-center gap-2 rounded-full cursor-pointer border border-orange-600 shadow-[0_0_16px_4px_rgba(255,140,0,0.7)]'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ default: { duration: 0.5 }, opacity: { duration: 1, delay: 0.8 } }}
            >
                Generate Images
                <img className='h-6' src={assets.star_group} alt='' />
            </motion.button>
            <motion.div 
                className='flex flex-wrap justify-center mt-16 gap-3'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
            >
                {
                    sample_imgs.map((img, idx) => {
                        return (
                            <motion.img
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                key={idx} 
                                src={img} 
                                alt='' 
                                className='w-50 rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-15' 
                            />
                        )
                    })
                }
            </motion.div>
        </motion.div>
    )
}

export default Jumbotron;