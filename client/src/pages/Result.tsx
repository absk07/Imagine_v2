import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
// import Sidebar from '../components/Sidebar';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { setShowLogin } from '../features/user/userSlice';
import { setHistory } from '../features/user/historySlice';
import { useGenerateImage } from '../hooks/useGenerateImage';
import { useGetAllHistoryQuery } from '../api/historyApi';
import { assets } from '../assets/assets';
import { motion } from 'motion/react';
import type { HistoryItem } from '../features/user/historySlice';

const SidebarLazy = lazy(() => import('../components/Sidebar'));

const SidebarSkeleton = () => (
    <div className="fixed top-0 left-0 h-screen w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 text-white flex flex-col z-40 shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <div className="h-6 bg-white/10 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse"></div>
        </div>
        
        <div className="flex-1 p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
            ))}
        </div>
        
        <div className="p-4 border-t border-white/10">
            <div className="h-3 bg-white/5 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
    </div>
);

const Result: React.FC = () => {
    const user = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    
    const [prompt, setPrompt] = useState<string>('');
    const [image, setImage] = useState<string>(assets.sample_img_1);
    const [isImageloaded, setIsImageLoaded] = useState<boolean>(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

    const [generateTextToImage, isGenImageLoading] = useGenerateImage();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { data: history, refetch: refetchHistory } = useGetAllHistoryQuery();

    useEffect(() => {
        if (user && history?.data) {
            const sortedHistory = [...history.data].sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            dispatch(setHistory(sortedHistory));
        }
    }, [history, user]);

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            dispatch(setShowLogin(true));
            return;
        }

        if (prompt) {
            const imgUrl = await generateTextToImage(prompt);
            if (imgUrl) {
                setIsImageLoaded(true);
                setImage(imgUrl);
                setSelectedHistoryId(null);
                await refetchHistory();
            }
        }

        setPrompt('');
    };

    const handleHistoryClick = (item: HistoryItem) => {
        setImage(item.url);
        setPrompt('');
        setIsImageLoaded(true);
        setSelectedHistoryId(item._id);
    };

    const handleSelectedHistoryDeleted = () => {
        setImage(assets.sample_img_1);
        setPrompt('');
        setIsImageLoaded(false);
        setSelectedHistoryId(null);
    };

    const handleGenerateAnother = () => {
        setIsImageLoaded(false);
        setSelectedHistoryId(null);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [prompt]);
    
    return (
        <div className='flex min-h-screen'>
            <Suspense fallback={<SidebarSkeleton />}>
                <SidebarLazy 
                    onHistoryClick={handleHistoryClick} 
                    selectedHistoryId={selectedHistoryId}
                    onSelectedHistoryDeleted={handleSelectedHistoryDeleted}
                />
            </Suspense>
            <div className='flex flex-grow text-white justify-center items-center lg:ml-80 transition-all duration-500'>
                <motion.form
                    onSubmit={onSubmitHandler}
                    initial={{ opacity: 0.2, y: 120 }}
                    transition={{ duration: 1 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='flex flex-col min-h-[90vh] justify-center items-center'
                >
                    <div>
                        <div className='relative'>
                            <img src={image} alt='' className='max-w-sm rounded' />
                            <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${isGenImageLoading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
                        </div>
                        {
                        isGenImageLoading && (
                            <div className='flex gap-4 max-w-3xl w-full py-3'>
                            <div className='relative pacman'>
                                <div className='pacman-top'></div>
                                <div className='pacman-bottom'></div>
                                <div className='dot delay-0'></div>
                                <div className='dot delay-1'></div>
                                <div className='dot delay-2'></div>
                            </div>
                            </div> 
                        )
                        }
                    </div>
                    {
                        !isImageloaded && (
                            <div className='flex w-full max-w-xl bg-neutral-500 text-white p-4 rounded-3xl mt-10 transition-all'>
                                <textarea
                                    ref={textareaRef}
                                    className='outline-none w-full resize-none overflow-y-auto break-words bg-transparent px-2 py-1 text-white rounded-md min-h-[48px] max-h-[120px] h-auto'
                                    rows={2} 
                                    placeholder='Imagine Anything . . .' 
                                    required 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    disabled={isGenImageLoading}
                                />
                                <div className='flex items-center justify-between text-sm'>
                                    <button type='submit' className='bg-black rounded-full p-4 m-2 cursor-pointer' disabled={isGenImageLoading}>
                                        Generate
                                    </button>
                                </div>
                            </div>
                        )
                    }
                    {
                        isImageloaded && (
                            <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
                                <p onClick={handleGenerateAnother} className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto border border-orange-600 shadow-[0_0_16px_4px_rgba(0,0,0,0.7)] hover:scale-105 transition-all duration-700 cursor-pointer'>
                                    Generate Another
                                    <img className='h-6' src={assets.star_group} alt='' />
                                </p>
                                <a href={image} download className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto border border-orange-600 shadow-[0_0_16px_4px_rgba(0,0,0,0.7)] hover:scale-105 transition-all duration-700'>
                                    Download
                                    <img className='h-6' src={assets.download_icon} alt='' />
                                </a>
                            </div>
                        )
                    }
                </motion.form>
            </div>
        </div>
    )
}

export default Result;