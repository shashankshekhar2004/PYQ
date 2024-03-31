import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const Previous = () => {
    const [subjectCode, setSubjectCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Here you would make an API request to download the PDF based on the entered subject code
            // Replace the API endpoint with your actual endpoint
            const filename=subjectCode
            filename.toUpperCase();
            const response = await axios.post("http://localhost:5000/search/search-files", { filename}, {
                responseType: 'blob'
            });

            // Assuming response.data contains the PDF content
            if (response.data) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${subjectCode}.pdf`);
                link.click();
                URL.revokeObjectURL(url);
            } else {
                setError('PDF file not found.');
            }
        } catch (error) {
            console.error('Error occurred:', error);
            setError('PDF file not found.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card className="mt-4 p-4" style={{ maxWidth: '600px' }}>
                <h1 className="mb-4 text-center">Download paper</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="subjectCode">
                        <Form.Label>Subject Code:</Form.Label>
                        <Form.Control
                            type="text"
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                            placeholder="Enter Subject Code"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Downloading...' : 'Submit'}
                    </Button>
                </Form>
                {error && <p className="text-danger mt-2">{error}</p>}
            </Card>
        </div>
    );
};

export default Previous;
