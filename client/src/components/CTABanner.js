import React from 'react';
import { Link } from 'react-router-dom';
import './CTABanner.css';

const CTABanner = () => {
    return (
        <div className="cta-banner">
            <div className="container">
                <div className="cta-section bg-primary text-white p-5 mt-4 rounded shadow">
                    <h2 className="mb-3">Zostań korepetytorem już dziś</h2>
                    <p className="mb-4">Dołącz do naszej społeczności i zacznij dzielić się swoją wiedzą.</p>
                    <Link to="/zostan-korepetytorem">
                        <button className="btn btn-outline-light btn-lg custom-btn">
                            Dowiedz się więcej
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CTABanner;
