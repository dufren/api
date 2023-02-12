const Package = require("../models/Package");
const asyncHandler = require("express-async-handler");

const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find().lean();

  if (!packages?.length) {
    return res.status(400).json({ message: "No packages found" });
  }

  res.json(packages);
});

const createNewPackage = asyncHandler(async (req, res) => {
  const { price, title, text } = req.body;

  if (!price || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Package.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate package title" });
  }

  const package = await Package.create({ price, title, text });

  if (package) {
    return res.status(201).json({ message: "New package created" });
  } else {
    return res.status(400).json({ message: "Invalid package data received" });
  }
});

const updatePackage = asyncHandler(async (req, res) => {
  const { id, price, title, text } = req.body;

  if (!id || !price || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const package = await Package.findById(id).exec();

  if (!package) {
    return res.status(400).json({ message: "Package not found" });
  }

  const duplicate = await Package.findOne({ title }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate package title" });
  }

  package.title = title;
  package.price = price;
  package.text = text;

  const updatedPackage = await package.save();

  res.json(`'${updatedPackage.title}' updated`);
});

const deletePackage = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Package ID required" });
  }

  const package = await Package.findById(id).exec();

  if (!package) {
    return res.status(400).json({ message: "Package not found" });
  }

  const result = await package.deleteOne();

  const reply = `Package '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllPackages,
  createNewPackage,
  updatePackage,
  deletePackage,
};
