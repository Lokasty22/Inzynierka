import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, userRole } = useContext(AuthContext);

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Korepetycje
          </Link>
          <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarColor01"
              aria-controls="navbarColor01"
              aria-expanded="false"
              aria-label="Przełącz nawigację"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                    className="text-white text-decoration-none px-3 py-2 d-inline-block"
                    to="/ogloszenia/korepetytorzy"
                >
                  Ogłoszenia korepetytorów
                </Link>
              </li>
              <li className="nav-item">
                <Link className="text-white text-decoration-none px-3 py-2 d-inline-block" to="pytania/uczniowie">
                  Pytania uczniów
                </Link>
              </li>
              
            </ul>
            <ul className="navbar-nav ms-auto">
      {isAuthenticated && userRole === 'Admin' && (
        <li className="nav-item">
          <Link className="text-white text-decoration-none px-3 py-2 d-inline-block" to="/admin">
            Panel Administratora
          </Link>
        </li>
      )}
                {isAuthenticated ? (
                    <li className="nav-item dropdown">
                      <a
                          className="text-white text-decoration-none px-3 py-2 d-inline-block dropdown-toggle"
                          href="#"
                          id="navbarDropdown"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                      >
                        Mój profil
                      </a>
                      <ul
                          className="dropdown-menu dropdown-menu-end"
                          aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <Link className="dropdown-item" to="/myprofile">
                            Edytuj profil
                          </Link>
                        </li>
                        <li>
                            <Link className='dropdown-item' to="/saldo-konta">
                              Saldo konta
                            </Link>
                          </li>
                        
                          {userRole === 'Nauczyciel' && (
                          <li>
                          <Link className="dropdown-item" to="/moje-ogloszenia">
                            Moje ogłoszenia
                          </Link>
                          </li>
                          
                          )}
                          {userRole === 'Nauczyciel' && (
                          <li>
                          <Link className="dropdown-item" to="/moje-rezerwacje-nauczyciel">
                            Moje rezerwacje
                          </Link>
                          </li>
                          
                          )}
                          {userRole === 'Uczeń' && (
                        <li>
                          <Link className="dropdown-item" to="/moje-rezerwacje">
                            Moje rezerwacje
                            </Link>
                        </li>
                          )}
                          {userRole === 'Uczeń' && (
                            <li>
                            <Link className="dropdown-item" to="/moje-pytania">
                              Moje pytania
                            </Link>
                            </li>
                          )}
                        <li>
                          <Link className="dropdown-item" to="/wiadomosci">
                            Wiadomości
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider"/>
                        </li>
                        <li>
                          <button
                              className="dropdown-item text-danger"
                              onClick={() => {
                                logout();
                                window.location.href = '/';
                              }}
                          >
                            Wyloguj
                          </button>
                        </li>
                      </ul>
                    </li>
                ) : (
                    <>
                      <li className="nav-item ">
                        <Link className="text-white text-decoration-none px-3 py-2 d-inline-block" to="/register">
                          Rejestracja
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="text-white text-decoration-none px-3 py-2 d-inline-block" to="/login">
                          Logowanie
                        </Link>
                      </li>
                    </>
                )}
              </ul>
          </div>
        </div>
      </nav>
);
};

export default Navbar;
