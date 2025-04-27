import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterStudentPage = () => {
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/myprofile');
        }
    }, [navigate]);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
        setValidationError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameRegex = /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+$/;

        if (!nameRegex.test(data.firstName) || data.firstName.length > 50) {
            setValidationError('Imię nie może zawierać cyfr i musi być krótsze niż 50 znaków.');
            return;
        }
        if (!nameRegex.test(data.lastName) || data.lastName.length > 50) {
            setValidationError('Nazwisko nie może zawierać cyfr i musi być krótsze niż 50 znaków.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            setValidationError('Wprowadź prawidłowy adres email.');
            return;
        }

        const phoneRegex = /^\d{9,}$/;
        if (!phoneRegex.test(data.phoneNumber)) {
            setValidationError('Numer telefonu musi składać się z co najmniej 9 cyfr.');
            return;
        }

        const passwordRegex = /^.{6,}$/;
        if (!passwordRegex.test(data.password)) {
            setValidationError('Hasło musi zawierać co najmniej 6 znaków.');
            return;
        }

        try {
            const url = 'http://localhost:8080/api/users';
            const { data: res } = await axios.post(url, data);
            setSuccessMessage('Rejestracja zakończona sukcesem');
            navigate('/login');
            console.log(res.message);
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center">Rejestracja</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Imię"
                                        name="firstName"
                                        onChange={handleChange}
                                        value={data.firstName}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nazwisko"
                                        name="lastName"
                                        onChange={handleChange}
                                        value={data.lastName}
                                        required
                                    />
                                </div>
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
                                        type="text"
                                        className="form-control"
                                        placeholder="Numer telefonu"
                                        name="phoneNumber"
                                        onChange={handleChange}
                                        value={data.phoneNumber}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <select
                                        className="form-select"
                                        placeholder="Rola"
                                        name="role"
                                        onChange={handleChange}
                                        value={data.role}
                                        required
                                    >
                                        <option value="">Wybierz rolę</option>
                                        <option value="Uczeń">Uczeń</option>
                                        <option value="Nauczyciel">Nauczyciel</option>
                                    </select>
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
                                {validationError && (
                                    <div className="alert alert-danger" role="alert" data-testid="validation-error">
                                        {validationError}
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger" role="alert" data-testid="error-message">
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="alert alert-success" role="alert" data-testid="success-message">
                                        {successMessage}
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary w-100">Zarejestruj się</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudentPage;
