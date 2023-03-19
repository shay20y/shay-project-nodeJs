const express = require("express");
const { GameModel, validateGame } = require("../models/gameModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

// ?page=1&sort=
router.get("/", async(req,res) => {
  let perPage = 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id";
  let reverse = (req.query.reverse == "yes") ? 1 : -1;

  try{
    let data = await GameModel
    .find({})
    .limit(perPage)
    .skip(page * perPage) 
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
router.get("/search", async (req, res) => {
  let queryS = req.query.s;
  let searchExp = new RegExp(queryS, "i")
  let page = req.query.page ? parseInt(req.query.page) - 1 : 0;

  try {
    let data = await GameModel
      .find({ $or: [{ name: searchExp }] })
      .select({ user_id: 0, date_created: 0, __v: 0 })
      .limit(10)
      .skip(page * 10)
      .sort({ price: 1 });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})
router.get("/category/:category", async (req, res) => {
  try {
    let category = req.params.category.toLowerCase();
    let page = req.query.page ? parseInt(req.query.page) - 1 : 0;
    let regex = new RegExp(category, "i");
    let data = await GameModel
      .find({ categories: { $regex: regex } })
      .select({ user_id: 0, date_created: 0, __v: 0 })
      .sort({ price: 1 })
      .skip(page * 10);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.get("/prices", async (req, res) => {
    let minPrice = req.query.min ? Number(req.query.min) : 0;
    let maxPrice = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER;
    try {
        let data = await GameModel.find({ price: { $gte: minPrice, $lte: maxPrice } });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});
router.get("/single/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await GameModel
      .find({_id:id})
    if (!data) {
      return res.status(404).json({"message": "Game not found"});
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/", auth, async (req, res) => {
  let validBody = validateGame(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let Game = new GameModel(req.body);
    Game.user_id = req.tokenData._id;
    await Game.save();
    res.json(Game)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})
router.put("/:id", auth, async (req, res) => {
  let validBody = validateJoi(req.body);
  if (validBody.error) {
      return res.status(400).json(validBody.error.details);
  }
  try {
      let id = req.params.id;
      let data;
      if (req.tokenData.role == "admin") {
          data = await GameModel.updateOne({ _id: id }, req.body);
          data={msg:"Change :)"}
      }
      else {
          const car = await GameModel.findById(id);
          if (car && car.user_id == req.tokenData._id) {
              data = await GameModel.updateOne({ _id: idEdit, user_id: req.tokenData._id  }, req.body);
              data={msg:"Chang :)"}
          }
          else {
              return res.status(401).json({ error: "You are not authorized/didnt create to delete this element" });
          }

      }
      res.json(data)
  }
  catch (err) {
      res.json({ msg: "you didnt create this element" });
      console.log(err);
      res.status(502).json({ err })
  }
})
router.delete("/:idDel", auth, async (req, res) => {
  try {
      let idDel = req.params.idDel;
      let data;
      if (req.tokenData.role == "admin") {
          data = await GameModel.deleteOne({ _id: idDel });
          data={msg:"deleted :X"}
      }
      else {
          const car = await GameModel.findById(idDel);
          if (car && car.user_id == req.tokenData._id) {
              data = await GameModel.deleteOne({ _id: idDel });
              data={msg:"deleted :X"}
          }
          else {
              return res.status(401).json({ error: "You are not authorized/didnt create to delete this element" });
          }
      }
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(502).json({ error: err.message });
  }
});
module.exports = router;
