const routeSinger = require("./singer.routess");
const routeSong = require("./song.routerss");
const routeTopic = require("./topic.routess");
const routeUser = require("./user.routerss");
const routerMomo = require("./momo.routerss");
const routerSystem = require("./system.routerss");
module.exports = (app) => {
  app.use("/api/singer", routeSinger);
  app.use("/api/song", routeSong);
  app.use("/api/topic", routeTopic);
  app.use("/api/user", routeUser);
  app.use("/api/momo", routerMomo);
  app.use("/api", routerSystem);
};
