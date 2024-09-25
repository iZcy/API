const corsOptions = {
  origin: (origin, callback) => {
    // Temporarily allow all origins for testing
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV === "production"
    ) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
