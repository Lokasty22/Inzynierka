import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/myprofile');
        }
    }, [navigate]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center">Logowanie</h3>
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
