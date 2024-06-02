import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Jumpball from './Jumpball';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const notifySuccess = () => {
        toast.success('Password reset successful!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    };

    const notifyError = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            notifyError('Passwords do not match!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3300/reset-password', { token, password });
            if (response.status === 200) {
                notifySuccess();
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            notifyError('Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <div className='flex w-full h-screen'>
        <div className='bg-purple-100 w-full flex items-center justify-center lg:w-1/2'>
        <div className='bg-white mx-10 px-10 py-10 rounded-3xl border-2 border-gray-200'>
            <h1 className='text-5xl font-semibold mb-4'>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='text-lg' htmlFor="password">New Password</label>
                    <input
                        className='mt-2 w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent'
                        placeholder='Enter your new password'
                        type="password"
                        value={password}
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label className='text-lg mt-2' htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className='mt-2 w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent'
                        placeholder='Confirm your new password'
                        type="password"
                        value={confirmPassword}
                        name="confirmPassword"
                        id="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <button
                        type="submit"
                        className='active:scale-[.98] active:duration-75 transition-all hover:scale-[1.02] ease-in-out py-3 rounded-xl bg-violet-500 text-white text-lg font-bold'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Reset Password'}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
        </div>
        <Jumpball/>
        </div>
        </>
    );
};

export default ResetPassword;
