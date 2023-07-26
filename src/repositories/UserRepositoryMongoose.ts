import mongoose from 'mongoose';

import { User } from '../entities/User';
import { UserRepository } from './UserRepository';

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: new mongoose.Types.ObjectId().toString(),
  },
  name: String,
  email: String,
});

const UserModel = mongoose.model('User', userSchema);

class UserRepositoryMongoose implements UserRepository {
  async add(user: User): Promise<User> {
    const userModel = new UserModel(user);

    await userModel.save();
    return user;
  }
  async verifyIsUserExists(email: string): Promise<User | undefined> {
    const result = await UserModel.findOne({ email }).exec();

    return result ? result.toObject() : undefined;
  }
}
export { UserRepositoryMongoose };
