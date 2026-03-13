import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SchemaObject = new Schema(
  {
    value: {
      type: String,
    },
    type: {
      type: String,
      enum: ["text", "images", "video"],
    },
    mute: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const announcementSchema = new Schema({
  department: {
    type: mongoose.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  main: SchemaObject,
  side: SchemaObject,
});

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
