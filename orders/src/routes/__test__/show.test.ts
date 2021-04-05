import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";

it('frtches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20
  });
  await ticket.save();

  const user = global.signup();
  // make a request to build an order with this ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201);

  // make request to fetach the order
  const {body: fetchOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(order.id).toEqual(fetchOrder.id);
})
it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20
  });
  await ticket.save();

  const userOne = global.signup();
  const userTwo = global.signup();
  // make a request to build an order with this ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ticketId: ticket.id})
    .expect(201);

  // make request to fetach the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
})