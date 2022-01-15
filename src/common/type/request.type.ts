import { Request } from 'express';

export type ExtendRequest = Request & {
  user: {
    username: string;
    id: number;
  };
};
