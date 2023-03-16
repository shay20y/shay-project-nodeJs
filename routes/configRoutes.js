const indexR = require("./index");
const usersR = require("./users");
const gameR = require("./game");


exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/game/",gameR);
}