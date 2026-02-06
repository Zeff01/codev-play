import morgan, { StreamOptions } from "morgan";
import logger from "../utils/logger";

// Stream for Morgan to use Winston
const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Skip logging in test environment
const skip = () => {
  return process.env.NODE_ENV === "test";
};

// Morgan middleware configured to use Winston
const requestLogger = morgan(":method :url :status :res[content-length] - :response-time ms", {
  stream,
  skip,
});

export default requestLogger;
