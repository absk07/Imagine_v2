import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

const Description: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0.2, y: 120 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='flex flex-col items-center justify-center my-24 p-6 md:px-28'
        >
            <h1 className='text-gray-300 text-3xl sm:text-4xl font-semibold mb-2'>See the magic yourself</h1>
            <p className='text-gray-400 mb-8'>Turn your imaginations into visuals</p>
            <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
                <img src={assets.sample_img_5} alt='' className='w-80 xl:w-86 rounded-lg' />
                <div>
                    <h2 className='text-3xl font-medium max-w-lg mb-4'>Introducing AI-Powered Text to Image Generator</h2>
                    <p className='text-black mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium dignissimos aut, officiis repellendus voluptate necessitatibus ut sit deserunt eum sapiente. Adipisci, debitis officiis fugiat quia veniam soluta facilis dolorem nesciunt.</p>
                    <p className='text-black mb-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, unde sint dicta recusandae nihil, inventore consequatur iste ea quidem veritatis eligendi deserunt officia perferendis! Animi doloremque id quos dolorum eaque?</p>
                    <p className='text-black mb-4'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur sed dolorum, incidunt modi voluptatum, officia exercitationem dignissimos deserunt cupiditate consectetur autem nam inventore labore possimus mollitia quisquam porro eum vel.</p>
                </div>
            </div>
        </motion.div>
    )
}

export default Description;