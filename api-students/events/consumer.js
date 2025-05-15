// events/consumer.js
import amqp from 'amqplib';

import { publishToQueue } from './publisher.js'; 
import Student from '../models/student.js';

// Connexion à RabbitMQ et consommation du message 'createAchat'
export async function consumeCreateAbsenceQueue() {
  try {
    console.log('Démarrage de  consumeCreateAbsenceQueue...');
    // Se connecter à RabbitMQ
    const connection = await amqp.connect('amqp://guest:guest@rabbitmq'); //amqp://user:password@rabbitmq
    const channel = await connection.createChannel();
    console.log('Démarrage de  consommation de achat_created..');

    // Assurer que la queue existe
    await channel.assertQueue('absence_created', { durable: true });

    // Consommer le message de la queue 'createAchat'
    channel.consume('absence_created', async (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log('Message reçu sur create:', data);

      const { studentId,absence_id} = data;

      // Mettre à jour le stock du produit
      await updateStudenttotalAbsence(studentId,absence_id);

      channel.ack(msg);  // Accuser la réception du message
    });

  } catch (error) {
    console.error('Erreur lors de la consommation des messages RabbitMQ:', error);
  }
}

// Fonction pour mettre à jour le stock du produit
async function updateStudenttotalAbsence(studentId,absence_id) {
    try {
        const student = await Student.findByPk(studentId);
        if (!student) return res.status(404).json({ message: 'student non trouvé' });
        console.log('Mise à jour du totale absence de student...'+studentId+'...'+student.total_absences);
        student.total_absences += 1;
        await student.save();
        console.log('Mise à jour du totale absence de student réussie:', student);
        await publishToQueue('total_absence_updated', {
          absence_id,
          studentId,
          total_absences: student.total_absences,
        });
    
        
      } catch (error) {
        console.error(error);
        await publishToQueue('total_abscene_update_failed', {
          absence_id,
          studentId,
          reason: error.message,
        });
      }
    }
