import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmailInput = () => {
    const [email, setEmail] = useState('');

    const handleSignUp = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(email)) {
            alert("Thank you for signing up!");
        } else {
            alert("Please enter a valid email address.");
        }
    };

    return (
        <>
            <div className="bg-slate-100 font-serif w-full max-w-8xl mx-auto flex flex-col items-center justify-start gap-6 py-10 px-4 sm:h-[400px] h-auto text-center mt-6">
                <h1 className='text-black text-2xl sm:text-3xl font-extrabold mb-2 w-full max-w-xl mx-auto'>Want First Dibs?</h1>
                <p className="max-w-md sm:max-w-xl text-sm sm:text-base leading-relaxed mb-6 mx-auto font-serif text-black">
                    Join our email list and be the first to know about new limited edition products, <br /> material innovations, and lots of other fun updates.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-xl px-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter Your Email Address'
                        className='w-full sm:w-auto flex-grow p-2 text-black outline-none border-b-2 border-black transition-all duration-300 ease-in-out hover:border-2 hover:border-black'
                    />
                    <button
                        className='bg-black text-white px-6 py-2 w-full sm:w-auto hover:bg-gray-800 transition'
                        onClick={handleSignUp}
                    >
                        SIGN UP
                    </button>
                </div>

                <p className="text-xs sm:text-sm max-w-md px-4 mt-auto mx-auto text-black">
                    Note: You can opt-out at any time. See our{' '}
                    <span className='underline font-extrabold hover:text-blue-500 cursor-pointer'>
                        <Link to='/privacy'>Privacy Policy</Link>
                    </span>{' '}
                    and{' '}
                    <span className='underline font-extrabold hover:text-blue-500 cursor-pointer'>
                        <Link to='/terms'>Terms</Link>
                    </span>.
                </p>
            </div>

         
        </>
    );
};

export default EmailInput;
