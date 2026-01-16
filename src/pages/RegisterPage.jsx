import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../services/authApi';
import { setCredentials } from '../slices/authSlice';
import { Button, Input } from '../components/Common';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [register, { isLoading, error }] = useRegisterMutation();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        try {
            const res = await register({ name, email, password }).unwrap();
            dispatch(setCredentials({ user: res, token: res.token }));
            navigate('/');
        } catch (err) {
            console.error('Registration failed', err);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="premium-card p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                    <p className="text-secondary text-sm">Join us for a better shopping experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {(validationError || error) && (
                        <div className="bg-error/10 text-error text-xs p-3 rounded-md border border-error/20">
                            {validationError || error?.data?.message || 'Something went wrong during registration'}
                        </div>
                    )}

                    <Button type="submit" className="w-full py-3" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border text-center text-sm text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
