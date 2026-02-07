import http, { Server } from "http";
import app from "./app";
import dotenv from "dotenv";
import { prisma } from "../config/db";

dotenv.config();

let server: Server | null = null;

let isConnected = false;

async function connectToDB() {
  if (isConnected) return;
  await prisma.$connect();
  console.log("*** DB connected");
  isConnected = true;
}
export default async function handler(req: any, res: any) {
  await connectToDB();
  return app(req, res);
}

async function startServer() {
  try {
    await connectToDB()
    server = http.createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

    handleProcessEvents();
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
}

/**
 * Gracefully shutdown the server and close database connections.
 * @param {string} signal - The termination signal received.
 */
async function gracefulShutdown(signal: string) {
  console.warn(`🔄 Received ${signal}, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("✅ HTTP server closed.");

      try {
        await prisma.$disconnect();
        console.log("✅ Prisma disconnected.");
        console.log("Server shutdown complete.");
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
      }

      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
}


/**
 * Handle system signals and unexpected errors.
 */
function handleProcessEvents() {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}

startServer();
