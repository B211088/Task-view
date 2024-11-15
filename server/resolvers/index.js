import sendExpirationEmail from "../helper/sendMail.js";
import {
  PlanModel,
  TaskModel,
  AuthorModel,
  PriorityModel,
} from "../models/index.js";

import moment from "moment";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";
dotenv.config();

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

    modifyPlan: async (
      parent,
      { id, name, autoPlan, startDate, endDate, maxTasksPerDay },
      context
    ) => {
      try {
        const plan = await PlanModel.findById(id);

        if (!plan) {
          throw new Error(`Plan with ID ${id} not found`);
        }

        plan.name = name || plan.name;
        plan.autoPlan = autoPlan;
        plan.startDate = startDate || plan.startDate;
        plan.endDate = endDate || plan.endDate;
        plan.maxTasksPerDay = maxTasksPerDay || plan.maxTasksPerDay;

        const updatedPlan = await plan.save();

        return updatedPlan;
      } catch (error) {
        throw new Error("Error modifying plan: " + error.message);
      }
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

    modifyPriority: async (parent, { priorities }) => {
      try {
        const updatedPriorities = [];

        for (const priorityData of priorities) {
          const updatedPriority = await PriorityModel.findByIdAndUpdate(
            priorityData.id,
            { name: priorityData.name, point: priorityData.point },
            { new: true }
          );

          if (!updatedPriority) {
            throw new Error(`Priority with id ${priorityData.id} not found`);
          }

          updatedPriorities.push(updatedPriority);
        }

        return updatedPriorities;
      } catch (error) {
        throw new Error("Error modifying priorities: " + error.message);
      }
    },

    deletePriority: async (parent, { ids }) => {
      try {
        const deletedPriorities = await PriorityModel.find({
          _id: { $in: ids },
        });

        if (deletedPriorities.length === 0) {
          throw new Error("No priorities found with the given IDs");
        }

        const result = await PriorityModel.deleteMany({
          _id: { $in: ids },
        });

        if (result.deletedCount === 0) {
          throw new Error("No priorities were deleted");
        }

        return deletedPriorities;
      } catch (error) {
        throw new Error("Error deleting priorities: " + error.message);
      }
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

    register: async (parent, args) => {
      const foundUser = await AuthorModel.findOne({ uid: args.uid });

      if (!foundUser) {
        await newUser.save();
        return newUser;
      }
      return foundUser;
    },

    registerUser: async (args) => {
      try {
        if (!args || typeof args.authorInput !== "object") {
          throw new Error("Thiếu hoặc sai định dạng 'authorInput'");
        }

        const { name, gmail, password } = args.authorInput;

        if (!name || !gmail || !password) {
          throw new Error(
            "Các trường 'name', 'gmail' và 'password' là bắt buộc."
          );
        }

        const foundUser = await AuthorModel.findOne({ gmail });
        if (foundUser) {
          throw new Error("Email đã tồn tại.");
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = new AuthorModel({
          name,
          gmail,
          password: hashedPassword,
        });

        await newUser.save();

        newUser.uid = newUser._id;
        await newUser.save();

        const token = jwt.sign(
          { uid: newUser._id.toString(), gmail: newUser.gmail },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );

        return {
          uid: newUser._id.toString(),
          name: newUser.name,
          gmail: newUser.gmail,
          token,
        };
      } catch (error) {
        console.error("Lỗi trong registerUser:", error.message);
        throw new Error(error.message || "Đã xảy ra lỗi không xác định.");
      }
    },
  },
};

export const checkEndDateAndSendEmail = async () => {
  const now = moment();
  const tomorrow = now.clone().add(1, "days");

  const plans = await PlanModel.find();

  const emailPromises = plans.map(async (plan) => {
    const endDate = moment(plan.endDate, "DD-MM-YYYY");

    if (endDate.isSame(tomorrow, "day")) {
      console.log(`Gửi email cho người dùng ${plan.authorId}`);
      await sendExpirationEmail(plan.authorId, plan.endDate, plan.name);
    }
  });

  await Promise.all(emailPromises);
};
