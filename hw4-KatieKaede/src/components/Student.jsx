const Student = (props) => {
    return (
        <div>
            <h2>{props.name.first} {props.name.last}</h2>
            <p>Major: {props.major}</p>
            <p>Credits: {props.credits}</p>
            <p>From Wisconsin: {props.wisconsin ? 'Yes' : 'No'}</p>
            <h4>Interests:</h4>
            <ul>
                {props.interest.map((interest, index) => (
                    <li key={index}>{interest}</li>
                ))}
            </ul>
        </div>
    );
}



export default Student;
