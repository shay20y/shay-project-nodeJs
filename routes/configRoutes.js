const indexR = require("./index");
const usersR = require("./users");
const gameR = require("./game");


exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/game/",gameR);
  
  app.use("/*",(req,res) =>{
  res.status(404).json({msg:"Endpoint/page not found, 404"})
  })
}
