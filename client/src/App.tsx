import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import Credit from './pages/Credit';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import { useAppSelector } from './app/hooks';
import { ToastContainer } from 'react-toastify';
import { useLoadUnknownCredit } from './hooks/useGetUC';

const App: React.FC = () => {
  const showLogin = useAppSelector(state => state.user.showLogin);
  const token = useAppSelector(state => state.user.token);

  const { loadUnknownCredit } = useLoadUnknownCredit();

  useEffect(() => {
    if (token)
      loadUnknownCredit();
  }, [token])

  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-black via-gray-900 to-orange-600'>
      <Navbar />
      {
        showLogin && <Login />
      }
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/text-to-image' element={<Result />} />
        <Route path='/buy-unknown-credit' element={<Credit />} />
        <Route path='*' element={<h1 style={{ height: '70vh', color: 'white'}}>404 Not Found!</h1>} />
      </Routes>
      <Footer />
      <ToastContainer
        position='bottom-right'
      />
    </div>
  )
}

export default App;