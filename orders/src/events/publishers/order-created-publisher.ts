import { 
  Publisher,
  OrderCreatedEvent,
  Subjects
 } from "@roughtickets/common";

 export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
   readonly subject = Subjects.OrderCreated
 }