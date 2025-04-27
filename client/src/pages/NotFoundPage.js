import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="text-center">
                <div className="display-1 fw-bold text-primary">404</div>
                <h1 className="display-4">Nie znaleziono strony</h1>
                <p className="lead">Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
                <Link to="/" className="btn btn-primary mt-3">
                    Strona Główna
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;