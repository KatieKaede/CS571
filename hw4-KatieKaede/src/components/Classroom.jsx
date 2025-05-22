import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import Student from "./Student";

const Classroom = () => {

    const [students, updStudents] = useState([]);
    const [searchName, updSearchName] = useState("");
    const [searchMajor, updSearchMajor] = useState("");
    const [searchInterest, updSearchInterest] = useState("");
    const [page, newPage] = useState(1);
    const peopleEachPage = 24;

    //fetch data
    useEffect(() => {
        fetch("https://cs571api.cs.wisc.edu/rest/f24/hw4/students", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                updStudents(data);
            });
    }, []);
    
    const filteredStudents = students.filter((student) => {
        const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
        const lowerCaseMajor = student.major.toLowerCase();
        const lowerCaseInterests = student.interests.map((interest) => interest.toLowerCase());

        // Prepare search terms, trimming whitespace
        const nameSearch = searchName.trim().toLowerCase();
        const majorSearch = searchMajor.trim().toLowerCase();
        const interestSearch = searchInterest.trim().toLowerCase();

        const matchesName = nameSearch === "" || fullName.includes(nameSearch);
        const matchesMajor = majorSearch === "" || lowerCaseMajor.includes(majorSearch);
        const matchesInterest = interestSearch === "" || lowerCaseInterests.some(interest => interest.includes(interestSearch));

        return matchesName && matchesMajor && matchesInterest;
    });

    const totalPages = Math.ceil(filteredStudents.length / peopleEachPage);

    const handlePageChange = (pageNumber) => {
        newPage(pageNumber);
    };

    const previousPage = () => {
        if (page > 1) {
            newPage(page - 1);
        }
    }
    const nextPage = () => {
        if (page < totalPages) {
            newPage(page + 1);
        }
    }

    // Get current students for the page
    const indexOfLastStudent = page * peopleEachPage;
    const indexOfFirstStudent = indexOfLastStudent - peopleEachPage;
    const studentsThisPage = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);


    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
                <Form.Label htmlFor="searchName">Name</Form.Label>
                <Form.Control
                    id="searchName"
                    value={searchName}
                    onChange={(e) => {
                        updSearchName(e.target.value);
                        newPage(1);
                    }}
                />
                <Form.Label htmlFor="searchMajor">Major</Form.Label>
                <Form.Control
                    id="searchMajor"
                    value={searchMajor}
                    onChange={(e) => {
                        updSearchMajor(e.target.value);
                        newPage(1);
                    }}
                />
                <Form.Label htmlFor="searchInterest">Interest</Form.Label>
                <Form.Control
                    id="searchInterest"
                    value={searchInterest}
                    onChange={(e) => {
                        updSearchInterest(e.target.value);
                        newPage(1);
                    }}
                />
                <br />
                <Button variant="neutral" onClick={() =>{
                    newPage(1);
                    updSearchName('');
                    updSearchMajor('');
                    updSearchInterest('');
                }}>Reset Search</Button>
        </Form>

        <p>There are {filteredStudents.length} student(s) matching your search.</p>
        <Container fluid>
            <Row>
                {studentsThisPage.map((student) => (
                    <Col xs={12} sm={12} md={6} lg={4} xl={3} key={student.id}>
                        <Student
                            name={student.name}
                            major={student.major}
                            credits={student.numCredits}
                            wisconsin={student.fromWisconsin}
                            interest={student.interests || []}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
        <Pagination>
                <Pagination.Prev
                    onClick={previousPage}
                    disabled={page === 1 || filteredStudents.length === 0}
                />

                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === page}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={nextPage}
                    disabled={page === totalPages || filteredStudents.length === 0}
                />
            </Pagination>
        </div>
}
export default Classroom;