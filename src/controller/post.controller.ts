import { Request, Response } from "express";
import { get } from "lodash";
import { createPost, findPost, findAndUpdate, deletePost } from "../service/post.service";

export const createPostHandler = async (req: Request, res: Response) => {
  const userId = get(req, "user._id");
  const body = req.body;

  const post = await createPost({ ...body, user: userId });

  return res.send(post);
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const userId = get(req, "user._id");
  const postId = get(req, "params.postId");
  const update = req.body;

  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  if (String(post.user) !== String(userId)) {
    return res.sendStatus(404);
  }

  const updatePost = await findAndUpdate({ postId }, update, { new: true });

  return res.send(updatePost);
};

export const getPostHandler = async (req: Request, res: Response) => {
  const postId = get(req, "params.postId");

  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  return res.send(post);
};

export const deletePostHandler = async (req: Request, res: Response) => {
  const userId = get(req, "user._id");
  const postId = get(req, "params.postId");

  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  if (String(post.user) !== String(userId)) {
    return res.sendStatus(404);
  }

  await deletePost({ postId });

  return res.sendStatus(200);
};
