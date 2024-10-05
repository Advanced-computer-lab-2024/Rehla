// src/components/CreateTag.js
import React, { useState } from 'react';
import { createHistoricalTag } from '../services/api';

const CreateTag = () => {
    const [name, setName] = useState('');
    const [historicalPeriod, setHistoricalPeriod] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setLoading(true); // Start loading state
        setError(null); // Clear previous errors
        setSuccessMessage(null); // Clear previous success message

        try {
            const tagData = {
                Name: name,
                Historical_Period: historicalPeriod,
                Type: type,
            };

            const result = await createHistoricalTag(tagData); // Call the API function
            setSuccessMessage(result.message); // Show success message
            // Reset form fields
            setName('');
            setHistoricalPeriod('');
            setType('');
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Error creating tag');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <h1>Create Historical Tag</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Historical Period:
                        <input 
                            type="text" 
                            value={historicalPeriod} 
                            onChange={(e) => setHistoricalPeriod(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Type:
                        <input 
                            type="text" 
                            value={type} 
                            onChange={(e) => setType(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Tag'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default CreateTag;
