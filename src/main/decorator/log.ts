import { LogErrorRepository } from "../../data/protocol/log-error-repository";
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocol";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500)
      this.logErrorRepository.logError(httpResponse.body.stack)

    return httpResponse
  }
}