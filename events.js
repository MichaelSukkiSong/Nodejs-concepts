// when we are trying to use our custom events in our application.
const EventEmitter = require("events");
const http = require("http");

// extending the eventemitter class is how different node modules like http, fs and many other node core modules implements events internally. all of them actually inherit from the eventemitter class.
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Costumer name: Jonas");
});

myEmitter.on("newSale", stock => {
  console.log(`There are now ${stock} items left in stock.`);
});

// we emit the event ourself. we can pass additional argument as well.
myEmitter.emit("newSale", 9);

//////////////////////////////////////////////////////////////////////////////////
// as soon as there is a new request, the server automatically emits the request object.
// if we are using a built-in node module, the functions in there will many times emit there own events and we only have to listen to them.

const server = http.createServer();

// first event listener
server.on("request", (req, res) => {
  console.log("Request received!");
  console.log(req.url);
  res.end("Request received");
});

// second event listener
server.on("request", (req, res) => {
  console.log("Another request :D");
});

server.on("close", () => {
  console.log("Server closed");
});

// start server
server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});
