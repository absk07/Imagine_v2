import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { assets } from '../assets/assets';
import { useAppDispatch } from '../app/hooks';
import { setShowLogin, logout } from '../features/user/userSlice';

const Navbar: React.FC = () => {
    const user = useAppSelector(state => state.user.user);
    const uc = useAppSelector(state => state.user.uc);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className='flex items-center justify-between py-4'>
            <Link to='/'>
                <img src={assets.imagine_logo} alt='' className='w-22 sm:w-28 lg:w-30' />
            </Link>
            <div>
                {
                    user ? (
                        <div className='flex items-center gap-2 sm:gap-3 '>
                            <button onClick={() => navigate('/buy-unknown-credit')} className='flex items-center gap-2 bg-orange-500 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
                                <img src={assets.credit_star} alt='' className='w-5' />
                                <p className='text-xs sm:text-sm font-medium'>UC: {uc}</p>
                            </button>
                            <p className='text-gray-300 max:sm-hidden pl-4'>Hi, {user?.username}</p>
                            <div className='relative group'>
                                <img src={assets.profile_icon} alt='' className='w-10 drop-shadow' />
                                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                    <ul className='list-none m-0 p-2 bg-orange-500 rounded-md border text-sm'>
                                        <li onClick={handleLogout} className='py-1 px-2 cursor-pointer font-medium'>Logout</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-3 sm:gap-5'>
                            <p onClick={() => navigate('/buy-unknown-credit')} className='cursor-pointer text-gray-300'>Pricing</p>
                            <button onClick={() => dispatch(setShowLogin(true))} className='cursor-pointer bg-orange-500 text-black px-7 py-2 sm:px-10 text-sm font-medium rounded-full'>Login</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar;