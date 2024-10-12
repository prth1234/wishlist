import React, { useState } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import products from "./products.jsx";
import './Home.css';

const ProductPage = () => {
    const [layout, setLayout] = useState('grid');
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const header = () => {
        return (
            <div className="product-header">
                <h2>Product Catalog</h2>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    const itemTemplate = (product) => {
        if (layout === 'list') {
            return (
                <div className="product-list-item">
                    <div className="product-list-image-container">
                        <img src={product.image} alt={product.name} className="product-image" />
                    </div>
                    <div className="product-list-detail">
                        <div className="product-name">{product.name}</div>
                        <div className="product-description">{product.description}</div>
                        <div className="product-category">{product.category}</div>
                        <div className="product-list-action">
                            <span className="product-price">{product.price}</span>
                            <Button icon="pi pi-shopping-cart" disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
                        </div>
                    </div>
                </div>
            );
        }

        if (layout === 'grid') {
            return (
                <div className="product-grid-item">
                    <div className="product-grid-item-top">
                        <i className="pi pi-tag product-category-icon"></i>
                        <span className="product-category">{product.category}</span>
                    </div>
                    <div className="product-grid-item-content">
                        <div className="product-image-container">
                            <img src={product.image} alt={product.name} className="product-image" />
                        </div>
                        <div className="product-name">{product.name}</div>
                        <div className="product-description">{product.description}</div>
                    </div>
                    <div className="product-grid-item-bottom">
                        <span className="product-price">{product.price}</span>
                        <Button icon="pi pi-shopping-cart" disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            );
        }
    };

    const sidebarItems = [
        {
            label: 'Categories',
            items: [
                { label: 'Smartphones', icon: 'pi pi-mobile' },
                { label: 'Laptops', icon: 'pi pi-desktop' },
                { label: 'Headphones', icon: 'pi pi-volume-up' },
                { label: 'TVs', icon: 'pi pi-video' },
                { label: 'Wearables', icon: 'pi pi-clock' }
            ]
        },
        {
            label: 'Price Range',
            items: [
                { label: 'Under $500' },
                { label: '$500 - $1000' },
                { label: '$1000 - $2000' },
                { label: 'Over $2000' }
            ]
        }
    ];

    return (
        <div className="product-page">
            <div className="page-header">
                <Button
                    icon={sidebarVisible ? "pi pi-times" : "pi pi-bars"}
                    onClick={() => setSidebarVisible(!sidebarVisible)}
                    className="menu-button"
                />
                <h1 style={{fontFamily:'MyCustomFont'}}>Prabhav's Wishlist</h1>
                <Button icon="pi pi-shopping-cart" className="cart-button" />
            </div>

            <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <h2>Filters</h2>
                <Menu model={sidebarItems} />
            </div>

            <div className={`main-content ${sidebarVisible ? 'with-sidebar' : ''}`}>
                <DataView
                    value={products}
                    layout={layout}
                    itemTemplate={itemTemplate}
                    header={header()}
                    paginator
                    rows={9}
                />
            </div>

            <div className="page-footer">
                <span>© 2024 TechStore. All rights reserved.</span>
                <div className="social-icons">
                    <Button icon="pi pi-facebook" className="p-button-text" />
                    <Button icon="pi pi-twitter" className="p-button-text" />
                    <Button icon="pi pi-instagram" className="p-button-text" />
                </div>
            </div>
        </div>
    );
};

export default ProductPage;