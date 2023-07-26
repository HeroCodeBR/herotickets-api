import { User } from '../entities/User';

interface UserRepository {
  add(user: User): Promise<User>;
  verifyIsUserExists(email: string): Promise<any>;
}

export { UserRepository };
