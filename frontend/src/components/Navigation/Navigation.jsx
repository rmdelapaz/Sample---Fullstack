// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    const sessionLinks = sessionUser ? (
        <li className="nav-item">
            <ProfileButton user={sessionUser} />
        </li>
    ) : (
        <>
            <li className="nav-item">
                <NavLink to="/login">Log In</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/signup">Sign Up</NavLink>
            </li>
        </>
    );

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <NavLink to="/">Home</NavLink>
                </li>
                {isLoaded && sessionLinks}
            </ul>
        </nav>
    );
}

export default Navigation;
