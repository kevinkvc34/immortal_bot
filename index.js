const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config/config.json");
const ping = require('./resources/features/ping_command');

client.login(config.BOT_TOKEN);

client.on("ready", () => {

    console.log("Ready");

})

client.on("message", msg => {


    if (msg.charAt(0) == ">" && msg.charAt(1) == ">")
        {

            var args = msg.split(" ").slice(1);
            var command = msg.slice(2).split(" ")[0];
            if (command.toLowerCase() == "ping")
            {


                //do the ping feature function
                ping.pingPlayer(msg, args, client);

            }

        }

})