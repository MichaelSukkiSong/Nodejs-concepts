// If we need to read a large text file from the fs and then send it to the client...

const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1 (변수에 한번에 데이터를 저장하고, 데이터를 통째로 클라이언트에 보내는 방법)
  /*
  fs.readFile("test-file.txt", (err, data) => {
    if (err) console.log(err);

    // we did no streaming in this case, but in the end just send some data.
    res.end(data);
  });
  */
  // Solution 2: Streams (read one piece of the file, and as soon as that is available we send it right to the client using the write method of the response stream)
  /*
  const readable = fs.createReadStream("test-file.txt");

  // each time there is a new piece of data that we can consume, a readable stream emmits the data event, and so we can listen to that.
  readable.on("data", chunk => {
    // write the piece of data(chunk) to a writable stream, which is the response in this case.
    res.write(chunk);
  });
  // when all the data is read(so when the stream is basically finished reading the data from the file), the end event will be emmited.
  readable.on("end", () => {
    // we did this before lol. because the response is also a stream and the end method signals that no more data will be written to this writable stream.
    // we are not passing anything into it, because we already sent all the data using res.write chunk by chunk.
    // so when the readable stream is finished reading its file, all we have to do is to then signal that we're ready, using res.end
    // we always need to use the data and end event one after another. because otherwise the response will actually never really be sent to the client.
    res.end();
  });
  readable.on("error", err => {
    console.log(err);
    res.statusCode = 500;
    res.end("File not found!");
  });
  */
  // But solution 2 still has a problem...called 'backpressure' !!!
  // Backpressure happens when the response cannot send the data nearly as fast as it is receiving it from the file.
  // Solution 3

  const readable = fs.createReadStream("test-file.txt");
  // the pipe operator is available on all readable streams, and it allows us to pipe the ourput of a readable stream right into the input of a writable stream.
  // this can fix the problem of 'backpressure'!!! because it'll automatically handle the speed of the data coming in and the speed of the data going out.
  readable.pipe(res);
  // readableSource.pipe(writeableDest)
});

// start server
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
