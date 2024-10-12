import React, { useState, useEffect } from 'react';
import products from "./products.jsx";
import './Home.css';

const ProductPage = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({ categories: [], priceRanges: [] });
    const [loading, setLoading] = useState(true);

    const categories = ['Smartphones', 'Laptops', 'Headphones', 'TVs', 'Wearables'];
    const priceRanges = [
        { label: 'Rs 100-300', min: 100, max: 300 },
        { label: 'Rs 300-1000', min: 300, max: 1000 },
        { label: 'Rs 1000-2000', min: 1000, max: 2000 },
        { label: 'Rs 2000-5000', min: 2000, max: 5000 },
        { label: 'Rs 5000-10000', min: 5000, max: 10000 },
        { label: 'Rs 10000-30000', min: 10000, max: 30000 },
        { label: 'Rs 30000-1000000', min: 30000, max: 1000000 },
    ];

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
            setDisplayedProducts(result.slice(0, 9));
            setLoading(false);
        }, 1000);
    }, [selectedFilters]);

    const toggleFilter = (type, value) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            const index = newFilters[type].indexOf(value);
            if (index > -1) {
                newFilters[type] = newFilters[type].filter(item => item !== value);
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

    return (
        <div className="product-page">
            <div className="page-header">
                <button onClick={() => setSidebarVisible(!sidebarVisible)} className="menu-button">
                    ☰
                </button>
                <h1>Prabhav's Wishlist</h1>
            </div>

            <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <button onClick={() => setSidebarVisible(false)} className="close-button">×</button>
                <h2>Filters</h2>
                <div className="filter-section">
                    <h3>Categories</h3>
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
                    <h3>Price Ranges</h3>
                    <div className="filter-tags">
                        {priceRanges.map(range => (
                            <span
                                key={range.label}
                                className={`filter-tag ${selectedFilters.priceRanges.includes(range) ? 'selected' : ''}`}
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
                    <div className="loader">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                ) : (
                    <>
                        <div className="product-grid">
                            {displayedProducts.map((product, index) => (
                                <div key={index} className="card">
                                    <div className="image">
                                        <span className="text">{product.name}</span>
                                    </div>
                                    <span className="title">{product.category}</span>
                                    <span className="price">{product.price}</span>
                                </div>
                            ))}
                        </div>
                        {filteredProducts.length > displayedProducts.length && (
                            <button onClick={loadMore} className="load-more-button">Load More</button>
                        )}
                    </>
                )}
            </div>

            <div className="page-footer">
                <span>© 2024 TechStore. All rights reserved.</span>
                <div className="social-icons">
                    <button className="social-button">F</button>
                    <button className="social-button">T</button>
                    <button className="social-button">I</button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;