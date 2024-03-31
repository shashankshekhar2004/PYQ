import React, { useState } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Login = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when login process starts
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            if (response.data.status === 1) {
                handleLogin();
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login');
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    return (
        <Container>
            <h2>Admin Login</h2>
            {error && <p className="text-danger">{error}</p>}
            <Form >
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Login'}
                </Button>
            </Form>
        </Container>
    );
};

export default Login;
