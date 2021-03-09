exports.run = async (client, msg, args) => {
    console.log('build command');
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['bd'],
    permLevel: 0
};

exports.help = {
    name: 'build',
    description: 'Retrieve a character build from verified sources.',
    usage: 'build <source | default: genshin.gg> <character_name>'
};