import { Event } from '../entities/Event';

interface EventRepository {
  add(event: Event): Promise<Event>;
}

export { EventRepository };
