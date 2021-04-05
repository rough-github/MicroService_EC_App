import { Message } from "node-nats-streaming";
import { 
  Listener,
  OrderCreatedEvent,
  Subjects
 } from "@roughtickets/common";
 import { queueGroupName } from "./queue-group-name";
 import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // 有効期間
    // Waiting this many miliseconds to process the job
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({
      orderId: data.id
    }, {
      // An amount of miliseconds to wait until this job can be processed. Note that for accurate delays, both server and clients should have their clocks synchronized
      delay
    });

    msg.ack();
  }
}