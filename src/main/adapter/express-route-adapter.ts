import { Request, Response } from "express";
import { Controller, HttpRequest } from "../../presentation/protocol";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode !== 200
      && httpResponse.statusCode !== 201)
      res.status(httpResponse.statusCode).json(httpResponse.body.message)
    else
      res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}