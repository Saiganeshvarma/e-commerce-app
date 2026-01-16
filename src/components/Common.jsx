import React from 'react';
import { ShoppingCart, User, Search, LogOut, Menu, Trash2, Plus, Minus, X } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'border border-border hover:bg-slate-50',
        danger: 'bg-error text-white hover:bg-red-600',
        ghost: 'hover:bg-slate-50',
    };
    return (
        <button className={`btn ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Input = ({ label, error, className = '', ...props }) => (
    <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-secondary">{label}</label>}
        <input
            className={`input-premium ${className}`}
            {...props}
        />
        {error && <span className="text-xs text-error">{error}</span>}
    </div>
);

const Loader = ({ size = 24 }) => (
    <div className="flex justify-center items-center py-10">
        <div
            className="animate-spin rounded-full border-t-2 border-primary"
            style={{ width: size, height: size }}
        />
    </div>
);

export { Button, Input, Loader };
