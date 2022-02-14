import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

import Post, { PostDocument } from "../model/post.model";

export const createPost = (input: DocumentDefinition<PostDocument>) => {
  return Post.create(input);
};

export const findPost = (
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
) => {
  return Post.findOne(query, {}, options);
};

export const findAndUpdate = (
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
) => {
  return Post.findOneAndUpdate(query, update, options);
};

export const deletePost = (query: FilterQuery<PostDocument>) => {
  return Post.deleteOne(query);
};
