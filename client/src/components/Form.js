import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import '../App.css';

const Form = () => {
    const navigate = useNavigate();
    const notifySuccess = () => {
        toast.success('Sign-up successful! A welcome email is on its way...', {
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

    const [formInput, setFormInput] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isChecked, setIsChecked] = useState(false);

    const handleUserInput = (name, value) => {
        setFormInput({
            ...formInput,
            [name]: value,
        });
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const validateFormInput = async (event) => {
        event.preventDefault();

        if (!formInput.email) {
            notifyError("Enter a valid email address");
            return;
        }

        if (formInput.confirmPassword !== formInput.password) {
            notifyError("Password and confirm password should be the same");
            return;
        }

        if (!formInput.password) {
            notifyError("Password should not be empty");
            return;
        }

        if (!isChecked) {
            notifyError("You must check the checkbox to proceed");
            return;
        }

        try {
            // Clear form fields and notify success
            setFormInput({
                email: "",
                password: "",
                confirmPassword: "",
            });

            // Send data to the backend
            const response = await axios.post('http://localhost:3300/signup', {
                email: formInput.email,
                password: formInput.password,
            });

            const { token } = response.data;
            localStorage.setItem('token', token);


            if (response.status === 200) {
                notifySuccess();
                setTimeout(() => {
                    navigate('/posts');
                }, 3000);
            }
            else {
                notifyError("An error occurred during signup, please try again.")
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle 400 Bad Request (duplicate email)
                notifyError("User with this email already exists.");
            } else if (error.response && error.response.status === 500) {
                // Handle network errors or other exceptions
                notifyError("There's a error in password hashing, please try again.");
            } else if (error.response && error.response.status === 429) {
                // Handle network errors or other exceptions
                notifyError("Too many signup attempts.Try after an hour.");
            } else {
                // Handle network errors or other exceptions
                notifyError("An error occurred during signup, please try again.");
            }
        }
    };

    return (
        <>
            <div className='bg-white p-10 rounded-3xl border-2 border-gray-200 out-outer'>
                <div className='outer'>
                    <h1 className='text-4xl font-semibold new-here'>New here ? </h1>
                    <p className='font-medium text-lg text-gray-500 mt-4 welc'>Welcome! Please enter your details.</p>
                    <div className='mt-5 out-form'>
                        <form onSubmit={validateFormInput} className='formm'>
                            <div>
                                <label className='text-lg mail' htmlFor="email">Email</label>
                                <input
                                    className='w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent mail-inp'
                                    placeholder='Enter your email'
                                    value={formInput.email}
                                    name="email"
                                    id='email'
                                    type="email"
                                    onChange={({ target }) => {
                                        handleUserInput(target.name, target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <label className='text-lg pass' htmlFor="password">Password</label>
                                <input
                                    className='w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent pass-inp'
                                    placeholder='Enter your password'
                                    type="password"
                                    value={formInput.password}
                                    name="password"
                                    id="password"
                                    onChange={({ target }) => {
                                        handleUserInput(target.name, target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <label className='text-lg conf-pass' htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    className='w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent conf-pass-in'
                                    placeholder='Enter your password to confirm'
                                    type="password"
                                    value={formInput.confirmPassword}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    onChange={({ target }) => {
                                        handleUserInput(target.name, target.value);
                                    }}
                                />
                            </div>
                            <div className='mt-2 flex flex-col justify-between items-start forgot'>
                                <Link to="/forgot-password" className='font-medium mb-3 text-base text-violet-500 forgot-link'>Forgot password</Link>
                                <div className='flex justify-center items-center'>
                                    <input
                                        type="checkbox"
                                        id='remember'
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className='ml-2 font-medium text-base agree' htmlFor="remember"> Agree to the terms and conditions.</label>
                                </div>
                            </div>
                            <div className='mt-8 flex flex-col gap-y-4 submitt'>
                                <input
                                    type="submit"
                                    className='active:scale-[.98] active:duration-75 transition-all hover:scale-[1.02] ease-in-out py-3 rounded-xl bg-violet-500 text-white text-lg font-bold submit-btn'
                                    value="Sign in"
                                />
                                <button className='border-2 py-3 rounded-xl border-gray-200 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.02] ease-in-out flex items-center justify-center gap-2 goog-sub'>
                                    <svg width="24" height="24" viewBox="0 0 48 48">
                                        <title>Google Logo</title>
                                        <clipPath id="g">
                                            <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                                        </clipPath>
                                        <g className="colors" clipPath="url(#g)">
                                            <path fill="#FBBC05" d="M0 37V11l17 13z" />
                                            <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                                            <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                                            <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                                        </g>
                                    </svg>
                                    Sign up with Google
                                </button>
                            </div>
                            <div className='mt-8 flex justify-center items-center already'>
                                <p className='font-medium text-base already_in'>Already have an account?</p>
                                <button className='text-violet-500 text-base font-medium ml-2 sign-in-btn'>Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Form;


