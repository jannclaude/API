import { Router } from 'express';

export interface LoginInfo {
  username: string;
  password: string;
}

export interface APIRoute {
  (endpoint: string, router: Router): Router;
}
