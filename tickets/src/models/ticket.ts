import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  title: string,
  price: number,
  userId: string
}

interface TicketDoc extends mongoose.Document {
  title: string,
  price: number,
  userId: string,
  version: number,
  // 購入時
  orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})
// Sets a schema option
ticketSchema.set('versionKey', "version");
// Registers a plugin for this schema
// This plugin brings optimistic concurrency control to Mongoose documents by incrementing document version numbers on each save, and preventing previous versions of a document from being saved over the current version.
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)