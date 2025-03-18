const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
  
    // Default error status and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    // Send the error response
    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.stack : {}, // Include stack trace in development only
    });
  };
  
  module.exports = errorHandler;