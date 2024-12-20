import { useState } from 'react';

function InputField() {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState('');
    const [citation, setCitation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const isValidUrl = (url) => {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' +
                '((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|' +
                'localhost|' +
                '\\d{1,3}(\\.\\d{1,3}){3})' +
                '(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*' +
                '(\\?[;&a-zA-Z0-9%_.~+=-]*)?' +
                '(\\#[-a-zA-Z0-9_]*)?$',
            'i'
        );
        return pattern.test(url);
    };

    const handleSearch = async () => {
        if (!inputValue.trim()) {
            alert('Please enter a valid URL.');
            return;
        }

        if (!isValidUrl(inputValue)) {
            alert('The input is not a valid URL. Please enter a correct URL.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`http://localhost:3000/api/perplexity?question=${encodeURIComponent(inputValue)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 500) {
                setResponse('<p>Error fetching data from this URL. Please enter correct URL.</p>');
                setLoading(false);
                return;
            }

            const data = await res.json();
            const formattedResponse = formatResponse(data?.answer?.choices[0].message.content || 'No answer received.');
            const responseCitation = data?.answer?.citations || 'No citation received.';

            if (formattedResponse[0] === 'Y') {
                setIsCorrect(true);
            } else if (formattedResponse[0] === 'N') {
                setIsCorrect(false);
            } else {
                setIsCorrect(null);
            }

            setCitation(responseCitation);
            setResponse(formattedResponse);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('<p>Error fetching data. Please try again.</p>');
        } finally {
            setLoading(false);
        }
    };

    const formatResponse = (text) => {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\n/g, '<br>');
        formattedText = formattedText.replace(/(\d+)\.\s/g, '<li>$1. </li>');

        if (formattedText.includes('<li>')) {
            formattedText = formattedText.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>');
        }

        return formattedText;
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">URL Content Verifier</h1>
            <label htmlFor="urlInput" className="text-lg font-medium text-gray-700 mb-2">
                Enter a URL to verify its content:
            </label>
            <input
                id="urlInput"
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter the URL"
                className="p-3 text-lg border border-gray-300 rounded-md mb-4 w-4/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch}
                className={`px-6 py-3 text-lg text-white rounded-md ${
                    loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={loading}
            >
                {loading ? 'Searching...' : 'Search'}
            </button>

            {isCorrect !== null && (
                <div
                    className={`mt-6 p-4 w-4/5 rounded-md shadow-md text-center text-white text-lg font-semibold ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {isCorrect ? 'The news is correct.' : 'The news is incorrect.'}
                </div>
            )}

            {response && (
                <div className="mt-6 p-4 bg-white border border-gray-300 rounded-md w-4/5 shadow-md overflow-auto">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Summary:</h2>
                    <div dangerouslySetInnerHTML={{ __html: response }}></div>
                </div>
            )}

            {citation && (
                <div className="mt-6 p-4 bg-white border border-gray-300 rounded-md w-4/5 shadow-md overflow-auto">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Citations:</h2>
                    <div dangerouslySetInnerHTML={{ __html: citation }}></div>
                </div>
            )}
        </div>
    );
}

export default InputField;
