import React, { useContext, useState, useEffect } from 'react';
import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext';
import BadgerBudSummary from '../../BadgerBudSummary';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function BadgerBudsAdoptable(props) {
    const buddies = useContext(BadgerBudsDataContext);
    const [catIdsSaved, setCatIdsSaved] = useState([]);

    useEffect(() => {
        const savedCats = JSON.parse(sessionStorage.getItem('catIdsSaved')) || [];
        setCatIdsSaved(savedCats);
    }, []);

    const manageSave = (buddy) => {
        const newCatIdsSaved = [...catIdsSaved, buddy.id];
        setCatIdsSaved(newCatIdsSaved);
        sessionStorage.setItem('catIdsSaved', JSON.stringify(newCatIdsSaved));

        alert(`${buddy.name} has been added to your basket!`);
    };

    // Filter buddies to remove saved ones for rendering
    const filteredBuddies = buddies.filter(buddy => !catIdsSaved.includes(buddy.id));

    return (
        <div>
            <h1>Available Badger Buds</h1>
            <p>The following cats are looking for a loving home! Could you help?</p>
            <Row>
                {filteredBuddies.length > 0 ? (
                    filteredBuddies.map(buddy => (
                        <Col key={buddy.id} xs={12} sm={6} md={4} lg={3}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                <BadgerBudSummary key={buddy.id} buddy={buddy} onSave={manageSave} />
                            </div>
                        </Col>
                    ))
                ) : (
                    <p>No buds are availabe for adoption!</p>
                )}
            </Row>
        </div>
    );
}
