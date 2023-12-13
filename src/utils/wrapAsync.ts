import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrapSync = (asyncFunction: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncFunction(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}
