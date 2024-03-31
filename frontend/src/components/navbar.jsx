import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import 'bootstrap/dist/css/bootstrap.min.css';

const NAV = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    function handleAdmin() {
        navigate('/admin'); 
    }

    return (
        <div>
            <Navbar fixed="top" bg="dark" expand="lg">
                <Navbar.Brand className="text-white w-100 text-center">Prince Previous Year Paper App</Navbar.Brand>
                <Button onClick={handleAdmin} variant="outline-light">Admin Login</Button>
            </Navbar>
        </div>
    );
};

export default NAV;
