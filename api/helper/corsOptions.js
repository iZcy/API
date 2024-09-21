const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", undefined] // undefined allows Postman and anonymous access
    : [process.env.FE_URL];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.) or from allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS error: Origin ${origin} not allowed`);
      callback(new Error(`${origin} Not allowed by CORS`));
    }
  },
  credentials: true, // Ensure credentials are allowed
  optionsSuccessStatus: 200 // Response status for successful preflight requests
};

module.exports = corsOptions;
