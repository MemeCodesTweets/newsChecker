import { useState } from "react";
import InputFor from "./Input";
import StackedNotifications from "./StackedNotifications";

function InputField() {
    const [response, setResponse] = useState("");
    const [citation, setCitation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [notification, setNotification] = useState(null);

    const isValidUrl = (url) => {
        const pattern = new RegExp(
            "^(https?:\\/\\/)?(([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}|localhost|\\d{1,3}(\\.\\d{1,3}){3})(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*(\\?[;&a-zA-Z0-9%_.~+=-]*)?(\\#[-a-zA-Z0-9_]*)?$",
            "i"
        );
        return pattern.test(url);
    };

    const handleSearch = async (inputValue) => {
        if (!isValidUrl(inputValue)) {
            setNotification({
                id: Math.random(),
                text: "Please enter a valid URL.",
                type: "error",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/query?question=${encodeURIComponent(inputValue)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (res.status === 500) {
                setNotification({
                    id: Math.random(),
                    text: "Error fetching data from this URL.",
                    type: "error",
                });
                setLoading(false);
                return;
            }

            const data = await res.json();
            const formattedResponse = formatResponse(data?.answer?.choices[0].message.content || "No answer received.");
            const responseCitation = data?.answer?.citations || "No citation received.";

            setIsCorrect(formattedResponse[0] === "Y");
            setCitation(responseCitation);
            setResponse(formattedResponse);
        } catch (error) {
            console.error("Error fetching data:", error);
            setNotification({
                id: Math.random(),
                text: "Error fetching data. Please try again.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatResponse = (text) => {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        formattedText = formattedText.replace(/\n/g, "<br>");
        formattedText = formattedText.replace(/(\d+)\.\s/g, "<li>$1. </li>");
        if (formattedText.includes("<li>")) {
            formattedText = formattedText.replace(/(<li>.*<\/li>)/g, "<ol>$1</ol>");
        }
        return formattedText;
    };

    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br">
            <StackedNotifications notification={notification} setNotification={setNotification} />

            <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12">
                {loading ? (
                    <div className="w-full sm:w-3/4 md:w-2/3 p-4 bg-zinc-900 border border-white rounded-md shadow-md animate-pulse">
                        <div className="animate-pulse">
                            <div className="h-12 bg-gray-500 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-500 rounded mb-2"></div>
                            <div className="h-8 bg-gray-500 rounded mb-2"></div>
                            <div className="h-8 bg-gray-500 rounded"></div>
                        </div>
                    </div>
                ) : !response ? (
                    // Hero Section
                    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-2/3 xl:w-2/3 bg-black border-2 border-indigo-400 bg-gradient-to-br from-white/20 to-white/5 text-white text-center p-8 rounded-lg shadow-lg md:m-4 lg:m-8 flex flex-col md:flex-row items-center">
                        <div className="text-center md:text-left md:w-2/3">
                            <h1 className="text-4xl font-bold mb-4">Don't Get RUGged!</h1>
                            <p className="text-lg mb-4 md:text-base lg:text-lg">
                                Aped a token with fake narrative and it dumped? Sounds relatable right? <br />
                                FactCheck AI helps you identify fake websites and protect your precious Solamis.
                            </p>
                            <p className="text-md italic md:text-sm lg:text-base">
                                Your trusted AI assistant for verifying facts. Enter a URL to get started.
                            </p>
                        </div>
                        <div className="hidden md:block md:w-1/3">
                            <img src="/RugPull.gif" alt="Rugged" className="w-full rounded-md h-auto object-cover" />
                        </div>
                    </div>
                ) : (
                    // Summary Section
                    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-2/3 xl:w-2/3 bg-zinc-900 border border-white rounded-md shadow-md p-4 mt-8 overflow-x-auto">
                        <div className="text-center mb-4">
                            {isCorrect !== null && (
                                <div
                                    className={`p-2 rounded-md shadow-md text-white text-sm md:text-lg font-semibold ${isCorrect ? "bg-green-500" : "bg-red-500"}`}
                                >
                                    {isCorrect ? "The news is correct." : "The news is incorrect."}
                                </div>
                            )}
                        </div>

                        {response && (
                            <div className="mt-4 text-white">
                                <h2 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-2">Summary:</h2>
                                <div dangerouslySetInnerHTML={{ __html: response }} className="text-xs sm:text-sm md:text-base" />
                            </div>
                        )}

                        {citation && (
                            <div className="mt-4 text-white">
                                <h2 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-2">Citations:</h2>
                                <ol className="list-decimal list-inside text-xs sm:text-sm md:text-base">
                                    {Array.isArray(citation) && citation.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.trim()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                {link.trim()}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 w-full py-4 px-4 flex justify-center">
                <InputFor onSearch={handleSearch} isSearchEnabled={!loading} />
            </div>
        </div>
    );
}

export default InputField;
