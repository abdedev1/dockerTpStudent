import mongoose from "mongoose";

const absence_schema =new mongoose.Schema({
  studentId: String,
  date: {
    type: Date,
    default: Date.now()
  },
  comment: String,
  status: {
      type: String,
      enum: ["EN_ATTENTE", "ENREGISTRE", "NON_ENREGISTRE"],
      default: "EN_ATTENTE",
  },

});

export default mongoose.model("Absence", absence_schema);
  