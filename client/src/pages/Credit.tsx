import React from 'react';
import { motion } from 'motion/react';

export interface Plan {
  id: string;
  price: number;
  credits: number;
  desc: string;
}


export const plans: Plan[] = [
  {
    id: 'Starter',
    price: 50,
    credits: 100,
    desc: 'Best for personal use and exploration beyond the free tier.',
  },
  {
    id: 'Creator',
    price: 100,
    credits: 500,
    desc: 'For creators making premium content for global audiences.',
  },
  {
    id: 'Pro',
    price: 500,
    credits: 5000,
    desc: 'For larger creators and fast-growing businesses.',
  },
];

const Credit: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 120 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='min-h-[70vh] text-center pt-14 mb-10'
    >
      <h1 className='text-center text-4xl font-medium mb-6 sm:mb-10 text-white'>
        Pricing plans for creators
      </h1>
      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans?.map((plan) => (
          <div
            key={plan.id}
            className='w-80 bg-white/30 drop-shadow-sm border rounded-lg py-12 px-8 text-gray-300 hover:scale-105 hover:border-orange-600 transition-all duration-500'
          >
            <p className='text-2xl mt-3 mb-1 font-semibold text-white'>
              {plan.id}
            </p>
            <p className='text-sm break-words'>{plan.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>${plan.price}</span> /{' '}
              {plan.credits} credits
            </p>
            <button className='w-full bg-black text-orange-600 mt-8 text-sm rounded-md py-2.5 min-w-52 cursor-pointer'>
              Buy Plan
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Credit;