import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedLsitener } from "../order-created-listener";
import {
  OrderCreatedEvent,
  OrderStatus
} from "@roughtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedLsitener(natsWrapper.client);

  // Create ans save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "badda"
  });
  await ticket.save();

  // Create th efake data event
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "badda",
    expiresAt: "dabadbda",
    ticket: {
        id: ticket.id,
        price: ticket.price,
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, ticket, data, msg};
}

it('sets the userId of the ticket', async () => {
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
})

it('acks the message', async () => {
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event', async () => {
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // string -> JSON
  const updatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(data.id).toEqual(updatedData.orderId);
})