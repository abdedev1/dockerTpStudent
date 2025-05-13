import Student from "../models/student.js";

export const getAllStudents = (req, res) => {
  Student.findAll()
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send("Une erreur est survenue lors de la récupération des étudiants");
    });
};

export const getStudentById = (req, res) => {
  const id = req.params.id;
  Student.findByPk(id)
    .then((student) => {
      if (student) {
        res.json(student);
      } else {
        res.status(404).send("L'étudiant demandé est introuvable");
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send("Une erreur est survenue lors de la récupération de l'étudiant");
    });
};

export const addNewStudent = (req, res) => {
  const { nom, prenom, ville, filiere } = req.body;
  Student.create({ nom, prenom, ville, filiere })
    .then((student) => {
      res.json(student);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send("Une erreur est survenue lors de la création de L'étudiant");
    });
};

export const updateStudent = (req, res) => {
  const id = req.params.id;
  const { nom, prenom, ville, filiere } = req.body;
  Student.findByPk(id)
    .then((student) => {
      if (student) {
        student.nom = nom;
        student.prenom = prenom;
        student.ville = ville;
        student.filiere = filiere;
        return student.save();
      } else {
        res.status(404).send("L'étudiant demandé est introuvable");
        return null;
      }
    })
    .then((student) => {
      res.json(student);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send("Une erreur est survenue lors de la mise à jour de L'étudiant");
    });
};

export const deleteStudent = (req , res ) => {
  const id= req.params.id;
  Student.findByPk(id)
  .then((student) => {
    if (student){
      return student.destroy();
    }else {
      res.status(404).send("l'étudiant demandé est introuvable");
      return null;
    }
  })
  .then((result)=>{
    if (result) res.send("l'étudiant a été suprimé avec succés");
  })
  .catch((err) => {
    console.error(err);
    res
      .status(500)
      .send("Une erreur est survenue lors de la suppression de L'étudiant");
  });
};

export const increaseStudentAbsence = (req, res) => {
  const id = req.params.id;
  Student.findByPk(id)
    .then((student) => {
      if (student) {
        student.total_absences += 1;
        return student.save();
      } else {
        res.status(404).send("L'étudiant demandé est introuvable");
        return null;
      }
    })
    .then((student) => {
      res.json(student);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send("Une erreur est survenue lors de la mise à jour de L'étudiant");
    });
}



