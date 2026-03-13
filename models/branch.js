import mongoose from "mongoose";
const Schema = mongoose.Schema;

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  { timestamps: true },
);

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
