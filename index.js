const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    const method = req.method;

    if (req.url === "/") {
      res.write("<html>");
      res.write("<body>");
      res.write("<h1>Hello Node!</h1>");
      res.write(
        "<a href='http://localhost:8000/read-message'>Read Message</a>"
      );
      res.write("<br/>");
      res.write(
        "<a href='http://localhost:8000/write-message'>Write Message</a>"
      );
      res.write("</body>");
      res.write("</html>");
      res.end();
    }else if (req.url === "/read-message" && method === "POST") {
      const body = [];
      req.on("data", (message) => {
        console.log(message);
      });

      req.on("data", (message) => {
        body.push(message);
      });
      req.on("end", () => {
        const messages = Buffer.concat(body).toString();

        const messageList = messages.split("=")[1];

        res.write("<html>");
        res.write("<body>");
        res.write(`<h2>${messageList}</h2>`);
        res.write("</body>");
        res.write("</html>");
        res.end();

        fs.writeFile("message.txt", messageList, (err) => {
          if (err) throw err;
          res.statusCode = 302;
          return res.end();
        });
      });
    }else if (req.url === "/write-message") {
      res.write("<html>");
      res.write("<body>");
      res.write("<form action='/read-message' method='POST'>");
      res.write("<input type='text' name='message' placeholder='text'/>");
      res.write("<button type='submit'>sent</button>");
      res.write("</form>");
      res.write("</body>");
      res.write("</html>");
      res.end();
    }else{
      res.write("<html>");
      res.write("<body>");
      res.write("<h1>Please leave your message first.</h1>")
      res.write("<a href='http://localhost:8000/write-message'>From here</a>")
      res.write("</body>");
      res.write("</html>");
      res.end();
    }
  })
  .listen(8000, () => console.log("server is listening."));
