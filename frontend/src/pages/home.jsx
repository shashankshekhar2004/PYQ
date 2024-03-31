import React from 'react';
import NAV from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Home = () => {
    const navigate = useNavigate();

    function handlePreviousYearPaper() {
        navigate('/previous');
    }
    function handleUploadPaper() {
        navigate('/upload');
    }
    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100 custom-bg">
                <div className="d-flex flex-column">
                    <NAV />
                </div>
                <div className="d-flex flex-column"> {/* Flex container for buttons */}
                    <div className="mb-2"> {/* Margin between buttons */}
                        <Button onClick={handlePreviousYearPaper} size="lg">Previous Year Paper</Button>
                    </div>
                    <div>
                        <Button onClick={handleUploadPaper} size="lg">Upload New Paper</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
