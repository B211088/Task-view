import mongoose from "mongoose";

const plansSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    autoPlan: {
      type: Boolean,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    maxTasksPerDay: {
      type: Number,
    },
    authorId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PlanModel = mongoose.model("Plan", plansSchema);
export default PlanModel;
