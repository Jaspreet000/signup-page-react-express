import React from 'react'

const Jumpball = () => {
    return (
        <>
            <div className='hidden relative lg:flex items-center justify-center w-1/2 h-full bg-purple-200'>
                <div className='w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce' />
                <div className='w-full h-screen absolute bottom-0 bg-white/10 backdrop-blur-lg' />

            </div>
        </>
    )
}

export default Jumpball