const express = require("express")
const router = express.Router()
const ArtistController = require("../controllers/artist.js")
const {auth} = require("../middleware/auth.js")

router.post("/save",auth,ArtistController.save);
router.get("/artist/:id",auth, getOne);