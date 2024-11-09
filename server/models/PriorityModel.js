import mongoose from "mongoose";

const prioritySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
});

const PriorityModel = mongoose.model("Priority", prioritySchema);
export default PriorityModel;
