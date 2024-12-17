const { CuratedList } = require("../models");

// Function to generate a slug from the list name
const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with hyphens
};

// Create a new curated list
const createCuratedList = async (req, res) => {
    const { name, description } = req.body;

    // Generate slug from the list name
    const slug = generateSlug(name);

    try {
        const newCuratedList = await CuratedList.create({
            name,
            description,
            slug,
        });

        return res.status(201).json({
            message: "Curated list created successfully.",
            curatedList: newCuratedList,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error creating curated list.",
        });
    }
};

// Update an existing curated list
const updateCuratedList = async (req, res) => {
    const { curatedListId } = req.params;
    const { name, description } = req.body;

    try {
        // Find the curated list by ID
        const curatedList = await CuratedList.findByPk(curatedListId);

        if (!curatedList) {
            return res.status(404).json({
                message: "Curated list not found.",
            });
        }

        // Generate the updated slug
        const slug = generateSlug(name);

        // Update the list
        await curatedList.update({
            name,
            description,
            slug,
        });

        return res.status(200).json({
            message: "Curated list updated successfully.",
            curatedList,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error updating curated list.",
        });
    }
};

module.exports = {
    createCuratedList,
    updateCuratedList,
};
