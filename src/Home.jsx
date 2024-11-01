import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import products from "./products.jsx";
import './Home.css';
import { IoIosLogOut } from "react-icons/io";
import { LogOut } from 'lucide-react';
import { Check, User, X, AlertTriangle } from 'lucide-react';

const ProductPage = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState(() => {
        const savedFilters = localStorage.getItem('selectedFilters');
        return savedFilters ? JSON.parse(savedFilters) : { categories: [], priceRanges: [] };
    });
    const [loading, setLoading] = useState(true);
    const [viewTransitionLoading, setViewTransitionLoading] = useState(false);
    const [savedProducts, setSavedProducts] = useState([]);
    const [showingSaved, setShowingSaved] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showBudgetPopup, setShowBudgetPopup] = useState(false);
    const [budget, setBudget] = useState(20000);
    const [isPopupLoading, setIsPopupLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    const SkeletonCard = () => (
        <div className="card-container">
            <div className="card skeleton">
                <div className="image skeleton-image pulse"></div>
                <div className="skeleton-content">
                    <div className="skeleton-title pulse"></div>
                    <div className="skeleton-price pulse"></div>
                </div>
            </div>
        </div>
    );

    const categories = ['Smartphones', 'Laptops', 'Headphones', 'TVs', 'Wearables'];
    const priceRanges = [
        { label: 'Under 1K', min: 0, max: 1000 },
        { label: '1k-5k', min: 1001, max: 5000 },
        { label: '5k-10k', min: 5001, max: 10000 },
        { label: 'U10k-20k', min: 10001, max: 20000 },
        { label: 'More than 20k', min: 20001, max: Infinity },
    ];

    useEffect(() => {
        const savedProductsFromStorage = JSON.parse(localStorage.getItem('savedProducts') || '[]');
        setSavedProducts(savedProductsFromStorage);
        const showingSavedFromStorage = JSON.parse(localStorage.getItem('showingSaved') || 'false');
        setShowingSaved(showingSavedFromStorage);

        const hasSeenBudgetPopup = localStorage.getItem('hasSeenBudgetPopup');
        if (!hasSeenBudgetPopup) {
            setTimeout(() => {
                setShowBudgetPopup(true);
                setIsPopupLoading(false);
            }, 2000);
        }

        applyFilters(products, showingSavedFromStorage, savedProductsFromStorage);
        
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
        if (!loading) {
            setLoading(true);
            setTimeout(() => {
                applyFilters(products, showingSaved, savedProducts);
                setLoading(false);
            }, 1000);
        }
    }, [selectedFilters]);

    const applyFilters = (sourceProducts, isShowingSaved, currentSavedProducts) => {
        let result = sourceProducts;
        if (selectedFilters.categories.length > 0) {
            result = result.filter(product => selectedFilters.categories.includes(product.category));
        }
        if (selectedFilters.priceRanges.length > 0) {
            result = result.filter(product => {
                const price = parseFloat(product.price.replace('Rs ', '').replace(',', ''));
                return selectedFilters.priceRanges.some(range => price >= range.min && price <= range.max);
            });
        }
        setFilteredProducts(result);
        setDisplayedProducts(isShowingSaved ? currentSavedProducts : result.slice(0, 9));
    };

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

    const ImageWithFallback = ({ src, alt, className }) => {
        const [hasError, setHasError] = useState(false);
    
        return (
            <div className={`image-container ${hasError ? 'image-error' : ''}`}>
                {hasError ? (
                    <div className="error-container">
                        <div className="glassmorphism-error">
                            <AlertTriangle className="error-icon" size={32} color="#FFD700" />
                        </div>
                    </div>
                ) : (
                    <img
                        src={src}
                        alt={alt}
                        className={className}
                        onError={() => setHasError(true)}
                    />
                )}
            </div>
        );
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
        setViewTransitionLoading(true);
        const newShowingSaved = !showingSaved;
        setShowingSaved(newShowingSaved);
        localStorage.setItem('showingSaved', JSON.stringify(newShowingSaved));
        
        // Simulate loading delay for smooth transition
        setTimeout(() => {
            if (newShowingSaved) {
                setDisplayedProducts(savedProducts);
            } else {
                setDisplayedProducts(filteredProducts.slice(0, 9));
            }
            setViewTransitionLoading(false);
        }, 500);
    };
    const ProductCard = ({ product }) => (
        <div className="card-container">
            <div className="card">
                <div className="image">
                    <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                    />
                    <label className="container">
                        <input
                            type="checkbox"
                            checked={isProductSaved(product)}
                            onChange={() => toggleSaveProduct(product)}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="black"
                            viewBox="0 0 75 100"
                            className="pin"
                        >
                            <line
                                strokeWidth="12"
                                stroke="black"
                                y2="100"
                                x2="37"
                                y1="64"
                                x1="37"
                            ></line>
                            <path
                                strokeWidth="7"
                                stroke="black"
                                d="M16.5 36V4.5H58.5V36V53.75V54.9752L59.1862 55.9903L66.9674 67.5H8.03256L15.8138 55.9903L16.5 54.9752V53.75V36Z"
                            ></path>
                        </svg>
                    </label>
                </div>
                <span className="title" style={{fontFamily:'Arial'}}>{product.name}</span>
                <span className="price" style={{fontFamily:'Arial', fontSize:'12px'}}>Rs. {product.price}</span>
            </div>
        </div>
    );



    const isProductSaved = (product) => {
        return savedProducts.some(p => p.name === product.name);
    };

    const handleBudgetChange = (e) => {
        setBudget(e.target.value);
    };

    const applyBudget = () => {
        const selectedRange = priceRanges.find(range => budget <= range.max);
        if (selectedRange) {
            setSelectedFilters(prev => ({
                ...prev,
                priceRanges: [selectedRange]
            }));
        }
        closeBudgetPopup();
    };

    const closeBudgetPopup = () => {
        setShowBudgetPopup(false);
        localStorage.setItem('hasSeenBudgetPopup', 'true');
    };

    return (
        <div className={`product-page ${sidebarVisible ? 'sidebar-open' : ''}`}>
         {notification && (
                <div className="notification">
                    <Check size={18} color="white" />
                    <span>{notification}</span>
                </div>
            )}
            
            {showBudgetPopup && (
                <div className={`budget-popup ${showBudgetPopup ? 'show' : ''}`}>
                    <button className={`close-popup ${isPopupLoading ? 'skeleton' : ''}`} onClick={closeBudgetPopup}>
                        {!isPopupLoading && <X size={24} />}
                    </button>
                    {isPopupLoading ? (
                        <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-slider"></div>
                            <div className="skeleton-slider"></div>
                            <div className="skeleton-slider"></div>
                            <div className="skeleton-slider"></div>
                        </div>
                    ) : (
                        <>
                            <h2>Choose Your Budget</h2>
                            <input
                                type="range"
                                min="0"
                                max="20000"
                                value={budget}
                                onChange={handleBudgetChange}
                            />
                            <p style={{marginBottom:'10px', fontSize:'12px'}}>Budget: Rs {budget}</p>
                            <div className="budget-tags">
                                {priceRanges.map(range => (
                                    <span
                                        key={range.label}
                                        className="budget-tag"
                                        onClick={() => setBudget(range.max)}
                                    >
                                        {range.label}
                                    </span>
                                ))}
                            </div>
                            <div className="popup-buttons">
                                <button onClick={applyBudget}>Apply</button>
                                <button onClick={closeBudgetPopup}>Browse All</button>
                            </div>
                        </>
                    )}
                </div>
            )}
      <div className="page-header">                 
    <button onClick={() => setSidebarVisible(!sidebarVisible)} className="menu-button">                     
        ☰                 
    </button>                 
    <img src="https://i.ibb.co/JzqDbzH/logo.png" alt="Wishlist Logo" style={{height: '35px'}} />                  
    <div className="mydict">                     
        <div>                         
            <label>                             
                <input                                 
                    type="radio"                                 
                    name="view-toggle"                                 
                    checked={!showingSaved}                                 
                    onChange={toggleSavedProducts}                             
                />                             
                <span>All</span>                         
            </label>                         
            <label>                             
                <input                                 
                    type="radio"                                 
                    name="view-toggle"                                 
                    checked={showingSaved}                                 
                    onChange={toggleSavedProducts}                             
                />                             
                <span>Saved</span>                         
            </label>                     
        </div>                 
    </div>             
</div>
            <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <button onClick={() => setSidebarVisible(false)} className="close-button">×</button>
                <h2 style={{ marginBottom: '10px', fontSize: '30px' }}>Filters</h2>
                <div className="filter-section">
                    <h3 style={{ fontSize: '15px' }}>Categories</h3>
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
                    <h3 style={{ fontSize: '15px' }}>Price Ranges</h3>
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
                    <div className="product-grid">
                        {[...Array(9)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : displayedProducts.length > 0 ? (
                    <>
                        <div className="product-grid">
                            {displayedProducts.map((product, index) => (
                                <div key={index} className="card-container">
                                    <div className="card">
                                        <div className="image">
                                            <ImageWithFallback
                                                src={product.image}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                            <label className="container">
                                                <input
                                                    type="checkbox"
                                                    checked={isProductSaved(product)}
                                                    onChange={() => toggleSaveProduct(product)}
                                                />
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="black"
                                                    viewBox="0 0 75 100"
                                                    className="pin"
                                                >
                                                    <line
                                                        strokeWidth="12"
                                                        stroke="black"
                                                        y2="100"
                                                        x2="37"
                                                        y1="64"
                                                        x1="37"
                                                    ></line>
                                                    <path
                                                        strokeWidth="7"
                                                        stroke="black"
                                                        d="M16.5 36V4.5H58.5V36V53.75V54.9752L59.1862 55.9903L66.9674 67.5H8.03256L15.8138 55.9903L16.5 54.9752V53.75V36Z"
                                                    ></path>
                                                </svg>
                                            </label>
                                        </div>
                                        <span className="title" style={{fontFamily:'Arial'}}>{product.name}</span>
                                        <span className="price" style={{fontFamily:'Arial', fontSize:'12px'}}>Rs. {product.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!showingSaved && displayedProducts.length < filteredProducts.length && (
                            <button className="load-more-button" onClick={loadMore}>
                                Load More
                            </button>
                        )}
                    </>
                ) : (
                    <div className="no-products">No products found.</div>
                )}
            </div>
            <div className="page-footer">
                <span>© 2024 Pxrthye. All rights reserved.</span>
            </div>
        </div>
    );
};

export default ProductPage;