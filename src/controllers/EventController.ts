import { NextFunction, Request, Response } from 'express';
import { EventUseCase } from '../useCases/EventUseCase';

class EventController {
  constructor(private eventUseCase: EventUseCase) {}
  async create(request: Request, response: Response, next: NextFunction) {
    const eventData = request.body;
    try {
      await this.eventUseCase.create(eventData);
      return response
        .status(201)
        .json({ message: 'Evento criado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
}

export { EventController };
