export class Post {
  title: string;
  body: string;
  createdDate: Date;
  updatedDate: Date;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}
