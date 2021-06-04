module.exports = async (client) => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Authenticate database connection via defined sequelize class

  // Default activity set here because client.user.setActivity not responding when call inside .catch
  client.user.setActivity('Database Failure', {
    type: 'WATCHING'
  });
  await client.db.authenticate()
    .then(() => {
      console.log('Database connection has been established');
      client.user.setActivity('Another World', {
        type: 'WATCHING'
      });
    })
    .catch(err => {
      console.error('Unable to connect to database', err);
    })
}
