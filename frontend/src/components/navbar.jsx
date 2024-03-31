import React from 'react';
import { Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NAV = () => {
    return (
        <div>
            <Navbar fixed="top" bg="dark" expand="lg">
                <Navbar.Brand className="text-white w-100 text-center">Prince Previous Year Paper App</Navbar.Brand>
            </Navbar>
        </div>
    );
};

export default NAV;
