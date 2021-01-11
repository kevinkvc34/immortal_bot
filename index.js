const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config/config.json");

client.login(config.BOT_TOKEN);

client.on("ready", () => {

    console.log("Ready");

})