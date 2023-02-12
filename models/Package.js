const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.plugin(AutoIncrement, {
  inc_field: "package",
  id: "packageNums",
  start_seq: 500,
});

module.exports = mongoose.model("Package", packageSchema);
