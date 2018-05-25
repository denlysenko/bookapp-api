export interface Log {
  _id: string;
  action: string;
  userId: string;
  createdAt: Date;
  book: {
    title: string;
    quthor: string;
  };
}
