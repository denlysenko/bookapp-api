export interface User {
  _id: string;
  authenticate?: (password) => boolean;
}
