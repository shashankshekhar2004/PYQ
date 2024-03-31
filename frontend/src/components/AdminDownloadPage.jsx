import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';

const AdminDownloadPage = () => {
    const [filename, setFilename] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // State to track loading state

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true); // Set loading to true when submitting

        // Validate filename
        if (!filename.trim()) {
            setError('Please enter a filename.');
            setLoading(false); // Reset loading state
            return;
        }

        try {
            const response = await axios.post("https://pyqapp.onrender.com/admindownload/search-files", { filename }, {
                responseType: 'blob' // Set responseType to 'blob' to receive binary data
            });

            // Check if the response contains the PDF content
            if (response.data) {
                // Create a Blob object from the PDF content
                const blob = new Blob([response.data], { type: 'application/pdf' });

                // Create a URL for the Blob object
                const url = URL.createObjectURL(blob);

                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${filename}.pdf`);

                // Simulate a click on the anchor element to trigger the download
                link.click();

                // Clean up by removing the temporary anchor element and URL object
                URL.revokeObjectURL(url);
            } else {
                setError('PDF file not found.');
            }
        } catch (error) {
            console.error('Error occurred:', error);
            setError('An error occurred while fetching the PDF content.');
        } finally {
            setLoading(false); // Reset loading state
        }
    }


    return (
        <div className="container mt-5">
            <h1 className="mb-4">Admin Download Page</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="filename" className="mb-3">
                    <Form.Label>Enter filename:</Form.Label>
                    <Form.Control
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="Enter filename"
                    />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Loading...
                        </>
                    ) : (
                        'Download'
                    )}
                </Button>
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </div>
    );
}

export default AdminDownloadPage;
