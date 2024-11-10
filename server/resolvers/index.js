import sendExpirationEmail from "../helper/sendMail.js";
import {
  PlanModel,
  TaskModel,
  AuthorModel,
  PriorityModel,
} from "../models/index.js";

import moment from "moment";

export const resolvers = {
  Query: {
    plans: async (parent, args, context) => {
      try {
        const plans = await PlanModel.find({ authorId: context.uid });
        return plans;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch plans");
      }
    },
    plan: async (parent, args) => {
      try {
        const foundPlan = await PlanModel.findById(args.planId);
        if (!foundPlan) throw new Error("Plan not found");
        return foundPlan;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch plan");
      }
    },
    tasks: async () => {
      try {
        const tasks = await TaskModel.find();
        return tasks;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch tasks");
      }
    },
    task: async (parent, args) => {
      try {
        const foundTask = await TaskModel.findById(args.taskId);
        if (!foundTask) throw new Error("Task not found");

        const foundPriority = foundTask.priorityId
          ? await PriorityModel.findOne({ _id: foundTask.priorityId })
          : null;

        return {
          ...foundTask.toObject(),
          priority: foundPriority,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch task");
      }
    },
    authors: async () => {
      try {
        const authors = await AuthorModel.find();
        return authors;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch authors");
      }
    },
    author: async (parent, args) => {
      try {
        const foundAuthor = await AuthorModel.findOne({ uid: args.authorId });
        if (!foundAuthor) throw new Error("Author not found");
        return foundAuthor;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch author");
      }
    },
    priorities: async () => {
      try {
        const priorities = await PriorityModel.find();
        return priorities;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch priorities");
      }
    },
  },
  Plan: {
    author: async (parent) => {
      try {
        const foundAuthor = await AuthorModel.findOne({ uid: parent.authorId });
        return foundAuthor;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch author for plan");
      }
    },
    tasks: async (parent) => {
      try {
        const tasks = await TaskModel.find({ planId: parent.id });
        return tasks;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch tasks for plan");
      }
    },
    priorities: async (parent) => {
      try {
        const priorities = await PriorityModel.find({ planId: parent.id });
        if (!priorities) return "";
        return priorities;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch priorities for plan");
      }
    },
  },
  Task: {
    priority: async (parent) => {
      try {
        const foundPriority = parent.priorityId
          ? await PriorityModel.findOne({ _id: parent.priorityId })
          : null;
        return foundPriority;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch priority for task");
      }
    },
    prerequisites: async (parent) => {
      try {
        const tasks = await TaskModel.find({
          _id: { $in: parent.prerequisites },
        });
        return tasks;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch prerequisites for task");
      }
    },
  },
  Mutation: {
    addPlan: async (parent, args, context) => {
      const newPlan = new PlanModel({ ...args, authorId: context.uid });
      await newPlan.save();
      return newPlan;
    },
    deletePlan: async (parent, { id }, context) => {
      try {
        const foundPlan = await PlanModel.findById(id);
        if (!foundPlan) {
          throw new Error("Plan not found");
        }

        await TaskModel.deleteMany({ planId: id });

        await PriorityModel.deleteMany({ planId: id });

        await PlanModel.findByIdAndDelete(id);

        return foundPlan;
      } catch (error) {
        throw new Error("Error deleting plan: " + error.message);
      }
    },

    addPriority: async (parent, args) => {
      const newPriority = new PriorityModel(args);
      await newPriority.save();
      return newPriority;
    },
    register: async (parent, args) => {
      const newUser = new AuthorModel(args);
      const foundUser = await AuthorModel.findOne({ uid: args.uid });

      if (!foundUser) {
        await newUser.save();
        return newUser;
      }
      return foundUser;
    },
    addTask: async (parent, args) => {
      const newTask = new TaskModel(args);
      await newTask.save();
      return newTask;
    },
    updateTask: async (parent, { id, ...taskData }, context) => {
      try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
          id,
          { ...taskData },
          { new: true }
        );

        if (!updatedTask) {
          throw new Error("Task not found");
        }

        return updatedTask;
      } catch (error) {
        throw new Error("Error updating task: " + error.message);
      }
    },

    deleteTask: async (parent, { taskId }, context) => {
      try {
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
        if (!deletedTask) {
          throw new Error("Task not found");
        }
        return deletedTask;
      } catch (error) {
        throw new Error("Error deleting task: " + error.message);
      }
    },
  },
};

export const checkEndDateAndSendEmail = async () => {
  const now = moment();
  const tomorrow = now.clone().add(1, "days");

  const plans = await PlanModel.find();
  console.log(plans);

  const emailPromises = plans.map(async (plan) => {
    const endDate = moment(plan.endDate, "DD-MM-YYYY");

    // Kiểm tra nếu endDate cách ngày hiện tại đúng 1 ngày
    if (endDate.isSame(tomorrow, "day")) {
      console.log(`Gửi email cho người dùng ${plan.authorId}`);
      await sendExpirationEmail(plan.authorId, plan.endDate, plan.name);
    }
  });

  await Promise.all(emailPromises);
};
