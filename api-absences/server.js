import express from "express";
import mongoose from "mongoose";
import {
  createAbsence,
  deleteAbsence,
  getAbsenceById,
  getAbsences,
  getAbsencesByStudentId,
  updateAbsence,
} from "./controllers/absenceController.js";
import  {consumeTotalAbsenceUpdateMessages} from './events/consumer.js'


const app = express();
const port = 7000;

app.use(express.json());
app.get("/absences", getAbsences);
app.post("/absences", createAbsence);
app.get("/absences/:id", getAbsenceById);
app.put("/absences/:id", updateAbsence);
app.delete("/absences/:id", deleteAbsence);
app.get("/absences/student/:studentId", getAbsencesByStudentId);



const {
  MONGO_DB_NAME,
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_HOST,
  MONGO_DB_PORT,
} = process.env;
const mongoUri = `mongodb://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}?authSource=admin`;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`API achats lancé sur http://localhost:${port}`);
      consumeTotalAbsenceUpdateMessages();
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
