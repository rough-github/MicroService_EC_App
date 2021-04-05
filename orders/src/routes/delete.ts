import express, {Request, Response} from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth
} from "@roughtickets/common";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cencelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
  const {orderId} = req.params;

  const order = await Order.findById(orderId).populate('ticket')
  console.log(order);
  if(!order) {
    throw new NotFoundError();
  }
  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  // Cancell
  order.status = OrderStatus.Cancelled;
  await order.save();

  // pushing an event saying this was cencelled
  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id
    }
  })


  res.status(204).send(order);
})

export {router as deleteOrderRouter};