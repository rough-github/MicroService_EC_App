import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signup(id?: string): string[]
    }
  }
}

// Mocks a module with an auto-mocked version when it is being required
jest.mock('../nats-wrapper');

// 一度宣言するだけでよい
process.env.STRIPE_KEY = "";

let mongo: any; //?????
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections) {
    await collection.deleteMany({});
  }
})

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close()
})

global.signup = (id?: string) => {
  // Build a JWT payload. {id, email}
  const payload = {
    // random id
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build Session Object. {jwt: MY_JWT}
  const session = {jwt: token};

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and excode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string that the cookie with the encoded data
  return [`express:sess=${base64}`];
}