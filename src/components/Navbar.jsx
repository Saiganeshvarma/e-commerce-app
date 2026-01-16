import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Search, LogOut, Menu, ChevronDown } from 'lucide-react';
import { logout } from '../slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const [search, setSearch] = useState('');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?keyword=${search}`);
        }
    };

    return (
        <nav className="sticky-nav">
            <div className="container flex items-center gap-8 w-full">
                {/* Logo */}
                <Link to="/" className="flex flex-col items-center">
                    <span className="text-xl font-bold italic -mb-1">Flipkart</span>
                    <span className="text-[10px] italic font-medium flex items-center gap-0.5">
                        Explore <span className="text-[#ffe500] font-bold">Plus</span>
                        <img src="https://static-assets-web.flixcart.com/batman-returns/static/content/svg/plus-brand-bc130b.svg" alt="" className="w-2" />
                    </span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-[600px] relative">
                    <input
                        type="text"
                        placeholder="Search for products, brands and more"
                        className="w-full py-2 px-4 pr-12 rounded-sm text-secondary focus:outline-none shadow-sm text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="absolute right-0 top-0 h-full px-4 text-primary">
                        <Search size={20} />
                    </button>
                </form>

                {/* Actions */}
                <div className="flex items-center gap-8">
                    {user ? (
                        <div className="relative group cursor-pointer flex items-center gap-1 font-bold">
                            <User size={20} />
                            <span>{user.name.split(' ')[0]}</span>
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />

                            <div className="absolute top-full right-0 mt-2 w-48 bg-white text-secondary shadow-lg rounded-sm hidden group-hover:block border border-border overflow-hidden">
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-border">
                                    <User size={16} /> My Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-error">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-white text-primary font-bold px-8 py-1.5 rounded-sm hover:bg-opacity-90">
                            Login
                        </Link>
                    )}

                    <Link to="/cart" className="flex items-center gap-2 font-bold relative">
                        <div className="relative">
                            <ShoppingCart size={20} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border-2 border-primary">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
                        <span className="hidden md:block">Cart</span>
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="font-bold hidden lg:block">Seller</Link>
                    )}

                    <button className="md:hidden">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
