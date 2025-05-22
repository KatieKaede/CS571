import React, { useContext, useState, useEffect } from 'react';
import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext';
import BadgerBudSummary from '../../BadgerBudSummary';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function BadgerBudsBasket(props) {
    const buddies = useContext(BadgerBudsDataContext);
    const [savedCatIds, setSavedCatIds] = useState([]);

    useEffect(() => {
        const savedCats = JSON.parse(sessionStorage.getItem('catIdsSaved')) || [];
        setSavedCatIds(savedCats);
    }, []);

    // Filter the buddies to only include those that are in the saved list
    const savedBuddies = Array.isArray(buddies) ? buddies.filter(buddy => savedCatIds.includes(buddy.id)) : [];

    // Function to handle unselecting a buddy
    const manageUnselect = (buddy) => {
        const updatedCatIds = savedCatIds.filter(id => id !== buddy.id);
        setSavedCatIds(updatedCatIds); // Update the state to trigger re-render
        sessionStorage.setItem('catIdsSaved', JSON.stringify(updatedCatIds)); // Update sessionStorage

        alert(`${buddy.name} has been removed from your basket!`);
    }

    return (
        <div>
            <h1>Badger Buds Basket</h1>
            <p>These cute cats could be all yours!</p>
            <Row>
                {savedBuddies.length > 0 ? (
                    savedBuddies.map(buddy => (
                        <Col key={buddy.id} xs={12} sm={6} md={4} lg={3}>
                            <div>
                                <BadgerBudSummary key={buddy.id} buddy={buddy} onUnselect={manageUnselect} />
                            </div>
                        </Col>
                    ))
                ) : (
                    <p>You have no buds in your basket!</p>
                )}
            </Row>
        </div>
    );
}
