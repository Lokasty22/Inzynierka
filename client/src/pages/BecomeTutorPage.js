import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BecomeTutorPage = () => {

    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="container my-5">
            {/* Nagłówek strony */}
            <div className="text-center mb-5">
                <h1>Zostań Korepetytorem</h1>
                <p className="lead">Dołącz do naszej społeczności i dziel się swoją wiedzą z uczniami na całym
                    świecie.</p>
            </div>

            {/* Sekcja z korzyściami */}
            <div className="row g-4">
                <div className="col-md-4 text-center">
                    <div className="p-4 border rounded">
                        <h3>Elastyczny Grafik</h3>
                        <p>Ustalaj własne godziny pracy i ucz wtedy, kiedy Ci pasuje.</p>
                    </div>
                </div>
                <div className="col-md-4 text-center">
                    <div className="p-4 border rounded">
                        <h3>Wsparcie Platformy</h3>
                        <p>Otrzymasz dostęp do narzędzi, które ułatwią Ci znalezienie uczniów.</p>
                    </div>
                </div>
                <div className="col-md-4 text-center">
                    <div className="p-4 border rounded">
                        <h3>Stały Dochód</h3>
                        <p>Zarabiaj, dzieląc się swoją wiedzą i doświadczeniem, pomagając innym!</p>
                    </div>
                </div>
            </div>

            {/* Sekcja FAQ */}
            <div className="mt-5">
                <h2 className="mb-4">Często Zadawane Pytania</h2>
                <div className="accordion" id="faqAccordion">
                    {}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Jak mogę się zarejestrować jako korepetytor?
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne"
                             data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                Przejdź na stronę rejestracji i wybierz opcję "Nauczyciel".
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Czy muszę mieć doświadczenie w nauczaniu?
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                             data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                Doświadczenie nie jest wymagane, ale jest mile widziane.
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Czy rejestracja jako korepetytor jest płatna?
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
                             data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                Nie ma opłat za rejestrację jako korepetytor.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!isAuthenticated && (
            <>
            {/* Sekcja CTA */}
            <div className="mt-5">
                <div className="bg-primary text-white p-5 rounded shadow text-center">
                    <h2 className="mb-3">Gotowy, aby zacząć?</h2>
                    <p className="mb-4">
                        Zarejestruj się jako korepetytor i rozpocznij swoją przygodę już dziś!
                    </p>
                    <Link to={isAuthenticated ? '/' : '/register'}>
                        <button className="btn btn-outline-light btn-lg">
                            Zarejestruj się
                        </button>
                    </Link>
                </div>
            </div>
            </>
            )}
        </div>
    );
};

export default BecomeTutorPage;