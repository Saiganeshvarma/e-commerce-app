import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-4">
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <footer className="bg-[#212121] text-white py-12 mt-auto">
                <div className="container grid grid-cols-2 md:grid-cols-6 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <h4 className="text-secondary-light font-bold text-[10px] uppercase mb-4 tracking-widest">About</h4>
                        <ul className="text-white text-xs space-y-2">
                            <li><Link to="#" className="hover:underline">Contact Us</Link></li>
                            <li><Link to="#" className="hover:underline">About Us</Link></li>
                            <li><Link to="#" className="hover:underline">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-secondary-light font-bold text-[10px] uppercase mb-4 tracking-widest">Help</h4>
                        <ul className="text-white text-xs space-y-2">
                            <li><Link to="#" className="hover:underline">Payments</Link></li>
                            <li><Link to="#" className="hover:underline">Shipping</Link></li>
                            <li><Link to="#" className="hover:underline">Cancellation</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-secondary-light font-bold text-[10px] uppercase mb-4 tracking-widest">Consumer Policy</h4>
                        <ul className="text-white text-xs space-y-2">
                            <li><Link to="#" className="hover:underline">Return Policy</Link></li>
                            <li><Link to="#" className="hover:underline">Terms of Use</Link></li>
                            <li><Link to="#" className="hover:underline">Security</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-2 md:border-l border-slate-700 md:pl-8">
                        <h4 className="text-secondary-light font-bold text-[10px] uppercase mb-4 tracking-widest">Mail Us:</h4>
                        <p className="text-white text-xs leading-relaxed">
                            V-Shop Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &<br />
                            Clove Embassy Tech Village,<br />
                            Bengaluru, 560103, Karnataka, India
                        </p>
                    </div>
                    <div>
                        <h4 className="text-secondary-light font-bold text-[10px] uppercase mb-4 tracking-widest">Connect</h4>
                        <div className="flex gap-4 mt-2">
                            <span className="w-6 h-6 bg-slate-700 rounded-full"></span>
                            <span className="w-6 h-6 bg-slate-700 rounded-full"></span>
                            <span className="w-6 h-6 bg-slate-700 rounded-full"></span>
                        </div>
                    </div>
                </div>
                <div className="container border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
                    <div className="flex gap-6">
                        <span>Become a Seller</span>
                        <span>Advertise</span>
                        <span>Gift Cards</span>
                        <span>Help Center</span>
                    </div>
                    <span>© {new Date().getFullYear()} Flipkart. All rights reserved.</span>
                    <div className="h-6">
                        <img src="https://static-assets-web.flixcart.com/batman-returns/static/content/svg/payment-method-c4544e.svg" alt="Payments" className="h-full" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
