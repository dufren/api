const express = require("express");
const router = express.Router();
const packagesController = require("../controllers/packagesController");

router
  .route("/")
  .get(packagesController.getAllPackages)
  .post(packagesController.createNewPackage)
  .patch(packagesController.updatePackage)
  .delete(packagesController.deletePackage);

module.exports = router;
