import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import '../App.css'
import Jumpball from './Jumpball';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const notifySuccess = () => {
        toast.success('Password reset link sent successfully!', {
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

        try {
            const response = await axios.post('http://localhost:3300/request-password-reset', { email });
            if (response.status === 200) {
                notifySuccess();
            }
        } catch (error) {
            notifyError('Failed to send password reset link. Please try again.');
        }
    };

    return (
        <>
        <div className='flex w-full h-screen'>
        <div className='bg-purple-100 w-full flex items-center justify-center lg:w-1/2'>
        <div className='bg-white mx-10 px-10 py-10 rounded-3xl border-2 border-gray-200'>
            <h1 className='text-5xl font-semibold mb-4'>Forgot Password?</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='text-lg' htmlFor="email">Email</label>
                    <input
                        className='mt-4 w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent'
                        placeholder='Enter your email'
                        type="email"
                        value={email}
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <input
                        type="submit"
                        className='active:scale-[.98] active:duration-75 transition-all hover:scale-[1.02] ease-in-out py-3 rounded-xl bg-violet-500 text-white text-lg font-bold'
                        value="Send Reset Link"
                    />
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

export default ForgotPassword;
