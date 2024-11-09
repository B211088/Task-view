import mongoose from "mongoose";

const authorSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

const AuthorModel = mongoose.model("Author", authorSchema);

export default AuthorModel;
