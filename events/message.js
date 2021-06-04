const warned = [];

module.exports = async (client, message) => {

    // Ignores message if author is bot
    if (message.author.bot) return;

    // Ignores message if does not contain prefix
    if (message.content.indexOf(process.env.APP_PREFIX) !== 0) return;

    let userMessage = message.content.split(/ +/g);
    let userCommand = userMessage.shift().slice(process.env.APP_PREFIX.length).toLowerCase();
    let command = client.commands[userCommand] || client.commands[client.aliases[userCommand]];
    
    if (command !== undefined) {
        if (userMessage.length < command.conf.minParam || userMessage.length > command.conf.maxParam) {
            message.channel.send(`<@${message.author.id}> Too little or too many parameter given for this command.`);
            return 0;
        }
        command.run(client, message, userMessage);
    }
};