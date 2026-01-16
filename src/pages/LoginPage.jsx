import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../services/authApi';
import { setCredentials } from '../slices/authSlice';
import { Button, Input } from '../components/Common';
import { ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [login, { isLoading, error }] = useLoginMutation();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ user: res, token: res.token }));
            navigate('/');
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <div className="max-w-[700px] mx-auto py-12 flex flex-col md:flex-row shadow-lg rounded-sm overflow-hidden bg-white min-h-[500px]">
            {/* Left Panel */}
            <div className="md:w-2/5 bg-primary p-8 text-white flex flex-col gap-4">
                <h2 className="text-3xl font-bold">Login</h2>
                <p className="text-lg text-slate-200 leading-relaxed font-medium">Get access to your Orders, Wishlist and Recommendations</p>
                <div className="mt-auto opacity-40">
                    <img src="https://static-assets-web.flixcart.com/batman-returns/static/content/svg/login_img_c4a81e.svg" alt="" className="w-full" />
                </div>
            </div>

            {/* Right Panel: Form */}
            <div className="flex-1 p-10 flex flex-col">
                <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                    <div className="relative">
                        <Input
                            label="Enter Email"
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="border-b-2 border-slate-200 focus:border-primary px-0 py-2 rounded-none shadow-none"
                        />
                    </div>
                    <div>
                        <Input
                            label="Enter Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border-b-2 border-slate-200 focus:border-primary px-0 py-2 rounded-none shadow-none"
                        />
                        <div className="text-right mt-2">
                            <span className="text-primary text-xs font-bold cursor-pointer hover:underline">Forgot?</span>
                        </div>
                    </div>

                    <div className="text-[10px] text-secondary-light">
                        By continuing, you agree to Flipkart's <span className="text-primary font-bold cursor-pointer">Terms of Use</span> and <span className="text-primary font-bold cursor-pointer">Privacy Policy</span>.
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-bold py-2">
                            {error?.data?.message || 'Invalid email or password'}
                        </div>
                    )}

                    <Button type="submit" className="w-full py-4 bg-[#fb641b] hover:bg-[#f4511e] rounded-sm text-white font-bold uppercase shadow-md mt-4" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-auto text-center">
                    <Link to="/register" className="text-primary font-bold text-sm hover:underline">
                        New to Flipkart? Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
