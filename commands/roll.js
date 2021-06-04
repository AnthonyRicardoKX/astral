module.exports = {
    help: {
        name: "roll",
        description: "Roll a dice. Simple as that.",
        usage: ["x: 1-1000. y: 1-10000. z: must be less than x.", "!['roll'|'r'] [x]d[y]", "!['roll'|'r'] [x]d[y]kh[z]", "!['roll'|'r'] [x]d[y]kl[z]"]
    },
    conf: {
        enabled: true,
        guildOnly: false,
        aliases: ["r"],
        minParam: 1,
        maxParam: 1
    },
    run: async (client, message, args) => {
        let diceString = args[0];

        let isDice = diceString.search(/(\d+)d(\d+)/i);
        let isKeepHigh = diceString.search(/kh(\d+)/i);
        let isKeepLow = diceString.search(/kl(\d+)/i);

        // Error checking. Return error message if failure condition is met.
        if (isDice != 0) {
            await message.channel.send(`<@${message.author.id}> This is not a valid dice.`);
            return 0;
        }
        if (isKeepLow != -1 && isKeepHigh != -1) {
            await message.channel.send(`<@${message.author.id}> You can only use keep low or keep high, one at a time.`);
            return 0;
        }

        // Roll the dice. Calculate values.
        let diceObject = diceString.match(/(\d+)d(\d+)/i);
        let roll = diceObject[1];
        let face = diceObject[2];

        let rollResult = [];
        let rollTag = [];
        let total = 0;
        for (i = 0; i < roll; i++) {
            rollResult[i] = Math.floor(Math.random() * face) + 1;
            total += rollResult[i];
        }

        // Sort by highest and initialize tagging array
        let sortRollResult = rollResult.sort(function (a, b) { return b - a });
        let sortResultTag = sortRollResult.slice();

        // Calculate and tag Keep High or Keep Low if exist.
        if (isKeepHigh != -1) {
            sortResultTag.fill(0, 0, sortResultTag.length);
            total = 0;
            let keepHighValue = diceString.split('kh')[1];
            for (i = 0; i < keepHighValue; i++) {
                sortResultTag[i] = 1;
                total += sortRollResult[i];
            }
        } else if (isKeepLow != -1) {
            sortResultTag.fill(0, 0, sortResultTag.length);
            total = 0;
            let keepLowValue = diceString.split('kl')[1];
            for (i = sortRollResult.length - 1; i > (sortRollResult.length - 1) - keepLowValue; i--) {
                sortResultTag[i] = 1;
                total += sortRollResult[i];
            }
        } else {
            sortResultTag.fill(1, 0, sortResultTag.length);
        }

        // Shuffling the array
        var currentIndex = sortRollResult.length, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [sortRollResult[currentIndex], sortRollResult[randomIndex]] = [sortRollResult[randomIndex], sortRollResult[currentIndex]];
            [sortResultTag[currentIndex], sortResultTag[randomIndex]] = [sortResultTag[randomIndex], sortResultTag[currentIndex]];
        }
        
        // Generate the string to post on Discord
        let rollString = '';
        for (i = 0; i < sortRollResult.length; i++) {
            if (sortRollResult[i] == 1 | sortRollResult[i] == 20) {
                if (sortResultTag[i] == 0) rollString += `~~**${sortRollResult[i]}**~~`;
                else rollString += `**${sortRollResult[i]}**`;
            } else {
                if (sortResultTag[i] == 0) rollString += `~~${sortRollResult[i]}~~`;
                else rollString += `${sortRollResult[i]}`;
            }

            if (i != sortRollResult.length - 1) rollString += ", ";
        }

        await message.channel.send(`<@${message.author.id}> :game_die:\nResult: ${args[0]} (${rollString})\nTotal: ${total}`);
    }
}