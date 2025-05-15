import amqp from 'amqplib';

export async function publishToQueue(queue, data) {
  const connection = await amqp.connect('amqp://guest:guest@rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  setTimeout(() => connection.close(), 500);
}


