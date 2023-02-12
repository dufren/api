const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

todoSchema.plugin(AutoIncrement, {
  inc_field: "todo",
  id: "todoNums",
  start_seq: 500,
});

module.exports = mongoose.model("Todo", todoSchema);
