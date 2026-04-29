import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

export interface Step {
    title: string;
    description: string;
    icon: string;
}

export const stepsData: Step[] = [
    {
        title: 'Describe Your Vision',
        description: 'Type a phrase, sentence, or paragraph that describes the image you want to create.',
        icon: assets.step_icon_1,
    },
    {
        title: 'Watch the Magic',
        description: 'Our AI-powered engine will transform your text into a high-quality, unique image in seconds.',
        icon: assets.step_icon_2,
    },
    {
        title: 'Download & Share',
        description: 'Instantly download your creation or share it with the world directly from our platform.',
        icon: assets.step_icon_3,
    }
];

const Body: React.FC = () => {
    return (
        <motion.div 
            className='flex flex-col items-center justify-center my-32'
            initial={{ opacity: 0.2, y: 120 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h1 className='text-3xl sm:text-4xl font-semibold mb-2 text-white'>Try it Yourself !</h1>
            <p className='text-lg text-gray-300 mb-8'>Transform Words Into Stunning Images</p>
            <div className='space-y-6 w-full max-w-3xl text-sm'>
                {
                    stepsData.map((step, idx) => (
                        <div
                            key={idx} 
                            className='flex items-center gap-4 p-5 px-8 bg-white/30 shadow-2xl border cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-lg'
                        >
                            <img src={step.icon} alt='' width={40} />
                            <div>
                                <h2 className='text-xl font-medium text-black'>{step.title}</h2>
                                <p className='text-black'>{step.description}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </motion.div>
    )
}

export default Body;