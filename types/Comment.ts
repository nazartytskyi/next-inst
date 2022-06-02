export interface Comment {
  id: string;
  username: string;
  avatar: string;
  comment: string;
  time: Date;
}

export function getCommentFromData(
  id: string,
  username: string,
  avatar: string,
  commentText: string,
  time: Date
): Comment {
  let comment: Comment = {
    id: id,
    avatar: avatar,
    username: username,
    comment: commentText,
    time: time,
  };

  return comment;
}
