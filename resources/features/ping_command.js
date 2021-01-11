
//check command, then args
function pingPlayer(msg, args, client)
{

    if (args.length != 1)
    {

        msg.channel.send("Only one player is allowed!");
        return;

    }
    else
    {

        if (msg.mentions.members == 0)
        {

            msg.channel.send("Invalid user! Make sure to tag them!");
            return;

        }
        else
        {

            msg.author.send(`You just got pinged ${args[0]}`);
            return;

        }

    }

}

module.exports = {
    pingPlayer
};