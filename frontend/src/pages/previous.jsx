// import React, { useState } from 'react';
// import { Form, Button, Card, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
// import { pdfjs } from 'react-pdf';
// import PdfView from '../components/PdfView';

// // Configure the worker for PDF rendering
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     "pdfjs-dist/build/pdf.worker.min.js",
//     import.meta.url
// ).toString();

// const Previous = () => {
//     // State variables
//     const [subjectCode, setSubjectCode] = useState(''); // Subject code input
//     const [loading, setLoading] = useState(false); // Loading state for download
//     const [viewLoading, setViewLoading] = useState(false); // Loading state for view
//     const [error, setError] = useState(''); // Error message state
//     const [pdfFile, setPdfFile] = useState(null); // State to store the PDF file

//     // Function to handle PDF file download
//     async function handleDownload(e) {
//         e.preventDefault(); // Prevent default form submission behavior
//         setError(''); // Reset error message
//         setLoading(true); // Set loading to true

//         try {
//             const filename = subjectCode.toUpperCase(); // Convert subject code to uppercase
//             // Make a POST request to get the PDF file as a blob
//             const response = await axios.post("http://localhost:5000/search/search-files", { filename }, {
//                 responseType: 'blob'
//             });

//             // Check if response data is not empty
//             if (response.data.size > 0) {
//                 const blob = new Blob([response.data], { type: 'application/pdf' }); // Create a blob for the PDF
//                 const url = URL.createObjectURL(blob); // Create a URL for the blob
//                 const link = document.createElement('a'); // Create a temporary link element
//                 link.href = url;
//                 link.setAttribute('download', `${subjectCode}.pdf`); // Set the download attribute with filename
//                 link.click(); // Trigger the download
//                 URL.revokeObjectURL(url); // Clean up the URL object
//             } else {
//                 setError('PDF file not found.'); // Set error message if no data
//             }
//         } catch (error) {
//             console.error('Error occurred:', error); // Log any errors
//             setError('PDF file not found.'); // Set error message for failed request
//         } finally {
//             setLoading(false); // Reset loading state
//         }
//     }

//     // Function to handle PDF file viewing
//     async function handleView(e) {
//         e.preventDefault(); // Prevent default form submission behavior
//         setError(''); // Reset error message
//         setViewLoading(true); // Set view loading state to true

//         try {
//             const filename = subjectCode.toUpperCase(); // Convert subject code to uppercase
//             // Make a POST request to get the PDF file as a blob
//             const response = await axios.post("http://localhost:5000/search/search-files", { filename }, {
//                 responseType: 'blob'
//             });

//             // Check if response data is not empty
//             if (response.data.size > 0) {
//                 const blob = new Blob([response.data], { type: 'application/pdf' }); // Create a blob for the PDF
//                 setPdfFile(blob); // Update the state with the PDF blob
//                 window.scrollBy(0, 500); // Scroll down by 500 pixels to bring the PDF view into view
//             } else {
//                 setError('PDF file not found.'); // Set error message if no data
//             }
//         } catch (error) {
//             setError('PDF file not found.'); // Set error message for failed request
//             console.error('Error occurred:', error); // Log any errors
//         } finally {
//             setViewLoading(false); // Reset view loading state
//         }
//     }

//     return (
//         <>
//             <div className="d-flex justify-content-center">
//                 <Card className="mt-4 p-4" style={{ maxWidth: '600px' }}>
//                     <h1 className="mb-4 text-center">Previous Year Paper</h1>
//                     <Form>
//                         <Form.Group controlId="subjectCode">
//                             <Form.Label>Subject Code:</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 value={subjectCode}
//                                 onChange={(e) => setSubjectCode(e.target.value)} // Update subject code state
//                                 placeholder="Enter Subject Code"
//                                 required
//                             />
//                         </Form.Group>

//                         <Row className="mb-3">
//                             <Col>
//                                 <Button variant="primary" onClick={handleView} className="w-100" disabled={loading || viewLoading}>
//                                     {viewLoading ? 'Loading...' : 'View'} {/* Show loading state for view button */}
//                                 </Button>
//                             </Col>
//                             <Col>
//                                 <Button variant="primary" onClick={handleDownload} className="w-100" disabled={loading}>
//                                     {loading ? 'Downloading...' : 'Download'} {/* Show loading state for download button */}
//                                 </Button>
//                             </Col>
//                         </Row>
//                     </Form>
//                     {error && <p className="text-danger mt-2">{error}</p>} {/* Display error message if any */}
//                 </Card>
//             </div>
//             {pdfFile && <PdfView pdf={pdfFile} />} {/* Render PdfView component if pdfFile is set */}
//         </>
//     );
// };

// export default Previous;











import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { pdfjs } from 'react-pdf';
import PdfView from '../components/PdfView';
import '../App.css'; // Import the CSS file

// Configure the worker for PDF rendering
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

const Previous = () => {
    const [subjectCode, setSubjectCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [error, setError] = useState('');
    const [pdfFile, setPdfFile] = useState(null);

    async function handleDownload(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const filename = subjectCode.toUpperCase();
            const response = await axios.post(
                "http://localhost:5000/search/search-files",
                { filename },
                { responseType: 'blob' }
            );

            if (response.data.size > 0) {
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
            const response = await axios.post(
                "http://localhost:5000/search/search-files",
                { filename },
                { responseType: 'blob' }
            );

            if (response.data.size > 0) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                setPdfFile(blob);
                window.scrollBy(0, 500);
            } else {
                setError('PDF file not found.');
            }
        } catch (error) {
            setError('PDF file not found.');
            console.error('Error occurred:', error);
        } finally {
            setViewLoading(false);
        }
    }

    return (
        <div id="Previous"> {/* Apply background styling */}
            <div className="d-flex justify-content-center">
                <Card className="mt-4 p-4" style={{ maxWidth: '600px' }}>
                    <h1 className="mb-4 text-center">Previous Year Paper</h1>
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
                                <Button
                                    variant="primary"
                                    onClick={handleView}
                                    className="w-100"
                                    disabled={loading || viewLoading}
                                >
                                    {viewLoading ? 'Loading...' : 'View'}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="primary"
                                    onClick={handleDownload}
                                    className="w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Downloading...' : 'Download'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </Card>
            </div>
            {pdfFile && <PdfView pdf={pdfFile} />}
        </div>
    );
};

export default Previous;
