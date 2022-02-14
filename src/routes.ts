import { Express, Request, Response } from "express";

import { createUserHandler } from "./controller/user.controller";
import {
  createUserSessionHandler,
  getUserSessionHandler,
  invalidateUserSessionHandler,
} from "./controller/session.controller";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  updatePostHandler,
} from "./controller/post.controller";

import { validateRequest, requiresUser } from "./middleware";

import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from "./schema/post.schema";

export default function (app: Express) {
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

  // create a post
  app.post(
    "/api/posts",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  // Update a post
  app.put(
    "/api/posts/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  // Get a post
  app.get("/api/posts/:postId", getPostHandler);

  // Delete a post
  app.delete(
    "/api/posts/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
