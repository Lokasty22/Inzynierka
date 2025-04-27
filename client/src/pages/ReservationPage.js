import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReservationForm from '../components/ReservationForm';
import axios from 'axios';

const ReservationPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListingAndReservations = async () => {
            try {
                const [listingResponse, reservationsResponse] = await Promise.all([
                    axios.get(`/api/listings/${id}`),
                    axios.get(`/api/reservations?listingId=${id}`),
                ]);
                setListing(listingResponse.data);
                setReservations(reservationsResponse.data);
            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListingAndReservations();
    }, [id]);

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    if (!listing) {
        return <p>Nie znaleziono ogłoszenia.</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center"> Zarezerwuj korepetycje </h1>
            <p className="text-center"> Proszę wypełnić poniższy formularz, aby zarezerwować korepetycje. </p>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <ReservationForm listing={listing} reservations={reservations} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationPage;
