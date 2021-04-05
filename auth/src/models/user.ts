import mongoose from "mongoose";
import {Password} from "../services/password";

// An interface that dscribes the eproperties
// that are required to create a new user
interface UserAttrs {
  email: string
  password: string
}

// An interface that describes the eproperties
// that a User Model has
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // createdAt: string;
  // updatedAt: string;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  // formatting(delete password properties in res object)
  // toJSON - JSON.stringify()
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

UserSchema.pre('save', async function(done) {
  if(this.isModified("password")) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

const User = mongoose.model<UserDoc, UserModel>("user", UserSchema);

export {User};