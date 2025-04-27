import React from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ListingCard from './ListingCard';
import './CarouselListings.css';
import { AuthContext } from '../context/AuthContext';
const CarouselListings = () => {
    const [page, setPage] = useState(1);
    const [listing, setListing] = useState([]);
    const {loading} = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(true);
    
    useEffect(() => {
    setFetching(true);
    const fetchListings = async () => {
        try {
            const res = await axios.get(`/api/listings?page=${page}`); 
            setListing(res.data);
        } catch (error) {
            console.error('Błąd przy pobieraniu ogłoszeń:', error);
        } finally {
            setFetching(false);
        }
    };       
        fetchListings();
    }, [page]);


    if (loading || fetching) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" />
                <p className="mt-3">Ładowanie ogłoszeń...</p>
            </Container>
        );
        }

    for(let i = 0 ; i < listing.length - 1 ; i ++ ){
        for(let j = 0 ; j < listing.length - i - 1 ; j ++ ){
            if(listing[j].createdAt < listing[j+1].createdAt){
                let temp = listing[j];
                listing[j] = listing[j+1];
                listing[j+1] = temp;
            }
        }
    }

    const listingArray = (array, size) => {
        const result = [];
        for(let i = 0 ; i < array.length; i+=size){
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    if(error){
        return <div className="container my-5 text-danger">{error}</div>;
    }

    if(listing.length === 0){
        return <div className="container my-5">Brak ogłoszeń</div>;
    }

    const listingChunk = listingArray(listing, 2);


    return (
        <div className="shadow-sm mt-5">
            <div className="container"> <h2>Najnowsze ogłoszenia</h2></div>
            <Carousel fade interval={null} indicators={false}>
                {listingChunk.map((chunk, index) => (
                    <Carousel.Item key={index} style={{ height: 'auto' }}>
                        <Container>
                            <Row className="justify-content-center">
                                {chunk.map((listing) => (
                                    <Col key={listing._id} xs={12} md={6} className="mb-4">
                                        <ListingCard listing={listing} />
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};
export default CarouselListings;