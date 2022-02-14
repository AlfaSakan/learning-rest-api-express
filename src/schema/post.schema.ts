import { object, string, ref } from "yup";

const payload = {
  body: object({
    title: string().required("Title is requires"),
    body: string()
      .required("Body is required")
      .min(120, "Body is too short - should be 120 chars minimum"),
  }),
};

const params = {
  params: object({
    postId: string().required("PostId is required"),
  }),
};

export const createPostSchema = object({
  ...payload,
});

export const updatePostSchema = object({
  ...params,
  ...payload,
});

export const deletePostSchema = object({
  ...params,
});
