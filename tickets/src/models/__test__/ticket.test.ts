import { Ticket } from "../ticket";

it('impoloements optimistic concurrently control', async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123"
  });

  // Save th eticket to the database
  await ticket.save();

  // Fetch the tiket twince
  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  // Make two seperate change to the tickets we fetched
  firstTicket!.set({price: 100});
  secondTicket!.set({price: 50});

  // Save the first fetched ticket
  await firstTicket!.save()

  // Save the second fetched ticket and expect error
  // rejects -> Unwraps the reason of a rejected promise so any other matcher can be chained. If the promise is fulfilled the assertion fails
  // toThrow -> Used to test that a function throws when it is called@
  await expect(secondTicket!.save()).rejects.toThrow();
});

it('increment the version number on multiple save', async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123"
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
})