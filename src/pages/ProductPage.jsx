import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductDetailsQuery } from '../services/productApi';
import { useAddToCartMutation } from '../services/cartApi';
import { Loader, Button } from '../components/Common';
import { ShoppingCart, Star, Zap, Shield, Heart, Share2, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [activeImg, setActiveImg] = useState(0);

    const { data: product, isLoading, error } = useGetProductDetailsQuery(id);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await addToCart({ productId: id, quantity: 1 }).unwrap();
            navigate('/cart');
        } catch (err) {
            console.error('Failed to add to cart', err);
        }
    };

    if (isLoading) return <Loader size={48} />;
    if (error) return <div className="text-center py-20 text-error font-bold">Product not found</div>;

    const discount = 35; // Mock discount
    const originalPrice = Math.floor(product.price * 1.54);

    return (
        <div className="bg-white p-4 md:p-8 flex flex-col md:flex-row gap-10 shadow-sm rounded-sm animate-fade-in mb-10">
            {/* Left: Images & Primary Actions */}
            <div className="md:w-[400px] flex flex-col gap-4">
                <div className="relative border border-border p-4 rounded-sm group overflow-hidden bg-white h-[450px]">
                    <img
                        src={product.images[activeImg]?.includes('http') ? product.images[activeImg] : 'https://placehold.co/800x1000'}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <button className="absolute top-4 right-4 p-2.5 rounded-full border border-border bg-white shadow-sm hover:text-red-500 transition-colors">
                        <Heart size={20} />
                    </button>
                    <button className="absolute top-16 right-4 p-2.5 rounded-full border border-border bg-white shadow-sm hover:text-primary transition-colors">
                        <Share2 size={18} />
                    </button>
                    <div className="absolute top-4 left-4">
                        <img src="https://static-assets-web.flixcart.com/batman-returns/static/content/svg/fa_6296a8.svg" alt="assured" className="h-5" />
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setActiveImg(i)}
                            className={`w-16 h-16 border rounded-sm p-1 cursor-pointer transition-all ${activeImg === i ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}
                        >
                            <img src={img.includes('http') ? img : 'https://placehold.co/100x100'} alt="" className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button
                        className="p-4 bg-[#ff9f00] hover:bg-[#f39700] text-white font-bold uppercase tracking-wider rounded-sm shadow-sm"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAdding}
                    >
                        <ShoppingCart size={18} className="mr-2" /> ADD TO CART
                    </Button>
                    <Button
                        className="p-4 bg-[#fb641b] hover:bg-[#f4511e] text-white font-bold uppercase tracking-wider rounded-sm shadow-sm"
                        onClick={() => navigate('/cart')}
                        disabled={product.stock === 0}
                    >
                        <Zap size={18} className="mr-2" /> BUY NOW
                    </Button>
                </div>
            </div>

            {/* Right: Product Content */}
            <div className="flex-1 flex flex-col gap-6">
                <div>
                    <div className="text-secondary-light text-sm mb-1">
                        Home &gt; {product.category?.name || 'Electronics'} &gt; {product.name}
                    </div>
                    <h1 className="text-2xl font-medium text-secondary mb-2">{product.name}</h1>
                    <div className="flex items-center gap-3">
                        <div className="badge-rating px-2 py-0.5 rounded-sm">
                            {product.rating || 4.2} <Star size={12} fill="currentColor" />
                        </div>
                        <span className="text-secondary-light text-sm font-bold">
                            {product.numReviews || 842} Ratings & 156 Reviews
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-accent text-sm font-bold">Extra ₹{Math.floor(product.price * 0.1)} off</span>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold">₹{product.price}</span>
                        <span className="text-secondary-light text-lg line-through">₹{originalPrice}</span>
                        <span className="text-accent text-lg font-bold">{discount}% off</span>
                    </div>
                </div>

                {/* Available Offers */}
                <div className="space-y-3">
                    <h4 className="font-bold text-sm">Available offers</h4>
                    {[
                        "Bank Offer 10% instant discount on Cards up to ₹1000",
                        "Special Price Get extra 10% off (price inclusive of cash back/coupon)",
                        "Partner Offer Sign up for Pay Later and get ₹500 Gift Card",
                        "No Cost EMI on Bank Credit Cards"
                    ].map((offer, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-secondary">
                            <img src="https://static-assets-web.flixcart.com/batman-returns/static/content/svg/offer-5f3333.svg" className="w-4 mt-1" alt="" />
                            <span className="font-bold mr-1">{offer.split(' ')[0]} {offer.split(' ')[1]}</span>
                            {offer.split(' ').slice(2).join(' ')}
                        </div>
                    ))}
                </div>

                {/* Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-border">
                    <div className="flex items-start gap-4">
                        <MapPin className="text-secondary-light mt-1" size={20} />
                        <div className="text-sm">
                            <div className="text-secondary-light font-bold mb-1">Deliver to</div>
                            <div className="font-bold">Mumbai - 400001</div>
                            <div className="text-accent font-bold mt-1">Delivery by Tomorrow, Sat</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Shield className="text-secondary-light mt-1" size={20} />
                        <div className="text-sm">
                            <div className="text-secondary-light font-bold mb-1">Warranty</div>
                            <div className="font-bold">1 Year Manufacturer Warranty</div>
                            <div className="text-primary font-bold mt-1 hover:underline cursor-pointer">Know More</div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <h4 className="font-bold text-secondary">Product Description</h4>
                    <p className="text-sm text-secondary leading-relaxed">
                        {product.description || "Designed for performance and elegance. This premium masterpiece brings together top-tier hardware and software to deliver an unparalleled user experience. Whether you're working, creating, or relaxing, it's the perfect companion for your digital lifestyle."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
