// src/components/BadgerBudSummary.jsx
import React from 'react';
import { useEffect, useState } from "react";
import Carousel from 'react-bootstrap/Carousel';

export default function BadgerBudSummary({ buddy, onSave, onUnselect }) {
    
    const [showMore, setShowMore] = useState(false);

    const showMoreOnOff = () => {
        setShowMore(!showMore);
    }

    const imageUrl = `https://raw.githubusercontent.com/CS571-F24/hw5-api-static-content/main/cats/${buddy.imgIds[0]}`;

    return (
        <div style={{margin: '30px', textAlign: 'left', border: '1px solid #ccc', padding: '10px', width: '100%' }}>
            {/* If showMore is true and there are multiple images, show a carousel */}
            {showMore && buddy.imgIds.length > 1 ? (
                <Carousel>
                    {buddy.imgIds.map((imgId, index) => (
                        <Carousel.Item key={index}>
                            <img 
                                src={`https://raw.githubusercontent.com/CS571-F24/hw5-api-static-content/main/cats/${imgId}`} 
                                alt={`A picture of ${buddy.name}`} 
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                // Default to showing a single image
                <img 
                    src={imageUrl} 
                    alt={`A picture of ${buddy.name}`} 
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                />
            )}

            <h2>{buddy.name}</h2>

            <div style={{ display: 'flex' }}>
                {onSave && <button onClick={() => onSave(buddy)}>Save</button>}
                {onUnselect && <button onClick={() => onUnselect(buddy)}>Unselect</button>}
                <button onClick={showMoreOnOff}>
                    {showMore ? 'Show Less' : 'Show More'}
                </button>
            </div>

            {showMore && (
                <div>
                    <p><strong>Gender:</strong> {buddy.gender}</p>
                    <p><strong>Breed:</strong> {buddy.breed}</p>
                    <p><strong>Age:</strong> {buddy.age}</p>
                    {buddy.description && (
                        <p><strong>Description:</strong> {buddy.description}</p>
                    )}
                </div>
            )}

        </div>
    );
}
