/**
 * Sanitizes errors for API responses
 */
const handleAPIError = (err: any) => {
    console.error(err);

    if (err.hasOwnProperty('status') && err.hasOwnProperty('message')) {
        return [ 
            { error: err["message"] }, 
            { status: err["status"] } 
        ];
    }

    return [ 
        { error: "An error occurred"}, 
        { status: "500" } 
    ];
};

export default handleAPIError;