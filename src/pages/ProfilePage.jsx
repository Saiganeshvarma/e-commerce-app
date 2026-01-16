import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProfileQuery, useUpdateProfileMutation } from '../services/authApi';
import { useGetMyOrdersQuery } from '../services/orderApi';
import { useGetAddressesQuery, useAddAddressMutation } from '../services/addressApi';
import { Loader, Button, Input } from '../components/Common';
import { User, Package, MapPin, Settings, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { setCredentials } from '../slices/authSlice';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('profile');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
    const { data: orders, isLoading: ordersLoading } = useGetMyOrdersQuery();
    const { data: addresses, isLoading: addressesLoading } = useGetAddressesQuery();
    const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile({ name, email, password }).unwrap();
            dispatch(setCredentials({ user: res, token: localStorage.getItem('token') }));
            alert('Profile updated successfully!');
        } catch (err) { }
    };

    if (profileLoading) return <Loader size={48} />;

    return (
        <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-4">
                <div className="premium-card p-6 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <User size={40} />
                    </div>
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    <p className="text-sm text-secondary">{profile.email}</p>
                </div>

                <div className="premium-card overflow-hidden">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center justify-between p-4 text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-3"><Settings size={18} /> Profile Settings</div>
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center justify-between p-4 text-sm font-bold transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-3"><Package size={18} /> My Orders</div>
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={() => setActiveTab('addresses')}
                        className={`w-full flex items-center justify-between p-4 text-sm font-bold transition-colors ${activeTab === 'addresses' ? 'bg-primary text-white' : 'hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-3"><MapPin size={18} /> Addresses</div>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
                {activeTab === 'profile' && (
                    <div className="premium-card p-8 space-y-8">
                        <h2 className="text-2xl font-bold">Profile Details</h2>
                        <form onSubmit={handleUpdateProfile} className="grid md:grid-cols-2 gap-6">
                            <Input label="Full Name" defaultValue={profile.name} onChange={(e) => setName(e.target.value)} />
                            <Input label="Email Address" defaultValue={profile.email} onChange={(e) => setEmail(e.target.value)} />
                            <Input label="New Password (optional)" type="password" placeholder="Leave blank to keep current" onChange={(e) => setPassword(e.target.value)} />
                            <div className="md:col-span-2 pt-4">
                                <Button type="submit" className="px-8" disabled={updatingProfile}>
                                    {updatingProfile ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Order History</h2>
                        {ordersLoading ? <Loader /> : (
                            <div className="space-y-4">
                                {orders?.length === 0 ? <p className="text-secondary">No orders yet.</p> : orders?.map((order) => (
                                    <div key={order._id} className="premium-card p-6 flex flex-wrap items-center justify-between gap-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">Order #{order._id.slice(-6).toUpperCase()}</div>
                                                <div className="text-xs text-secondary">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {order.orderStatus === 'Delivered' ? (
                                                <span className="px-3 py-1 bg-success/10 text-success text-[10px] font-bold rounded-full flex items-center gap-1">
                                                    <CheckCircle2 size={12} /> DELIVERED
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full flex items-center gap-1">
                                                    <Clock size={12} /> {order.orderStatus.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="font-extrabold text-foreground">${order.totalAmount}</div>
                                        <Button variant="outline" className="text-xs font-bold py-2">Details</Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'addresses' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Shipping Addresses</h2>
                            <Button variant="outline" className="text-sm font-bold">Add New</Button>
                        </div>
                        {addressesLoading ? <Loader /> : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {addresses?.length === 0 ? <p className="text-secondary">No addresses saved.</p> : addresses?.map((addr) => (
                                    <div key={addr._id} className={`premium-card p-6 relative ${addr.isDefault ? 'border-primary ring-1 ring-primary' : ''}`}>
                                        {addr.isDefault && (
                                            <span className="absolute top-4 right-4 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded">DEFAULT</span>
                                        )}
                                        <h4 className="font-bold mb-2 flex items-center gap-2"><MapPin size={16} /> Home</h4>
                                        <p className="text-sm text-secondary leading-relaxed">
                                            {addr.houseNo}, {addr.street}<br />
                                            {addr.city}, {addr.state} - {addr.pincode}<br />
                                            {addr.country}
                                        </p>
                                        <div className="mt-4 flex gap-3 text-xs font-bold text-primary">
                                            <button className="hover:underline">Edit</button>
                                            <button className="hover:underline text-error">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
