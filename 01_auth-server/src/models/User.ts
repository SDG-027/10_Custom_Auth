import { model, Schema } from 'mongoose';

const readingListSchema = new Schema({
  bookRefId: {
    type: Schema.Types.ObjectId,
    ref: 'book',
    required: true
  },
  status: {
    type: String,
    enum: ['read', 'pending', 'waiting list', 'unknown', 'lend'],
    default: 'unknown'
  }
});

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  // username: {
  //   type: String,
  //   unique: true
  // },
  password: {
    type: String,
    select: false
  },
  readingList: [readingListSchema]
});

const User = model('User', userSchema);
export default User;
