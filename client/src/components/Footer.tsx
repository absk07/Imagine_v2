import React from 'react'
import { assets } from '../assets/assets';

const Footer: React.FC = () => {
    return (
        <div>
            <div className='flex items-center justify-between gap-4 py-3 mt-20 '>
                <img src={assets.imagine_logo} alt='' className='w-22 sm:w-28 lg:w-30' />
                <p className='flex pl-4 text-sm text-black max-sm:hidden'>Copyright @Imagine | All rights reserved.</p>
                <div className='flex gap-2.5'> 
                    <img src={assets.facebook_icon} alt='' width={35} />
                    <img src={assets.twitter_icon} alt='' width={35} />
                    <img src={assets.instagram_icon} alt='' width={35} />
                </div>
            </div>
        </div>
    )
}

export default Footer;