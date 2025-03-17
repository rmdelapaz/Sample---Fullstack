import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { FaUserCircle } from "react-icons/fa";
import { TfiMenu } from "react-icons/tfi";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setShowDropdown(prev => !prev);
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = <ProfileButton user={sessionUser} />;
  } else {
    sessionLinks = (
      <div className="auth-buttons-container">
        <OpenModalButton buttonText="Log In" modalComponent={<LoginFormModal />} />
        <OpenModalButton buttonText="Sign Up" modalComponent={<SignupFormModal />} />
      </div>
    );
  }

  return (
    <header className="navigation">
      <NavLink to="/" className="logo-container">
        <img
          src="https://redeem-innovations.com/wp-content/uploads/2025/03/gale_16809038.png"
          alt="Windbnb Logo"
          className="custom-logo"
        />
        <span className="logo-text">Windbnb</span>
      </NavLink>
      <div className="dropdown-container" ref={dropdownRef}>
        {sessionUser ? (
          <div className="nav-actions">
            <NavLink to="/spots/new" className="create-spot-link">
              Create a New Spot
            </NavLink>
            <ProfileButton user={sessionUser} />
          </div>
        ) : (
          <>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <TfiMenu size={24} className="menu-icon" color="black" />
              <FaUserCircle size={24} color="black" />
            </button>
            {showDropdown && <ul className="dropdown-menu">{isLoaded && sessionLinks}</ul>}
          </>
        )}
      </div>
    </header>
  );
}

export default Navigation;
