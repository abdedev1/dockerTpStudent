// events/consumer.js dans API Achats
import amqp from 'amqplib';
import Absence from '../models/absence.js';

// Connexion à RabbitMQ et consommation des messages 'stock_update_failed' et 'stock_updated'
export async function consumeTotalAbsenceUpdateMessages() {
  try {
    // Se connecter à RabbitMQ
    const connection = await amqp.connect('amqp://guest:guest@rabbitmq'); 
    const channel = await connection.createChannel();

    // Assurer que les queues 'stock_update_failed' et 'stock_updated' existent
    await channel.assertQueue('total_absence_update_failed', { durable: true });
    await channel.assertQueue('total_absence_updated', { durable: true });
    console.log('Démarrage de la consommation des messages RabbitMQ sur les files d attente : total_absence_update_failed et total_absence_updated...');

    // Consommer les messages de la queue 'stock_update_failed'
    channel.consume('total_absence_update_failed', async (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log('Message reçu sur total_absence_update_failed:', data);
      //  déstructuration du message pour récupérer les données
      const { absence_id , studentId, reason  } = data;

      // Gérer l'échec de mise à jour du stock : mettre à jour l'état de l'achat
      await handleTotalAbsenceUpdateFailure(studentId, absence_id, reason);

      channel.ack(msg);  // Accuser la réception du message
    });

    // Consommer les messages de la queue 'stock_updated'
    channel.consume('total_absence_updated', async (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log('Message reçu sur total_absence_updated:', data);

      const {absence_id, studentId } = data;

      // Gérer le succès de mise à jour du stock : mettre à jour l'état de l'achat
      await handleTotalAbsenceUpdateSuccess(absence_id,studentId);

      channel.ack(msg);  // Accuser la réception du message
    });

  } catch (error) {
    console.error('Erreur lors de la consommation des messages RabbitMQ:', error);
  }
}

// Fonction pour gérer un échec de mise à jour du stock
async function handleTotalAbsenceUpdateFailure(absence_id,studentId) {
  try {
    // Mettre à jour l'achat correspondant pour marquer un échec
    const absence = await Absence.findById(absence_id); // Exemple d'achat en attente
    if (!absence) {
      console.log('Absence non trouvé ', absence_id);
      return;
    }

    absence.status = 'NON_ENREGISTRE';
    // achat.details = `Échec de mise à jour du stock : ${reason}`;
    await absence.save();

    console.log(`absence ${absence_id} du student ${studentId} marqué comme NON_ENREGISTRE`);
  } catch (err) {
    console.error('Erreur lors du traitement de l\'échec de la mise à jour du stock:', err);
  }
}

// Fonction pour gérer le succès de mise à jour du stock
async function handleTotalAbsenceUpdateSuccess(absence_id,studentId) {
  try {
    // Mettre à jour l'achat correspondant pour marquer un succès
    const absence = await Absence.findById(absence_id); // Exemple d'achat en attente
    if (!absence) {
      console.log('Absence non trouvé pour le produit:', absence_id);
      return;
    }
    absence.status = 'ENREGISTRE';

    
    await absence.save();

    console.log(`absence ${absence_id} du student ${studentId} marqué comme ENREGISTRE`);
  } catch (err) {
    console.error('Erreur lors du traitement du succès de la mise à jour du stock:', err);
  }
}
