import React, { useState, useEffect } from "react";
import Image from "./assets/image.png";
import Logo from "./assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Make sure to create this CSS file

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login process
        setTimeout(() => {
            navigate("/home");
        }, 2000); // Adjust time as needed
    };

    return (
        <div className="login-main">
            <div className="login-left">
                <img src={Image} alt="" />
            </div>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-logo">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="login-center">
                        <h2>Welcome back!</h2>
                        <p>Please enter your details</p>
                        <form onSubmit={handleLogin}>
                            <input type="text" placeholder="Mobile Number" />
                            <div className="pass-input-div">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                />
                                {showPassword ? (
                                    <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                                ) : (
                                    <FaEye onClick={() => setShowPassword(!showPassword)} />
                                )}
                            </div>
                            <div className="login-center-options">
                                <div className="remember-div">
                                    <input type="checkbox" id="remember-checkbox" />
                                    <label htmlFor="remember-checkbox">
                                        Remember for 30 days
                                    </label>
                                </div>
                                <a href="#" className="forgot-pass-link">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="login-center-buttons">
                                <button
                                    type="submit"
                                    className={`login-button ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="spinner"></div>
                                    ) : (
                                        "Log In"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <p className="login-bottom-p">
                        Don't have an account? <a href="#">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;