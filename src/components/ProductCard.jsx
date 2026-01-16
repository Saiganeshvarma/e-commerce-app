import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
    // Generate a random discount between 10% and 50% for visual effect if not present
    const discount = product.discount || Math.floor(Math.random() * 40) + 10;
    const originalPrice = Math.floor(product.price * (1 + discount / 100));

    return (
        <Link to={`/product/${product._id}`} className="card-flat overflow-hidden group flex flex-col h-full bg-white relative">
            {/* Wishlist Icon */}
            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-300 hover:text-red-500 transition-all shadow-sm">
                <Heart size={18} />
            </button>

            {/* Product Image Wrapper */}
            <div className="aspect-ratio-box bg-white p-4">
                <img
                    src={product.images?.[0]?.includes('http') ? product.images[0] : 'https://placehold.co/400x500'}
                    alt={product.name}
                    className="transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col flex-1 gap-1.5">
                <h3 className="text-sm font-medium text-secondary group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                </h3>

                <div className="flex items-center gap-2">
                    <span className="badge-rating">
                        {product.rating || 4.2} <Star size={10} fill="currentColor" />
                    </span>
                    <span className="text-secondary-light text-xs font-bold">
                        ({product.numReviews || Math.floor(Math.random() * 5000)})
                    </span>
                    <img src="https://static-assets-web.flixcart.com/batman-returns/static/content/svg/fa_6296a8.svg" alt="assured" className="h-4 ml-auto" />
                </div>

                <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-lg font-bold">₹{product.price}</span>
                    <span className="text-secondary-light text-xs line-through">₹{originalPrice}</span>
                    <span className="badge-discount">{discount}% off</span>
                </div>

                <div className="text-[10px] text-accent font-bold mt-1">
                    Free delivery
                </div>
            </div>

            {/* Low Stock Indicator */}
            {product.stock < 5 && product.stock > 0 && (
                <div className="bg-[#ffeded] text-[#d32f2f] text-[10px] font-bold px-2 py-1 text-center">
                    Only {product.stock} left in stock!
                </div>
            )}

            {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
                    <span className="bg-slate-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm">Out of Stock</span>
                </div>
            )}
        </Link>
    );
};

export default ProductCard;
