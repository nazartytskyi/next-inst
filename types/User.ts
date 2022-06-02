export interface User {
  id?: number;
  publications?: number;
  username: string;
  avatar: string;
  company?: string;
}

export function getUserFromData(username: string, avatar: string, { id = 0, company = '', publications = 0 }): User {
  let user: User = {
    avatar: avatar,
    username: username,
  };

  if (publications) user.publications = publications;
  if (company) user.company = company;
  if (id) user.id = id;

  return user;
}
