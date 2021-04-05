export const natsWrapper = {
  client: {
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // }

    // Accepts a function that should be used as the implementation of the mock. The mock itself will still record all calls that go into and instances that come from itself – the only difference is that the implementation will also be executed when the mock is called
    publish: jest.fn().mockImplementation((
      subject: string, data: string, callback: () => void
    ) => {
      callback();
    })
  }
};