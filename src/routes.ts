import { Express, Request, Response } from "express";
import { createUserHandler } from "./controller/user.controller";
import validateRequest from "./middleware/validateRequest";
import { createUserSchema } from "./schema/user.schema";

export default function (app: Express) {
  app.get("/healthCheck", (req: Request, res: Response) => res.sendStatus(200));

  // Register User
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // Login User
  // POST /api/login

  // Get user's session
  // GET /api/sessions

  // Logout
  // DELETE /api/sessions
}
