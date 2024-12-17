const express = require("express");
const router = express.Router();
const {
    createCuratedList,
    updateCuratedList,
} = require("../controllers/curatedListController");

// POST endpoint to create a new curated list
router.post("/curated-lists", createCuratedList);

// PUT endpoint to update an existing curated list
router.put("/curated-lists/:curatedListId", updateCuratedList);

module.exports = router;
