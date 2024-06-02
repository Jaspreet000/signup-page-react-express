import React from 'react'
import Form from '../components/Form'
import Jumpball from './Jumpball';
import 'tailwindcss/tailwind.css';
import '../App.css'


const MainLay = () => {
    return (
        <>
            <div className='flex w-full h-screen'>
                <div className='bg-purple-100 w-full flex items-center justify-center lg:w-1/2'>
                    <Form />
                </div>
                <Jumpball/>
            </div>
           
        </>
    )
}

export default MainLay