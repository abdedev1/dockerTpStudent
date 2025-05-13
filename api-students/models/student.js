import sequelize from "../config/config.db.js";
import { Sequelize } from "sequelize";

const Student = sequelize.define('Student', {
    id: {
      type : Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type : Sequelize.STRING,
      allowNull: false,
    },
    prenom: {
      type : Sequelize.STRING,
      allowNull: false,
    },
    ville: {
      type : Sequelize.STRING,
      allowNull: false,
    },
    filiere: {
      type : Sequelize.STRING,
      allowNull: false,
    },
    total_absences: {
      type : Sequelize.INTEGER,
      defaultValue: 0,
    
    },
});

export default Student;