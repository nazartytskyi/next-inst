export interface Like {
  id: string;
  username: string;
}

export function getLikeFromData(id: string, username: string): Like {
  let like: Like = {
    id: id,
    username: username,
  };

  return like;
}
