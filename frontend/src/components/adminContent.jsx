import React from 'react';
import { Button } from 'react-bootstrap'; // Import Button component
import NAV from './navbar';

const AdminContent = ({handleContent}) => {
    function handleDownload(e) {
        handleContent(2)
    }

    function handleUpload(e) {
        handleContent(3)
        
    }

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center vh-100 custom-bg">
                <div className="d-flex flex-column">
                    <NAV />
                </div>
                <div className="d-flex flex-column"> {/* Flex container for buttons */}
                    <div className="mb-2"> {/* Margin between buttons */}
                        <Button onClick={handleDownload}>Download Paper</Button>
                    </div>
                    <div>
                        <Button onClick={handleUpload}>Upload Paper</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContent;
