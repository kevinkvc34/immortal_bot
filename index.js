'use strict'

const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config/config.json");
const ping = require('./resources/features/ping_command');

client.login(config.BOT_TOKEN);

client.on("ready", () => {

    console.log("Ready");

});

client.on("message", function(message) {

    if (message.content.charAt(0) == ">" && message.content.charAt(1) == ">")
        {

            var args = message.content.split(" ").slice(1);
            var command = message.content.slice(2).split(" ")[0];

            if (command.toLowerCase() == "ping")
            {

                console.log("ping detected");
                ping.pingPlayer(message, args, client);

            }
            else if (command.toLowerCase() == "sens")
            {

                console.log("sens!");

            }
            else
            {

                message.channel.send(`<@${message.author.id}> that is not a valid command.`);

            }

        }

})