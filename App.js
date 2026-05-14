import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden'];

  // --- TEMPORARY DATA LOGIC (MOCK DATA) ---
  // We use this instead of a backend fetch for the GitHub demo
  const fetchProducts = () => {
    const mockData = [
      { id: 1, name: 'Wireless Mouse', price: 1500, category_name: 'Electronics', image_url: './images/mouse.jpg' },
      { id: 2, name: 'Mechanical Keyboard', price: 3500, category_name: 'Electronics', image_url: './images/keyboard.jpg' },
      { id: 3, name: 'Coffee Mug', price: 499, category_name: 'Home & Garden', image_url: './images/mug.jpg' },
      { id: 4, name: 'Denim Jacket', price: 2499, category_name: 'Fashion', image_url: './images/jacket.jpg' }
    ];

    // 1. Filter by Category
    let filtered = activeCategory === 'All' 
      ? mockData 
      : mockData.filter(p => p.category_name === activeCategory);
    
    // 2. Filter by Search Term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
      
    setProducts(filtered);
  };

  // Re-run the local filter whenever search or category changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [searchTerm, activeCategory, isLoggedIn]);

  // --- HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
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
      <nav className="navbar">
        <div className="nav-top">
          <div className="logo">SHOP<span>ZEN</span></div>
          
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Search products..." 
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

      <main className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="image-container">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Image+Missing'; }}
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
            <p>Try adjusting your filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
