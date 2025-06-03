// Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userName, setUserName] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);


  // Function to update cart count from the back-end
  const updateCartCount = () => {
    fetch('/api/cart')
      .then((res) => res.json())
      .then((data) => setCartCount(data.totalItems || 0))
      .catch((err) => console.error('Error fetching cart:', err));
  };

  // Function to update compare count from localStorage
  const updateCompareCount = () => {
    const compareItems = localStorage.getItem('vehicles_to_compare');
    if (compareItems) {
      try {
        const compareArray = JSON.parse(compareItems);
        setCompareCount(compareArray.length);
      } catch (err) {
        console.error('Error parsing vehicles_to_compare:', err);
        setCompareCount(0);
      }
    } else {
      setCompareCount(0);
    }
  };

  // Get user info on mount
  useEffect(() => {
    if (token) {
      fetch('/auth/userInfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUserName(`${data.user.fName} ${data.user.lName}`);
            setIsAdmin(data.user.isAdmin); // Save admin status
          }
        })
        .catch((error) => console.error('Error fetching user info:', error));
    }
  }, [token]);
  

  // Listen for custom events and update counts accordingly
  useEffect(() => {
    // Initial update
    updateCartCount();
    updateCompareCount();

    const onCartUpdated = () => updateCartCount();
    const onCompareUpdated = () => updateCompareCount();

    window.addEventListener('cartUpdated', onCartUpdated);
    window.addEventListener('compareUpdated', onCompareUpdated);

    return () => {
      window.removeEventListener('cartUpdated', onCartUpdated);
      window.removeEventListener('compareUpdated', onCompareUpdated);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.reload();
  };

  return (
    <nav className="navbar sticky-navbar">
      <div className="navbar-logo">
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Electric Vehicle Store
        </h1>
      </div>
      <ul className="nav-links">
                {/* Admin analytics */}
                {isAdmin && (
      <li>
        <a href="http://localhost:3000/admin/analytics" target="_blank" rel="noopener noreferrer">
         Analytics
       </a>
    </li>
        )}
        <li>
          <Link to="/">Catalog</Link>
        </li>
        <li>
          <Link to="/compare" className={compareCount > 0 ? 'highlight' : ''}>
            Compare {compareCount > 0 ? `(${compareCount})` : ''}
          </Link>
        </li>
        <li>
          <Link to="/cart" className={cartCount > 0 ? 'highlight' : ''}>
            Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </Link>
        </li>
        <li>
          <Link to="/contactus">Contact Us</Link>
        </li>
        <li className="divider"></li>
        {token ? (
          <>
            <li className="user-greeting">{userName}</li>
            <li onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
              Logout
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Sign In</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
