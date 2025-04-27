import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-4 mt-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="mb-3">Korepetycje</h5>
                        <p>
                            Twoje miejsce na znalezienie najlepszych korepetytorów. Skontaktuj się z nami i dowiedz się więcej, jak możemy pomóc w Twojej edukacji.
                        </p>
                    </div>
                    <div className="col-md-3">
                        <h5 className="mb-3">Linki</h5>
                        <ul className="list-unstyled">
                            <li><Link className="text-white" to="/">Strona Główna</Link></li>
                            <li><Link className="text-white" to="/zostan-korepetytorem">Zostań korepetytorem</Link></li>
                            <li><Link className="text-white" to="/contact">Kontakt</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h5 className="mb-3">Kontakt</h5>
                        <ul className="list-unstyled">
                            <li><i className="bi bi-envelope"></i> kontakt@korepetycje.pl</li>
                            <li><i className="bi bi-telephone"></i> +48 123 456 789</li>
                            <li><i className="bi bi-geo-alt"></i> Lublin, Polska</li>
                        </ul>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Korepetycje. Wszelkie prawa zastrzeżone.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

