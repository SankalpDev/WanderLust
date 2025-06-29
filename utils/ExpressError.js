class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // properly sets the message on the Error object
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
