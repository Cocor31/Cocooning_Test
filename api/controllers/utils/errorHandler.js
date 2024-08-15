const handleServerError = (res, err, message = "Internal Server Error") => {
    const mode = process.env.MODE;

    if (mode === 'DEV') {
        console.log(err);

        if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
            message = "Database Error";
        } else if (err.name === 'Error') {
            const formattedStack = err.stack ? err.stack.split('\n') : [];
            err = {
                name: err.name || 'Error',
                message: err.message || message,
                stack: mode === 'DEV' ? formattedStack : undefined // Inclure le stack en mode développement uniquement
            };
        }

        return res.status(500).json({ message: message, error: err });
    } else {
        // En mode production, renvoyer uniquement le message d'erreur sans les détails
        return res.status(500).json({ message: message });
    }
};

const handleNotFoundError = (res, message) => {
    return res.status(404).json({ message: message });
};

const handleBadRequestError = (res, message) => {
    return res.status(400).json({ message: message });
};

const handleUnauthorizedError = (res, message) => {
    return res.status(401).json({ message: message });
};

module.exports = { handleServerError, handleNotFoundError, handleBadRequestError, handleUnauthorizedError };
