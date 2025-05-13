import mongoose from "mongoose";

const absence_schema =new mongoose.Schema({
  studentId: String,
  date: {
    type: Date,
    default: Date.now()
  },
  comment: String,
  status: String,
});

export default mongoose.model("Absence", absence_schema);
  