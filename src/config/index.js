const path = require("path")

const ROOT = path.resolve(__dirname, "../")

const {
  NODE_ENV = "development",
  PORT = 8080,
  HOST = "localhost",
  JWT_SECRET = "unGu3sSaBlE",
  MONGO_URI = "mongodb://mongo:27017/tasks",
} = process.env

const isProd = NODE_ENV === "production"
const isTest = NODE_ENV === "test"
const isDev = NODE_ENV === "development"

module.exports = {
  server: {
    port: PORT,
    host: HOST,
    root: ROOT,
  },

  env: {
    env: NODE_ENV,
    isDev,
    isProd,
    isTest,
  },

  cors: {
    origin: "*",
    exposeHeaders: ["Authorization"],
    credentials: true,
    allowMethods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    keepHeadersOnError: true,
  },

  bodyParser: {
    enableTypes: ["json"],
  },

  mongoURI: MONGO_URI,

  jwtSecret: JWT_SECRET,
  jwtOptions: {
    expiresIn: "7d",
  },
}
