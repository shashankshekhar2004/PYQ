import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdf from './pdf.pdf';
function PdfView(pdfProp) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const renderPages = () => {
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
            pages.push(
                <div key={i} className="page-container">
                    <Page
                        pageNumber={i}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                    <p>Page {i} of {numPages}</p>
                </div>
            );
        }
        return pages;
    };

    return (
        <div className='pdf-div'>

            <Document file={pdfProp.pdf} onLoadSuccess={onDocumentLoadSuccess}>
                <div className="pdf-container">
                    {renderPages()}
                </div>
            </Document>
        </div>
    );
}

export default PdfView;
