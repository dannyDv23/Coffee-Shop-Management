const getToken = () => {
    return localStorage.getItem('accessToken');
};

const apiFetch = async (url, options = {}) => {
    try {
        // Get the token
        const token = getToken();

        // Merge the provided options with default ones
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const finalOptions = { ...defaultOptions, ...options };

        const response = await fetch(url, finalOptions);

        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};


export { apiFetch };
