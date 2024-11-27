import mongoose from "mongoose";

const authorSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    gmail: {
      type: String,
      require: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

authorSchema.pre("save", function (next) {
  if (!this.uid) {
    this.uid = this._id.toString();
  }
  next();
});

const AuthorModel = mongoose.model("Author", authorSchema);

export default AuthorModel;
