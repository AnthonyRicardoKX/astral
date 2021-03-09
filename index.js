require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.commands = [];
client.aliases = [];

// Iteratively read ./commands/genshin directory to enable all command files
fs.readdir('./commands/genshin/', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading Genshin-related ${files.length} commands.`);
  files.forEach(file => {
    if (file.split(".").slice(-1)[0] !== "js") return;
    let props = require(`./commands/genshin/${file}`);
    client.commands[props.help.name] = props;
    if (props.init) props.init(Client);
    props.conf.aliases.forEach(alias => {
      client.aliases[alias] = props.help.name;
    });
  });
  console.log(client.commands);
  console.log(client.aliases);
});

// Iteratively read ./events directoy to setup all events listed as files
fs.readdir('./events/', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading ${files.length} events.`);
  files.forEach(file => {
    if (file.split(".").slice(-1)[0] !== "js") return
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.login(process.env.API_TOKEN);