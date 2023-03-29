import { ID } from "../../../domain/entities/Entity";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (blogId: ID, { blogRepository }: ServiceLocator) => {
  const blog = await blogRepository!.get(blogId);
  if (!blog) {
    throw new Error("no record found");
  }
  return blog;
};
