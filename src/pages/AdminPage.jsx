import React, { useState } from 'react';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../services/productApi';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../services/categoryApi';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../services/orderApi';
import { Loader, Button, Input } from '../components/Common';
import { LayoutDashboard, Package, ListTree, ShoppingBag, Plus, Trash2, Edit, Upload, X, Check, TrendingUp } from 'lucide-react';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Queries
    const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({});
    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
    const { data: orders, isLoading: ordersLoading } = useGetAllOrdersQuery();

    // Mutations
    const [createProduct, { isLoading: creatingProduct }] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [createCategory, { isLoading: creatingCategory }] = useCreateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    // Forms State
    const [showProductModal, setShowProductModal] = useState(false);
    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
    const [productImages, setProductImages] = useState([]);

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(productForm).forEach(key => formData.append(key, productForm[key]));
        productImages.forEach(img => formData.append('images', img));

        try {
            await createProduct(formData).unwrap();
            setShowProductModal(false);
            setProductForm({ name: '', description: '', price: '', category: '', stock: '' });
            setProductImages([]);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in pb-20">
            {/* Admin Sidebar */}
            <div className="lg:w-[280px] flex flex-col gap-2">
                <div className="bg-white p-6 shadow-sm rounded-sm mb-2 border-b-4 border-primary">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <LayoutDashboard size={24} /> Seller Hub
                    </h3>
                    <p className="text-[10px] text-secondary-light font-bold uppercase tracking-widest mt-1">Store Management</p>
                </div>

                <div className="bg-white shadow-sm rounded-sm overflow-hidden py-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'products', label: 'Inventory', icon: Package },
                        { id: 'categories', label: 'Collections', icon: ListTree },
                        { id: 'orders', label: 'Shipments', icon: ShoppingBag },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold transition-all border-l-4 ${activeTab === tab.id ? 'bg-blue-50 text-primary border-primary' : 'text-secondary-light border-transparent hover:bg-slate-50'}`}
                        >
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Admin Main Content */}
            <div className="flex-1 space-y-6">
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Active Items', val: productsData?.products?.length || 0, color: 'text-primary' },
                                { label: 'New Shipments', val: orders?.length || 0, color: 'text-accent' },
                                { label: 'Revenue (INR)', val: `₹${orders?.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(0)}`, color: 'text-secondary' },
                                { label: 'Categories', val: categories?.length || 0, color: 'text-[#ff9f00]' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 shadow-sm border border-border rounded-sm relative group overflow-hidden">
                                    <div className="absolute right-0 bottom-0 text-slate-50 rotate-12 -mr-4 -mb-4 opacity-10 group-hover:opacity-20 transition-all">
                                        <TrendingUp size={100} />
                                    </div>
                                    <div className="text-[10px] font-bold text-secondary-light uppercase tracking-widest mb-1">{stat.label}</div>
                                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.val}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h4 className="text-lg font-bold">Recent Fulfillment Logs</h4>
                                <button className="text-primary font-bold text-xs hover:underline">VIEW FULL REPORT</button>
                            </div>
                            <div className="divide-y divide-border">
                                {orders?.slice(0, 5).map(o => (
                                    <div key={o._id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 text-primary rounded-sm flex items-center justify-center"><ShoppingBag size={24} /></div>
                                            <div>
                                                <div className="font-bold text-sm text-secondary">#ODR-{o._id.slice(-8).toUpperCase()}</div>
                                                <div className="text-xs text-secondary-light">Customer: {o.user?.name} | {new Date(o.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-base font-bold text-secondary">₹{o.totalAmount}</div>
                                            <div className="text-[10px] font-bold text-[#388e3c] uppercase bg-green-50 px-2 py-0.5 rounded-sm">Shipped</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-6 shadow-sm rounded-sm">
                            <div>
                                <h1 className="text-2xl font-bold">Global Inventory</h1>
                                <p className="text-xs text-secondary-light mt-1 uppercase tracking-widest font-bold">Manage your product listings securely</p>
                            </div>
                            <Button onClick={() => setShowProductModal(true)} className="bg-primary text-white px-8 py-3 rounded-sm font-bold shadow-md hover:bg-primary-hover">
                                <Plus size={18} className="mr-2" /> ADD PRODUCT
                            </Button>
                        </div>

                        {productsLoading ? <Loader /> : (
                            <div className="bg-white shadow-sm rounded-sm overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-light">Item Detail</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-light">Pricing</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-light">Stock Status</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-light">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {productsData?.products?.map((p) => (
                                            <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-4">
                                                    <img src={p.images?.[0]?.includes('http') ? p.images[0] : 'https://placehold.co/100x100'} alt="" className="w-12 h-14 object-contain" />
                                                    <span className="font-bold text-sm line-clamp-1">{p.name}</span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-secondary text-sm">₹{p.price}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] px-2 py-1 rounded-sm font-bold uppercase ${p.stock > 10 ? 'bg-green-50 text-[#388e3c]' : 'bg-red-50 text-red-600'}`}>
                                                            {p.stock} In Stock
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button className="p-2 text-primary hover:bg-blue-50 rounded-sm border border-border"><Edit size={16} /></button>
                                                        <button onClick={() => deleteProduct(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-sm border border-border"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Admin Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-2xl p-8 rounded-sm shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-secondary uppercase tracking-wide">Publish New Listing</h3>
                            <button onClick={() => setShowProductModal(false)} className="text-secondary-light hover:text-red-500"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2"><Input label="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required /></div>
                                <Input label="Listing Price (INR)" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                                <Input label="Inventory Count" type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required />
                                <div className="col-span-2"><Input label="Description Details" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required /></div>
                                <div className="col-span-2 flex flex-col gap-2">
                                    <label className="text-xs font-bold text-secondary-light uppercase">Product Category</label>
                                    <select
                                        className="p-3 border border-border rounded-sm bg-white outline-none focus:border-primary text-sm"
                                        value={productForm.category}
                                        onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose a category...</option>
                                        {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="p-10 border-2 border-dashed border-border rounded-sm text-center bg-slate-50 relative group cursor-pointer">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setProductImages([...e.target.files])} />
                                <Upload className="mx-auto text-slate-300 mb-2 group-hover:text-primary transition-all" size={48} />
                                <div className="text-xs font-bold text-secondary-light">
                                    {productImages.length > 0 ? `${productImages.length} Images Attached` : 'Click to upload product imagery'}
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-sm uppercase tracking-widest hover:bg-primary-hover shadow-md transition-all">
                                {creatingProduct ? 'Synchronizing...' : 'Finalize Listing'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
