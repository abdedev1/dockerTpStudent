import express from "express";
import sequelize from "./config/config.db.js";
import {
  addNewStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from "./controllers/studentController.js";
import { increaseStudentAbsence } from "./controllers/studentController.js";
import { consumeCreateAbsenceQueue } from "./events/consumer.js";

const app = express();
const PORT = 9000;

app.use(express.json());
app.get("/students", getAllStudents);
app.get("/students/:id", getStudentById);
app.post("/students", addNewStudent);
app.put("/students/:id", updateStudent);
app.delete("/students/:id", deleteStudent);
app.put("/students/:id/increment-absence", increaseStudentAbsence);

sequelize
  .sync()
  .then(() => {
    console.log("La base de données est connectée.");
    app.listen(PORT, () => {
      console.log(`Le serveur est en cours d'exécution sur le port ${PORT}.`);
      consumeCreateAbsenceQueue();
    });
  })
  .catch((error) => {
    console.error(
      "Erreur lors de la synchronisation de la base de données :",
      error
    );
  });
