import { Express, Request, Response } from "express";

import { createUserHandler } from "./controller/user.controller";
import {
  createUserSessionHandler,
  getUserSessionHandler,
  invalidateUserSessionHandler,
} from "./controller/session.controller";

import { validateRequest, requiresUser } from "./middleware";

import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";

export default function (app: Express) {
  app.get("/healthCheck", (req: Request, res: Response) => res.sendStatus(200));

  // Register User
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // Login User
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // Get user's session
  app.get("/api/sessions", requiresUser, getUserSessionHandler);

  // Logout
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);
}
