import { useState } from 'react';

function InputField() {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSearch = async () => {
        if (!inputValue.trim()) {
            alert('Please enter a query.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: inputValue }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch data from the server.');
            }

            const data = await res.json();
            setResponse(data.response || 'No response received.'); // Update based on API response structure
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter your query"
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginBottom: '10px',
                }}
            />
            <button
                onClick={handleSearch}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
                disabled={loading}
            >
                {loading ? 'Searching...' : 'Search'}
            </button>
            {response && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '80%',
                        textAlign: 'center',
                    }}
                >
                    <strong>Response:</strong>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}

export default InputField;
