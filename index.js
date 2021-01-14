'use strict'

const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config/config.json");
const ping = require('./resources/features/ping_command');
const sensitivityConverter = require('./resources/features/sens_converter');

client.login(config.BOT_TOKEN);

client.on("ready", () => {

    console.log("Ready");

});

client.on("message", function(message) {

    if (message.content.charAt(0) == ">" && message.content.charAt(1) == ">")
        {

            var args = message.content.split(" ").slice(1);
            for (var i=0;i<args.length;i++)
            {
                args[i] = args[i].toLowerCase();
            }
            var command = message.content.slice(2).split(" ")[0].toLowerCase();

            if (command == "ping")
            {

                console.log("ping detected");
                ping.pingPlayer(message, args, client);

            }
            else if (command == "sens")
            {

                sensitivityConverter.sensConvert(message, args, client)

            }
            else
            {

                message.channel.send(`<@${message.author.id}> that is not a valid command.`);

            }

        }

})