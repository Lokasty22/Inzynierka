import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  if (!isAuthenticated || userRole !== 'Admin') {
    return <p className="text-danger">Brak dostępu.</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Panel Administratora</h1>
      <div className="card shadow p-4">
        <ul className="list-unstyled row g-3"> {/* Dodanie g-3 dla odstępów */}
          <li className="col-sm-6 col-md-3">
            <Link to="/admin/users" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
              <i className="bi bi-people-fill me-2"></i> Zarządzaj użytkownikami
            </Link>
          </li>
          <li className="col-sm-6 col-md-3">
            <Link to="/admin/listings" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
              <i className="bi bi-card-list me-2"></i> Zarządzaj ogłoszeniami
            </Link>
          </li>
          <li className="col-sm-6 col-md-3">
            <Link to="/admin/messages" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
              <i className="bi bi-envelope-fill me-2"></i> Przeglądaj wiadomości
            </Link>
          </li>
          <li className="col-sm-6 col-md-3">
            <Link to="/admin/opinions" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
              <i className="bi bi-chat-dots-fill me-2"></i> Zarządzaj opiniami
            </Link>
          </li>
          <li className="col-sm-6 col-md-3">
            <Link to="/admin/statistics" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
              <i className="bi bi-bar-chart-fill me-2"></i> Statystyki
            </Link>
          </li>
          <li className="col-sm-6 col-md-3">
            <Link to="/admin/articles" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
              <i className="bi bi-newspaper me-2"></i> Zarządzaj artykułami
            </Link>
          </li>
          <li className="col-sm-6 col-md-3">
            <Link
              to="/admin/payments"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-cash-stack me-2"></i> Zarządzaj wypłatami
            </Link>
          </li>
          <li className="col-sm-6 col-md-3">
            <Link to="/admin/questions" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
              <i className="bi bi-question-circle-fill me-2"></i> Przeglądaj pytania
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
