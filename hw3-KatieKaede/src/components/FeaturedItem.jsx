import { useState } from "react";
import { Card, Button, Table } from "react-bootstrap";

export default function FeaturedItem(props) {
    const [buttonText, setButtonText] = useState('Show Nutrition Facts');

    const showNutrition = () => {
        setButtonText(prevState => !prevState);
    };

    const calories = props.nutrition.calories
    const fat = props.nutrition.fat || '0g'
    const carbohydrates = props.nutrition.carbohydrates || '0g'
    const protein = props.nutrition.protein || '0g'

    return (
        <Card>
            <Card.Img src={props.img} alt={props.name} style={{ 
                display: 'block', 
                width: '150px', 
                margin: '0 auto',
                height: 'auto' 
                }} 
            />
            <h3>{props.name}</h3>
            <p>Price: ${props.price}</p>
            <p>{props.description}</p>

            <Button
                variant={buttonText ? 'primary' : 'danger'} // Change color based on state
                onClick={showNutrition}
            >
                {buttonText ? 'Show Nutrition Facts' : 'Hide Nutrition Facts'}
            </Button>

            {!buttonText && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Calories</th>
                            <th>Fat</th>
                            <th>Carbohydrates</th>
                            <th>Protein</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{calories}</td>
                            <td>{fat}</td>
                            <td>{carbohydrates}</td>
                            <td>{protein}</td>
                        </tr>
                    </tbody>
                </Table>
            )}
        </Card>
    );
}