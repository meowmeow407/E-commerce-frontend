import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // These must match the names in your MySQL 'categories' table exactly
  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden'];

  // --- API FETCHING ---
  const fetchProducts = async () => {
    try {
      // Constructs the URL with search and category filters
      let url = `http://localhost:5000/api/products?search=${searchTerm}`;
      if (activeCategory !== 'All') {
        url += `&category=${activeCategory}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Re-run fetch whenever search or category changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [searchTerm, activeCategory, isLoggedIn]);

  // --- HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    // Basic validation to enter the site
    if (email && password) {
      setIsLoggedIn(true);
    } else {
      alert("Please enter both email and password.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  // --- 1. LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Shop<span>Zen</span></h1>
          <p>Login to explore our collection</p>
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button type="submit" className="auth-btn">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. MAIN STOREFRONT ---
  return (
    <div className="App">
      {/* HEADER & NAVIGATION */}
      <nav className="navbar">
        <div className="nav-top">
          <div className="logo">SHOP<span>ZEN</span></div>
          
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="What are you looking for today?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="nav-user-tools">
            <button onClick={handleLogout} className="logout-pill">Logout</button>
          </div>
        </div>

        <div className="nav-bottom-tabs">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* PRODUCT GRID */}
      <main className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="image-container">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">₹{product.price}</p>
                <button className="add-btn">Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <h2>No products found</h2>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;