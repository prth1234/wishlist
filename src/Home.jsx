import React, { useState, useEffect } from 'react';
import products from "./products.jsx";
import { Check } from 'lucide-react';
import './Home.css';

const ProductPage = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({ categories: [], priceRanges: [] });
    const [loading, setLoading] = useState(true);
    const [savedProducts, setSavedProducts] = useState([]);
    const [showingSaved, setShowingSaved] = useState(false);
    const [notification, setNotification] = useState(null);

    const categories = ['Smartphones', 'Laptops', 'Headphones', 'TVs', 'Wearables'];
    const priceRanges = [
        { label: 'Under 1K', min: 0, max: 1000 },
        { label: 'Under 5k', min: 1001, max: 5000 },
        { label: 'Under 10k', min: 5001, max: 10000 },
        { label: 'Under 20k', min: 10001, max: 20000 },
        { label: 'More than 20k', min: 20001, max: Infinity },
    ];

    useEffect(() => {
        const savedProductsFromStorage = JSON.parse(localStorage.getItem('savedProducts') || '[]');
        setSavedProducts(savedProductsFromStorage);
        const showingSavedFromStorage = JSON.parse(localStorage.getItem('showingSaved') || 'false');
        setShowingSaved(showingSavedFromStorage);
    }, []);

    useEffect(() => {
        setLoading(true);
        let result = products;
        if (selectedFilters.categories.length > 0) {
            result = result.filter(product => selectedFilters.categories.includes(product.category));
        }
        if (selectedFilters.priceRanges.length > 0) {
            result = result.filter(product => {
                const price = parseFloat(product.price.replace('Rs ', '').replace(',', ''));
                return selectedFilters.priceRanges.some(range => price >= range.min && price <= range.max);
            });
        }
        setTimeout(() => {
            setFilteredProducts(result);
            setDisplayedProducts(showingSaved ? savedProducts : result.slice(0, 9));
            setLoading(false);
        }, 1000);
    }, [selectedFilters, showingSaved, savedProducts]);

    const toggleFilter = (type, value) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            const index = newFilters[type].findIndex(item =>
                type === 'priceRanges' ? item.label === value.label : item === value
            );
            if (index > -1) {
                newFilters[type] = newFilters[type].filter((_, i) => i !== index);
            } else {
                newFilters[type] = [...newFilters[type], value];
            }
            return newFilters;
        });
    };

    const loadMore = () => {
        const currentLength = displayedProducts.length;
        const nextBatch = filteredProducts.slice(currentLength, currentLength + 9);
        setDisplayedProducts([...displayedProducts, ...nextBatch]);
    };

    const toggleSaveProduct = (product) => {
        setSavedProducts(prev => {
            let newSavedProducts;
            if (isProductSaved(product)) {
                newSavedProducts = prev.filter(p => p.name !== product.name);
                if (showingSaved) {
                    setDisplayedProducts(prevDisplayed => prevDisplayed.filter(p => p.name !== product.name));
                }
                showNotification(`${product.name} removed from saved items`);
            } else {
                newSavedProducts = [...prev, product];
                showNotification(`${product.name} saved`);
            }
            localStorage.setItem('savedProducts', JSON.stringify(newSavedProducts));
            return newSavedProducts;
        });
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleSavedProducts = () => {
        const newShowingSaved = !showingSaved;
        setShowingSaved(newShowingSaved);
        localStorage.setItem('showingSaved', JSON.stringify(newShowingSaved));
        if (newShowingSaved) {
            setDisplayedProducts(savedProducts);
        } else {
            setDisplayedProducts(filteredProducts.slice(0, 9));
        }
    };

    const isProductSaved = (product) => {
        return savedProducts.some(p => p.name === product.name);
    };

    return (
        <div className={`product-page ${sidebarVisible ? 'sidebar-open' : ''}`}>
            {notification && (
                <div className="notification">
                    <Check size={18} color="white"/>
                    <span>{notification}</span>
                </div>
            )}
            <div className="page-header">
                <button onClick={() => setSidebarVisible(!sidebarVisible)} className="menu-button">
                    ☰
                </button>
                <h1>Prabhav's Wishlist</h1>
                <div className="toggle-container">
                    <span className="toggle-label left">All</span>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="saved-products-toggle"
                            checked={showingSaved}
                            onChange={toggleSavedProducts}
                        />
                        <label htmlFor="saved-products-toggle"></label>
                    </div>
                    <span className="toggle-label right">Saved</span>
                </div>
            </div>

            <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <button onClick={() => setSidebarVisible(false)} className="close-button">×</button>
                <h2 style={{marginBottom: '10px', fontSize: '30px'}}>Filters</h2>
                <div className="filter-section">
                    <h3 style={{fontSize: '15px'}}>Categories</h3>
                    <div className="filter-tags">
                        {categories.map(category => (
                            <span
                                key={category}
                                className={`filter-tag ${selectedFilters.categories.includes(category) ? 'selected' : ''}`}
                                onClick={() => toggleFilter('categories', category)}
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="filter-section">
                    <h3 style={{fontSize: '15px'}}>Price Ranges</h3>
                    <div className="filter-tags">
                        {priceRanges.map(range => (
                            <span
                                key={range.label}
                                className={`filter-tag ${selectedFilters.priceRanges.some(r => r.label === range.label) ? 'selected' : ''}`}
                                onClick={() => toggleFilter('priceRanges', range)}
                            >
                                {range.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="main-content">
                {loading ? (
                    <div className="loader-container">
                        <div className="loader">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                ) : displayedProducts.length > 0 ? (
                    <>
                        <div className="product-grid">
                            {displayedProducts.map((product, index) => (
                                <div key={index} className="card-container">
                                    <div className="card">
                                        <div className="image">
                                            <img src={product.image} alt={product.name}/>
                                        </div>
                                        <span className="title">{product.name}</span>
                                        <span className="price">{product.price}</span>
                                        {isProductSaved(product) && (
                                            <div className="saved-indicator">
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="save-banner"
                                        onClick={() => toggleSaveProduct(product)}
                                    >
                                        {isProductSaved(product) ? 'Unsave' : 'Save'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-products">No products Found.</div>
                )}
            </div>
            <div className="page-footer">
                <span>© 2024 Pxrthye. All rights reserved.</span>
            </div>
        </div>
    );
};

export default ProductPage;