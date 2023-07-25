import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { EventRepositoryMongoose } from '../repositories/EventRepositoryMongoose';
import { EventUseCase } from '../useCases/EventUseCase';

class EventRoutes {
  public router: Router;
  private eventController: EventController;
  constructor() {
    this.router = Router();
    const eventRepository = new EventRepositoryMongoose();
    const eventUseCase = new EventUseCase(eventRepository);
    this.eventController = new EventController(eventUseCase);
    this.initRoutes();
  }
  initRoutes() {
    //http://localhost:3333/events/
    this.router.post(
      '/',
      this.eventController.create.bind(this.eventController),
    );
  }
}

export { EventRoutes };
