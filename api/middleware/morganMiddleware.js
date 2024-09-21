const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const moment = require("moment-timezone");

function morganLoggerMiddlewareForDevelopment(app) {
  // Check if the file exists or not, if not, create one
  if (!fs.existsSync(path.join(__dirname, "../logs"))) {
    fs.mkdirSync(path.join(__dirname, "../logs"));
  }

  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "../logs/access.log"),
    { flags: "a" }
  );
  morgan.token("date", function () {
    return moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
  });
  app.use(morgan("dev"));
  app.use(morgan("combined", { stream: accessLogStream }));
}

module.exports = morganLoggerMiddlewareForDevelopment;
