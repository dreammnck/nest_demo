export class User {
  id: number;
  username: string;
  password: string;
  createdDate: Date;
  updatedDate: Date;
  deletedDate: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
