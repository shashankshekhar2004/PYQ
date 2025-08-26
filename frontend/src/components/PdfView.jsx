import React, { useState } from "react";
import { Document, Page } from "react-pdf"; // Import Document and Page components from react-pdf library

function PdfView(pdfProp) {
  // State to keep track of the number of pages in the PDF
  const [numPages, setNumPages] = useState(null);
  // State to keep track of the current page number being viewed
  const [pageNumber, setPageNumber] = useState(1);

  // Callback function when the document is successfully loaded
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages); // Update the number of pages state
  }

  // Function to render all pages of the PDF
  const renderPages = () => {
    const pages = [];
    // Loop through all pages and create a Page component for each
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div key={i} className="page-container">
          <Page
            pageNumber={i} // Set the page number for the Page component
            renderTextLayer={false} // Disable rendering of text layer (if you don't need selectable text)
            renderAnnotationLayer={false} // Disable rendering of annotation layer (if you don't need annotations)
          />
          <p>
            Page {i} of {numPages}
          </p>{" "}
          {/* Display page number and total number of pages */}
        </div>
      );
    }
    return pages;
  };

  return (
    <div className="pdf-div">
      <Document
        file={pdfProp.pdf} // Pass the PDF file to the Document component
        onLoadSuccess={onDocumentLoadSuccess} // Attach callback function to handle successful document load
      >
        <div className="pdf-container">{renderPages()}</div>
      </Document>
    </div>
  );
}

export default PdfView;
