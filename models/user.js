import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      lowercase: true
    },
    type: {
      type: String,
      required: true,
      enum: ["ADMIN",'USER']
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    onTv: {
      type: Boolean,
      default: false
    },
    token: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;