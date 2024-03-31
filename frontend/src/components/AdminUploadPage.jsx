import React, { useState } from 'react';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap'; // Import Bootstrap components if not already imported
import axios from 'axios';

const AdminUploadPage = () => {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFilenameChange = (e) => {
        setFilename(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', filename.toUpperCase());
            const response = await axios.post('http://localhost:5000/adminupload/upload-files', formData);
            console.log(response);
            setSubmitSuccess(true);
        } catch (err) {
            console.log(err);
            setSubmitError('An error occurred while uploading the file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h1 className="mt-4 mb-4">Admin Upload Page</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFilename" className="mb-3">
                    <Form.Label>Filename:</Form.Label>
                    <Form.Control type="text" value={filename} onChange={handleFilenameChange} />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Choose File:</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={!file || !filename || loading}>
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Uploading...
                        </>
                    ) : (
                        'Upload'
                    )}
                </Button>
            </Form>
            {submitSuccess && <Alert variant="success">File uploaded successfully!</Alert>}
            {submitError && <Alert variant="danger">{submitError}</Alert>}
        </Container>
    );
};

export default AdminUploadPage;
