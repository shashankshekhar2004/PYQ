

import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import { pdfjs } from 'react-pdf';
import PdfView from '../components/PdfView';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();


const Previous = () => {
    const [subjectCode, setSubjectCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [error, setError] = useState('');
    const [pdfFile, setPdfFile] = useState('');

    async function handleDownload(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Here you would make an API request to download the PDF based on the entered subject code
            // Replace the API endpoint with your actual endpoint
            const filename = subjectCode.toUpperCase();
            const response = await axios.post("https://pyqapp.onrender.com/search/search-files", { filename }, {
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

    async function handleView(e) {
        e.preventDefault();
        setError('');
        setViewLoading(true);

        try {
            const filename = subjectCode.toUpperCase();
            const response = await axios.post("https://pyqapp.onrender.com/search/search-files", { filename }, {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            setPdfFile(blob); // Corrected setting the state with blob
            // console.log(blob); // Logging blob instead of response.data.Blob

        } catch (error) {
            console.error('Error occurred:', error);
            setError('An error occurred while trying to view the content.');
        } finally {
            setViewLoading(false);
        }
    }


    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Card className="mt-4 p-4" style={{ maxWidth: '600px' }}>
                    <h1 className="mb-4 text-center">Previous Year paper</h1>
                    <Form>
                        <Form.Group controlId="subjectCode">
                            <Form.Label>Subject Code:</Form.Label>
                            <Form.Control
                                type="text"
                                value={subjectCode}
                                onChange={(e) => setSubjectCode(e.target.value)}
                                placeholder="Enter Subject Code"
                                required
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col>
                                <Button variant="primary" onClick={handleView} className="w-100" disabled={loading || viewLoading}>
                                    {viewLoading ? 'Loading...' : 'View'}
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={handleDownload} className="w-100" disabled={loading}>
                                    {loading ? 'Downloading...' : 'Download'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </Card>
            </div>
            <PdfView pdf={pdfFile} />
        </>
    );
};

export default Previous;
