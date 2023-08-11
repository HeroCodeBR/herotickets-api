import axios from 'axios';
import { Event } from '../entities/Event';
import { HttpException } from '../interfaces/HttpException';
import { EventRepository } from '../repositories/EventRepository';
import { UserRepositoryMongoose } from '../repositories/UserRepositoryMongoose';
export interface IFilterProps {
  latitude: number;
  longitude: number;
  name: string;
  date: string;
  category: string;
  radius: number;
  price: number;
}
class EventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async create(eventData: Event) {
    if (!eventData.banner) {
      throw new HttpException(400, 'Banner is required');
    }
    if (!eventData.flyers) throw new HttpException(400, 'Flyers is required');
    if (!eventData.date) throw new HttpException(400, 'Date is required');

    if (!eventData.location)
      throw new HttpException(400, 'Location is required');

    //verificar se ja existe um evento no mesmo local e horario
    const verifyEvent = await this.eventRepository.findByLocationAndDate(
      eventData.location,
      eventData.date,
    );
    if (verifyEvent) throw new HttpException(400, 'Event already exists');

    const cityName = await this.getCityNameByCoordinates(
      eventData.location.latitude,
      eventData.location.longitude,
    );
    eventData = {
      ...eventData,
      city: cityName.cityName,
      formattedAddress: cityName.formattedAddress,
    };

    const result = await this.eventRepository.add(eventData);
    return result;
  }

  async findEventByLocation(latitude: string, longitude: string) {
    const cityName = await this.getCityNameByCoordinates(latitude, longitude);

    const findEventsByCity = await this.eventRepository.findEventsByCity(
      cityName.cityName,
    );

    const eventWithRadius = findEventsByCity.filter((event) => {
      const distance = this.calculateDistance(
        Number(latitude),
        Number(longitude),
        Number(event.location.latitude),
        Number(event.location.longitude),
      );
      return distance <= 100;
    });

    return eventWithRadius;
  }
  async findEventsByCategory(category: string) {
    if (!category) throw new HttpException(400, 'Category is required');
    const events = await this.eventRepository.findEventsByCategory(category);

    return events;
  }
  async filterEvents({
    latitude,
    longitude,
    name,
    date,
    category,
    radius,
    price,
  }: IFilterProps) {
    const events = await this.eventRepository.findEventsByFilter({
      latitude,
      longitude,
      name,
      date,
      category,
      radius,
      price,
    });

    return events;
  }
  async findEventsMain() {
    const events = await this.eventRepository.findEventsMain(new Date());

    return events;
  }
  async findEventsByName(name: string) {
    if (!name) throw new HttpException(400, 'Name is required');
    const events = await this.eventRepository.findEventsByName(name);

    return events;
  }
  async findEventsById(id: string) {
    if (!id) throw new HttpException(400, 'Id is required');
    const events = await this.eventRepository.findEventById(id);

    return events;
  }
  async addParticipant(id: string, name: string, email: string) {
    const event = await this.eventRepository.findEventById(id);

    if (!event) throw new HttpException(400, 'Event not found');

    const userRepository = new UserRepositoryMongoose();
    const participant = {
      name,
      email,
    };
    let user: any = {};
    const verifyIsUserExists = await userRepository.verifyIsUserExists(email);
    if (!verifyIsUserExists) {
      user = await userRepository.add(participant);
    } else {
      user = verifyIsUserExists;
    }
    if (event.participants.includes(user._id))
      throw new HttpException(400, 'User already exists');

    event.participants.push(user._id);

    const updateEvent = await this.eventRepository.update(event, id);
    console.log(
      '🚀 ~ file: EventUseCase.ts:91 ~ EventUseCase ~ addParticipant ~ updateEvent:',
      updateEvent,
    );
    return event;
  }

  private async getCityNameByCoordinates(latitude: string, longitude: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAhKk5549E8oy5zs-cxAqvy3_j3jDQJoBo`,
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const address = response.data.results[0].address_components;
        const cityType = address.find(
          (type: any) =>
            type.types.includes('administrative_area_level_2') &&
            type.types.includes('political'),
        );
        const formattedAddress = response.data.results[0].formatted_address;

        return {
          cityName: cityType.long_name,
          formattedAddress,
        };
      }
      throw new HttpException(404, 'City not found');
    } catch (error) {
      throw new HttpException(401, 'Error request city name');
    }
  }
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em quilômetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export { EventUseCase };
