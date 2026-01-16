import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartMutation } from '../services/cartApi';
import { Loader, Button } from '../components/Common';
import { Trash2, ShieldCheck, MapPin } from 'lucide-react';

const CartPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data: cart, isLoading } = useGetCartQuery();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [updateCart] = useUpdateCartMutation();

    if (isLoading) return <Loader size={48} />;

    const subtotal = cart?.items?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;
    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryCharge;
    const discount = Math.floor(subtotal * 0.15); // Mock discount

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in pb-20">
            {/* Left Column: Items */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white p-4 shadow-sm rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-primary" />
                        <span className="text-sm font-bold">Deliver to: <span className="font-bold">Mumbai - 400001</span></span>
                    </div>
                    <button className="text-primary font-bold text-sm border px-4 py-2 rounded-sm border-border hover:bg-slate-50">Change</button>
                </div>

                <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                    {cart?.items?.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-64" />
                            <h3 className="text-xl font-bold">Your cart is empty!</h3>
                            <p className="text-secondary-light">Add items to it now.</p>
                            <Link to="/">
                                <Button className="bg-primary text-white font-bold px-12 py-3 rounded-sm uppercase tracking-wide">Shop Now</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="p-6 border-b border-border flex flex-col md:flex-row gap-6 hover:bg-slate-50/30 transition-colors">
                                    <div className="w-32 h-32 flex flex-col items-center gap-4">
                                        <img src={item.product.images[0]?.includes('http') ? item.product.images[0] : 'https://placehold.co/200x200'} alt="" className="w-full h-full object-contain" />
                                        <div className="flex items-center border border-border rounded-sm">
                                            <button
                                                onClick={() => updateCart({ productId: item.product._id, quantity: Math.max(1, item.quantity - 1) })}
                                                className="px-3 py-1 hover:bg-slate-100 border-r border-border font-bold"
                                            >-</button>
                                            <span className="px-5 py-1 text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCart({ productId: item.product._id, quantity: item.quantity + 1 })}
                                                className="px-3 py-1 hover:bg-slate-100 border-l border-border font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <h4 className="text-lg text-secondary hover:text-primary transition-colors cursor-pointer line-clamp-1">{item.product.name}</h4>
                                        <div className="text-xs text-secondary-light flex items-center gap-2">
                                            Seller: V-Shop Retail
                                            <img src="https://static-assets-web.flixcart.com/batman-returns/static/content/svg/fa_6296a8.svg" alt="assured" className="h-3" />
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-secondary-light text-sm line-through">₹{item.product.price * 2}</span>
                                            <span className="text-xl font-bold">₹{item.product.price}</span>
                                            <span className="text-accent text-sm font-bold">50% Off</span>
                                        </div>
                                        <div className="flex gap-6 mt-4">
                                            <button className="text-sm font-bold hover:text-primary uppercase tracking-wide">Save for later</button>
                                            <button
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-sm font-bold hover:text-red-600 uppercase tracking-wide"
                                            >Remove</button>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        Delivery by tomorrow | <span className="text-accent font-bold">Free</span>
                                    </div>
                                </div>
                            ))}
                            <div className="p-5 flex justify-end sticky bottom-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                                <Button
                                    onClick={() => navigate('/checkout')}
                                    className="bg-[#fb641b] text-white font-bold px-16 py-4 rounded-sm uppercase tracking-widest text-lg"
                                >Place Order</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Summary */}
            {cart?.items?.length > 0 && (
                <div className="w-full lg:w-[400px] flex flex-col gap-4">
                    <div className="bg-white shadow-sm rounded-sm overflow-hidden sticky top-20">
                        <div className="p-4 border-b border-border">
                            <h3 className="text-secondary-light font-bold uppercase text-sm tracking-wide">Price Details</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="flex justify-between text-base">
                                <span>Price ({cart.items.length} items)</span>
                                <span>₹{subtotal + discount}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span>Discount</span>
                                <span className="text-accent">- ₹{discount}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span>Delivery Charges</span>
                                <span className={deliveryCharge === 0 ? 'text-accent font-bold' : ''}>
                                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                </span>
                            </div>
                            <div className="pt-5 border-t border-dashed border-border flex justify-between text-xl font-bold">
                                <span>Total Amount</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="pt-2">
                                <span className="text-accent font-bold text-sm">You will save ₹{discount} on this order</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-border flex items-center gap-3 text-secondary-light text-xs">
                            <ShieldCheck size={24} />
                            Safe and Secure Payments. Easy returns. 100% Authentic products.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
