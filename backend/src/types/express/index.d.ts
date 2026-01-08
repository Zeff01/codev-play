import "express";

declare module "express" {
  interface Request {
    user?: any; // this adds user to Request
  }
}
