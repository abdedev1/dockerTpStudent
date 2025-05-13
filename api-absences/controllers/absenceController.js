import Absence from "../models/absence.js";
import axios from "axios";


export const createAbsence = (req, res) => {
  const { studentId, comment, date, status } = req.body;
  const absence = new Absence({
    studentId,
    date,
    status,
    comment,
  });
  try {
    absence.save();

    const response =axios.put(`http://api-students:9000/students/${studentId}/increment-absence`);
    if (response.status !== 200) {
      return res.status(500).json({ message: "Absence créée, mais échec de la mise à jour du total d'absences de l'étudiant." });
    }

    res.status(201).json({ message: "Absence created successfully!iiii" });
  } catch (err) {
    res.status(500).json({ message: "Error: cannot add this absence! " + err.message});
  }
  

 
};

export const getAbsences = (req, res) => {
  Absence.find()
    .then((absences) => {
      if (absences.length === 0) {
        return res.status(404).json({ message: "No absences found" });
      }
      res.status(200).json(absences);
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Error : can not get absences " + error.message })
    );
};

export const getAbsenceById = (req, res) => {
  const absenceId = req.params.id;
  Absence.findById(absenceId)
    .then((absence) => {
      if (!absence) {
        return res.status(404).json({ message: "Absence not found" });
      }
      res.status(200).json(absence);
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Error : can not get this absence " + error.message })
    );
};

export const updateAbsence = (req, res) => {
  const absenceId = req.params.id;
  const { studentId, date, comment, status } = req.body;

  Absence.findByIdAndUpdate(
    absenceId,
    { studentId, date, comment, status },
    { new: true }
  )
    .then((absence) => {
      if (!absence) {
        return res.status(404).json({ message: "Absence not found" });
      }
      res.status(200).json({ message: "Absence updated successfully!" });
    })
    .catch((error) =>
      res
        .status(500)
        .json({
          message: "Error : can not update this absence " + error.message,
        })
    );
};

export const deleteAbsence = (req, res) => {
  const absenceId = req.params.id;

  Absence.findByIdAndDelete(absenceId)
    .then((absence) => {
      if (!absence) {
        return res.status(404).json({ message: "Absence not found" });
      }
      res.status(200).json({ message: "Absence deleted successfully!" });
    })
    .catch((error) =>
      res
        .status(500)
        .json({
          message: "Error : can not delete this absence " + error.message,
        })
    );
};

export const getAbsencesByStudentId = (req, res) => {
  const studentId = req.params.studentId;

  Absence.find({ studentId })
    .then((absences) => {
      if (absences.length === 0) {
        return res.status(404).json({ message: "No absences found" });
      }
      res.status(200).json(absences);
    })
    .catch((error) =>
      res
        .status(500)
        .json({
          message: "Error : can not get absences for this student " + error.message,
        })
    );
}
