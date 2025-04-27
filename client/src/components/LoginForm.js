import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginForm = () => {
    const [data, setData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = 'http://localhost:8080/api/auth';
            const { data: res } = await axios.post(url, data);
            const decoded = jwtDecode(res.data);

            login(res.data, decoded.role);

        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={data.email}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Hasło"
                    name="password"
                    onChange={handleChange}
                    value={data.password}
                    required
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">
                Zaloguj się
            </button>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <h6 className="d-inline">Nie masz konta? </h6>
                    <Link to="/register">
                        <button type="button" className="btn btn-link p-0 align-baseline">
                            Zarejestruj się
                        </button>
                    </Link>
                </div>
                <div>
                    <Link to="/forgot-password" className="text-decoration-none">
                        Zapomniałeś hasła?
                    </Link>
                </div>
            </div>
        </form>
    );
};

export default LoginForm;
