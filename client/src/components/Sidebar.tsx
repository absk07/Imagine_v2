import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useDeleteHistoryMutation, useEditHistoryMutation } from '../api/historyApi';
import { updateHistoryItem, deleteHistoryItem } from '../features/user/historySlice';
import type { HistoryItem } from '../features/user/historySlice';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface SidebarProps {
    onHistoryClick: (item: HistoryItem) => void;
    selectedHistoryId: string | null;
    onSelectedHistoryDeleted: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onHistoryClick, selectedHistoryId, onSelectedHistoryDeleted }) => {
    const history = useAppSelector((state) => state.history.history);
    const dispatch = useAppDispatch();

    const [editHistory] = useEditHistoryMutation();
    const [deleteHistory] = useDeleteHistoryMutation();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editName, setEditName] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(id);
            await deleteHistory(id).unwrap();
            dispatch(deleteHistoryItem(id));
            setActiveDropdown(null);
            
            if (selectedHistoryId === id) {
                onSelectedHistoryDeleted();
            }
            
            toast.success('Deleted successfully');
        } catch (error) {
            console.error('Failed to delete history item:', error);
            toast.error('Failed to delete history');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleDropdownToggle = (id: string) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const startEditing = (item: HistoryItem) => {
        setEditingItem(item._id);
        setEditName(item.name);
        setActiveDropdown(null);
    };

    const cancelEditing = () => {
        setEditingItem(null);
        setEditName('');
    };

    const saveEdit = async (id: string) => {
        if (!editName.trim()) {
            cancelEditing();
            return;
        }

        try {
            setIsEditing(id);
            await editHistory({ id, historyName: editName.trim() }).unwrap();
            
            const updatedItem = history.find(item => item._id === id);
            if (updatedItem) {
                dispatch(updateHistoryItem({
                    ...updatedItem,
                    name: editName.trim()
                }));
                toast.success('Renamed successfully');
            }
            
            setEditingItem(null);
            setEditName('');
        } catch (error) {
            console.error('Failed to update history item:', error);
            toast.error('Failed to update history');
        } finally {
            setIsEditing(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            saveEdit(id);
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    const handleHistoryItemClick = (item: HistoryItem, e: React.MouseEvent) => {
        // Don't trigger if clicking on dropdown button or during editing
        if (editingItem === item._id || activeDropdown === item._id) {
            return;
        }
        
        // Check if the click target is the dropdown button or its children
        const target = e.target as HTMLElement;
        if (target.closest('[data-dropdown-button]')) {
            return;
        }

        onHistoryClick(item);
        setIsSidebarOpen(false);
    };

    return (
        <>
            {/* Hamburger menu button for mobile - only show when sidebar is closed */}
            {!isSidebarOpen && (
                <button
                    className='fixed top-20 left-6 z-50 text-white bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl lg:hidden hover:bg-white/20 transition-all duration-300 shadow-lg'
                    onClick={toggleSidebar}
                >
                    <img src={assets.menu_bar} alt='Menu' className='w-5 h-5' />
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 text-white flex flex-col z-40 transition-all duration-500 ease-out shadow-2xl ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                {/* Header */}
                <div className='p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <Link to='/'>
                                <img 
                                    src={assets.imagine_logo}
                                    alt='Imagine' 
                                    className='w-20 sm:w-28 lg:w-20'
                                />
                            </Link>
                        </div>
                        {/* Close button for mobile - only show when sidebar is open */}
                        <button
                            className='lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-200'
                            onClick={toggleSidebar}
                        >
                            <svg 
                                className='w-5 h-5 text-white' 
                                fill='none' 
                                stroke='currentColor' 
                                viewBox='0 0 24 24'
                            >
                                <path 
                                    strokeLinecap='round' 
                                    strokeLinejoin='round' 
                                    strokeWidth={2} 
                                    d='M6 18L18 6M6 6l12 12' 
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable History List */}
                <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-all'>
                    <div className='p-4 space-y-3'>
                        {history.length === 0 ? (
                            <div className='text-center py-12'>
                                <div className='w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center'>
                                    <img src={assets.star_group} alt='Empty' className='w-8 h-8 opacity-50' />
                                </div>
                                <p className='text-gray-400 text-sm'>No history yet</p>
                                <p className='text-gray-500 text-xs mt-1'>Start generating images!</p>
                            </div>
                        ) : (
                            history?.map((item) => (
                                <div
                                    key={item._id}
                                    className='relative group'
                                >
                                    <div 
                                        className={`flex items-center justify-between p-4 backdrop-blur-sm border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20 ${
                                            selectedHistoryId === item._id 
                                                ? 'bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20' 
                                                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                                        }`}
                                        onClick={(e) => handleHistoryItemClick(item, e)}
                                    >
                                        <div className='flex-1 min-w-0 mr-3'>
                                            {editingItem === item._id ? (
                                                <div className='space-y-2'>
                                                    <input
                                                        type='text'
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        onKeyDown={(e) => handleKeyPress(e, item._id)}
                                                        onBlur={() => saveEdit(item._id)}
                                                        className='w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15'
                                                        placeholder='Enter image name...'
                                                        autoFocus
                                                        disabled={isEditing === item._id}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className='flex items-center gap-2'>
                                                        <h3 className='text-sm font-medium text-white truncate mb-1'>
                                                            {item.name.length > 35 ? `${item.name.slice(0, 35)}...` : item.name}
                                                        </h3>
                                                    </div>
                                                    <p className='text-xs text-gray-400'>
                                                        {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        
                                        {editingItem !== item._id && (
                                            <button
                                                data-dropdown-button
                                                className='ml-3 p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDropdownToggle(item._id);
                                                }}
                                            >
                                                <img src={assets.dots} alt='Options' className='w-4 h-4' />
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdown Menu */}
                                    {activeDropdown === item._id && editingItem !== item._id && (
                                        <div className='absolute top-full right-0 z-50 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-40 overflow-hidden'>
                                            <div className='p-2'>
                                                <button
                                                    className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-blue-900 hover:bg-blue-500/10 hover:text-blue-200 rounded-lg transition-all duration-200 group'
                                                    onClick={() => startEditing(item)}
                                                >
                                                    <img src={assets.edit_icon} alt='Rename' className='w-4 h-4 group-hover:scale-110 transition-transform' />
                                                    <span>Rename</span>
                                                </button>
                                                <button
                                                    className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-900 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-all duration-200 group'
                                                    onClick={() => handleDelete(item._id)}
                                                    disabled={isDeleting === item._id}
                                                >
                                                    {isDeleting === item._id ? (
                                                        <div className='w-4 h-4 border border-red-300/30 border-t-red-300 rounded-full animate-spin'></div>
                                                    ) : (
                                                        <img src={assets.delete_icon} alt='Delete' className='w-4 h-4 group-hover:scale-110 transition-transform' />
                                                    )}
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className='p-4 border-t border-white/10 bg-gradient-to-t from-white/5 to-transparent'>
                    <div className='text-xs text-gray-500 text-center'>
                        {history.length} {history.length === 1 ? 'item' : 'items'} saved
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className='fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden'
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default Sidebar;