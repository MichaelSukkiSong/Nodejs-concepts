const fs = require("fs");

// all the functions from crypto will be offloaded automatically by the eventloop to the threadpool. we are going to test that here.
const crypto = require("crypto");
// To know the amount of time passed doing the calculation below
const start = Date.now();
// We can change the threadpool size(default is 4)
process.env.UV_THREADPOOL_SIZE = 3;

// To simulate some aspects of the event loop, the following example was used
setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("-----------------");

  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick"));

  // To introduce about threadpools, the folllowing example was used. these functions are async.
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  // if we use sync versions it will block the eventloop. it will encrypt the password, block the code execution and then move on to the next line and console log.
  // these 4 password encryptions will no longer run in the eventloop, so they will no longer be offloaded to the threadpool.
  /*
  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");
  */
});

console.log("Hello from the top-level code");

// additional info about event loops from the previous lecture (a.k.a the reason why the 'Immediate 2 finished' is console.loged first)
/*
The event loop actually waits for stuff to happen in the poll phase.
So in that phase where I/O callbacks are handled.
So when this queue of callbacks is empty which is the case in this fictional example here(we have no I/O callbacks we only have timers), then the eventloop will
wait in this phase until there is an expired timer. But if we scheduled a callback using setImmediate then that callback will actually be executed right away after
the polling phase and even before expired timers if there is one. In this case the timer expires right away, so after 0 seconds but again the event loop actually
wait in the polling phase. and so that setImmeidate callback is actually executed first.
*/
/*
nextTick is actually a misleading name. because a tick is actually an entire loop. and in that loop there is phases.
nextTick actually happens before the next loop phase and not the entire tick.
setImmediate is not executed immediately which is wrong.
setImmediate actually gets executed once per tick while nextTick gets executed immediately.
The two names(nextTick, setImmediate) should be switched actually because it can cause confusion.
*/
