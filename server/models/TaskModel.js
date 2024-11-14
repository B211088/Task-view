import mongoose from "mongoose";

const TaskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    status: {
      type: String,
      enum: ["unmake", "in-progress", "completed"],
      default: "unmake",
    },
    estimatedCompletionTime: {
      type: Number,
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    timeSchedule: {
      type: Number,
    },
    timeIsPlay: {
      type: Number,
    },
    startDay: {
      type: String,
    },
    planId: {
      type: String,
      required: true,
    },
    priorityId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", TaskSchema);

export default TaskModel;
