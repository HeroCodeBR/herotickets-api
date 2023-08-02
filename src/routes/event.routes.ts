import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { upload } from '../infra/multer';
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
    this.router.post(
      '/',
      upload.fields([
        {
          name: 'banner',
          maxCount: 1,
        },
        {
          name: 'flyers',
          maxCount: 3,
        },
      ]),
      this.eventController.create.bind(this.eventController),
    );
    this.router.get(
      '/',
      this.eventController.findEventByLocation.bind(this.eventController),
    );
    this.router.get(
      '/filter',
      this.eventController.filterEvents.bind(this.eventController),
    );
    this.router.get(
      '/:id',
      this.eventController.findEventsById.bind(this.eventController),
    );
    this.router.get(
      '/category/:category',
      this.eventController.findEventsByCategory.bind(this.eventController),
    );
    this.router.get(
      '/main',
      this.eventController.findMainEvents.bind(this.eventController),
    );
    this.router.post(
      '/:id/participants',
      this.eventController.addParticipant.bind(this.eventController),
    );
  }
}

export { EventRoutes };
