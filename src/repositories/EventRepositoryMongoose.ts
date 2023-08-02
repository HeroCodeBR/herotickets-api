import mongoose from 'mongoose';
import { Event } from '../entities/Event';
import { Location } from '../entities/Location';
import { EventRepository } from './EventRepository';

const eventSchema = new mongoose.Schema({
  title: String,
  location: {
    latitude: String,
    longitude: String,
  },
  date: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: String,
  categories: [String],
  banner: String,
  flyers: [String],
  price: {
    type: Array,
  },
  city: String,
  formattedAddress: String,
  participants: {
    type: Array,
    ref: 'User',
  },
});

const EventModel = mongoose.model('Event', eventSchema);

class EventRepositoryMongoose implements EventRepository {
  async add(event: Event): Promise<Event> {
    const eventModel = new EventModel(event);

    await eventModel.save();
    return event;
  }
  async findByLocationAndDate(
    location: Location,
    date: Date,
  ): Promise<Event | undefined> {
    const findEvent = await EventModel.findOne({ location, date }).exec();

    return findEvent ? findEvent.toObject() : undefined;
  }
  async findEventById(id: string): Promise<Event | undefined> {
    const findEvent = await EventModel.findOne({ _id: id }).exec();

    return findEvent ? findEvent.toObject() : undefined;
  }
  async findEventsByCity(city: string): Promise<Event[]> {
    const findEvent = await EventModel.find({ city }).exec();

    return findEvent.map((event) => event.toObject());
  }
  async findEventsByCategory(category: string): Promise<Event[]> {
    const findEvent = await EventModel.find({ categories: category }).exec();

    return findEvent.map((event) => event.toObject());
  }
  async findEventsMain(date: Date): Promise<Event[]> {
    const endDate = new Date(date);
    endDate.setMonth(endDate.getMonth() + 1);
    const findEvent = await EventModel.find({
      date: { $gte: date, $lt: endDate },
    })
      .limit(4)
      .exec();

    return findEvent.map((event) => event.toObject());
  }
  async update(event: Event, id: string): Promise<any> {
    const eventUpdate = await EventModel.updateMany({ _id: id }, event);
    console.log(
      '🚀 ~ file: EventRepositoryMongoose.ts:65 ~ EventRepositoryMongoose ~ update ~ eventUpdate:',
      eventUpdate,
    );
    return event;
  }
  async findEventsByName(name: string): Promise<Event[]> {
    const findEvent = await EventModel.find({
      title: {
        $regex: name,
        $options: 'i',
      },
    }).exec();

    return findEvent.map((event) => event.toObject());
  }
  async findEventsByFilter(
    name: string,
    date: Date,
    category: string,
    price: string,
  ): Promise<Event[]> {
    const findEvent = await EventModel.find({
      title: {
        $regex: name,
        $options: 'i',
      },
    }).exec();

    return findEvent.map((event) => event.toObject());
  }
}
export { EventRepositoryMongoose };
