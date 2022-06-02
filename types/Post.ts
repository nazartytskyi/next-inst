export interface Post {
  id?: string;
  username: string;
  userImage: string;
  postImage: string;
  caption: string;
}

export function getPostFromData(
  username: string,
  userImage: string,
  postImage: string,
  caption: string,
  id?: string
): Post {
  let post: Post = {
    username: username,
    userImage: userImage,
    postImage: postImage,
    caption: caption,
  };

  if (id) post.id = id;

  return post;
}
