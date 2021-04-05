import { 
  Publisher,
  OrderCancelledEvent,
  Subjects
 } from "@roughtickets/common";

 export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
   readonly subject = Subjects.OrderCancelled
 }