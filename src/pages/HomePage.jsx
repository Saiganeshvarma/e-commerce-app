import React from 'react';
import { useGetProductsQuery } from '../services/productApi';
import { useGetCategoriesQuery } from '../services/categoryApi';
import ProductCard from '../components/ProductCard';
import { Loader } from '../components/Common';
import { ChevronRight } from 'lucide-react';

const HomePage = () => {
    const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({});
    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

    return (
        <div className="flex flex-col gap-4 pb-10">
            {/* Banner Section */}
            <section className="bg-white p-2 shadow-sm rounded-sm overflow-hidden">
                <div className="relative h-[250px] md:h-[350px]">
                    <img
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero Banner"
                        className="w-full h-full object-cover rounded-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            </section>

            {/* Categories Strip */}
            <section className="bg-white py-4 shadow-sm rounded-sm">
                <div className="container overflow-x-auto no-scrollbar">
                    <div className="flex justify-between min-w-[800px] px-4">
                        {categoriesLoading ? <Loader /> : categories?.map((category) => (
                            <div key={category._id} className="flex flex-col items-center gap-1 cursor-pointer group">
                                <div className="w-16 h-16 rounded-full overflow-hidden transition-transform group-hover:scale-105">
                                    <img src={category.image || `https://placehold.co/100x100?text=${category.name}`} alt={category.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-bold text-secondary group-hover:text-primary">{category.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Deals Section (Carousel style) */}
            <section className="bg-white shadow-sm rounded-sm">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Best Deals on Premium Tech</h2>
                    <button className="bg-primary text-white p-2 rounded-full hover:bg-primary-hover shadow-md">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="p-4 overflow-x-auto no-scrollbar">
                    <div className="flex gap-4 min-w-max pb-4">
                        {productsLoading ? <Loader /> : productsData?.products?.slice(0, 8).map((product) => (
                            <div key={product._id} className="w-[200px] border border-transparent hover:border-border transition-all">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Secondary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <img src="https://images.unsplash.com/photo-1546868881-d8ec61dc1952?q=80&w=1000&auto=format&fit=crop" className="h-[200px] w-full object-cover rounded-sm shadow-sm" alt="Ad 1" />
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" className="h-[200px] w-full object-cover rounded-sm shadow-sm" alt="Ad 2" />
                <img src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=1000&auto=format&fit=crop" className="h-[200px] w-full object-cover rounded-sm shadow-sm" alt="Ad 3" />
            </div>

            {/* Suggested for You Grid */}
            <section className="bg-white shadow-sm rounded-sm p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Suggested for You</h2>
                    <button className="text-primary font-bold text-sm hover:underline">VIEW ALL</button>
                </div>
                {productsLoading ? <Loader /> : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {productsData?.products?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
