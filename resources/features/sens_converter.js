const Discord = require('discord.js');
const fs = require('fs');
const games = ["mw", "bo4", "mw2rm"];
const color = 0xc203fc;
const thumbnails = {
    "mw": "https://i.imgur.com/7NXhkSl.jpg",
    "bo4": "https://pbs.twimg.com/media/DXyXrHfWAAUgHtt.jpg"
};
function thumbnailChoose(game)
{
    if (game == "mw")
    {

        return thumbnails["mw"]

    }
    else if (game == "bo4")
    {

        return thumbnails["bo4"]

    }
    else
    {

        return "false"

    }


}
function isDir(dir)
{

    if (fs.existsSync(dir))
    {

        return true;

    }
    else
    {
        return false;
    }

}

function createDir(name)
{

    fs.mkdirSync(name);
    return;

}

function cmToSens(cm, dpi, game)
{
    
    //138545.45443 / (number of centimetres you want X current DPI)
    if (games.includes(game.toLowerCase()))
    {

        return ((138545.45443) / (cm * dpi )).toFixed(2);

    }
    else
    {

        console.log("ERROR: cmToSens FAILED!");

    }


}
function sensToCm(sens, dpi, game)
{
    
    if (games.includes(game.toLowerCase()))
    {

        return (((1385.4545 / sens) / dpi) * 100).toFixed(2);

    }
    else
    {

        console.log("ERROR: sensToCm FAILED!");

    }

}
function makeEmbed(title, keys, values, color, thumbnail, image)
{
    var embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color);

    for (var i=0;i<keys.length;i++)
    {
        var skip = [2,5];
        if (skip.includes(i))
        {

            embed.addField('\u200B', '\u200B', false);
            embed.addField(keys[i], values[i], true);
            continue;
        }


        embed.addField(keys[i], values[i], true);

    }
    if (thumbnail != "false")
    {

        embed.setThumbnail(thumbnail);

    }
    if(image != "false")
    {

        embed.setImage(image);

    }
    return embed;
        // .setTitle("Sensitivity Information")
        // .setColor("0xc203fc");

        // embed.addFields([
        //     {
        //         "name": "Sensitivity",
        //         "value": json["games"][args[1].toLowerCase()]["current"]["sensitivity"],
        //         "inline": true
        //     },
        //     {
        //         "name": "CM/360",
        //         "value": json["games"][args[1].toLowerCase()]["current"]["cm360"],
        //         "inline": true
        //     },
        //     {
        //         "name": '\u200B',
        //         "value": '\u200B',
        //         "inline": false
        //     },
        //     {
        //         "name": "DPI",
        //         "value": json["games"][args[1].toLowerCase()]["current"]["dpi"],
        //         "inline": true
        //     },
        //     {
        //         "name": "Field of View",
        //         "value": json["games"][args[1].toLowerCase()]["current"]["fov"],
        //         "inline": true
        //     }

        // ]);

}




function sensConvert(msg, args, client)
{

    //>>sens add mw sens dpi fieldofview
    //>>sens detach mw
    switch (args.length)
    {

        case 5:
        

            if (args[0].toLowerCase() == "add" && games.includes(args[1].toLowerCase()))
            {
                
                if (games.includes(args[1].toLowerCase()))
                {


                    var fov = args[4];
                    var game = args[1].toLowerCase();
                    var sensitivity = args[2];
                    var dpi = args[3];
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    var hh = today.getHours();
                    var mmm = today.getMinutes();

                    today = mm + '/' + dd + '/' + yyyy + '@' + hh + ':' + mmm;

                    if (isNaN(sensitivity) || isNaN(dpi))
                    {

                        msg.channel.send("Invalid sensitivity or dpi!");
                    
                        return;

                    }
                    else
                    {

                        var dir = `./resources/user_data/${msg.author.username}_${msg.author.id}`;


                        if (!isDir(dir))
                        {

                            createDir(dir);

                        }
                        var fileDir = `./resources/user_data/${msg.author.username}_${msg.author.id}/sens_info.json`;
                        if (!isDir(fileDir))
                        {
                            

                            var json = {"creation": {}, "games": {}};
                            json["creation"]["date"] = today;

                            fs.writeFileSync(fileDir, JSON.stringify(json), err => console.log(err));

                        }

                        fs.readFile(fileDir, 'utf8', (err, data) => {

                            if (err)
                            {

                                console.log(err);

                            }
                        
                            var json = JSON.parse(data);
                            console.log(json);
                            var centimeters = sensToCm(sensitivity, dpi, game)
                            if (game in json["games"])
                            {
                                
                                //set current on previous
                                json["games"][game]["previous"][json["games"][game]["current"]["date"]] =
                                {
                                    "sensitivity": json["games"][game]["current"]["sensitivity"],
                                    "dpi": json["games"][game]["current"]["dpi"],
                                    "fov": json["games"][game]["current"]["fov"],
                                    "cm360": json["games"][game]["current"]["cm360"]
                                };
                                //set current accordingly
                                //((1385.4545 / sens) / dpi) * 100
                                
                                json["games"][game]["current"] = 
                                {
                                    "sensitivity": sensitivity,
                                    "dpi": dpi,
                                    "fov": fov,
                                    "cm360": centimeters,
                                    "date": today
                                };
                                //fs write file and send discord msg
                                fs.writeFileSync(fileDir, JSON.stringify(json), err => console.log(json));
                                msg.channel.send(`Sensitivity for ${game} saved! <@${msg.author.id}>`);
                                return;

                            }
                            else
                            {
                                json["games"][game] = 
                                {                       
                                    "current":
                                    {
                                        "sensitivity": sensitivity,
                                        "dpi": dpi,
                                        "fov": fov,
                                        "cm360": centimeters,
                                        "date": today
                                    },
                                    "previous": {}
                                }
                                //fs writefile and send discord msg
                                fs.writeFile(fileDir, JSON.stringify(json), err => console.log(json));
                                msg.channel.send(`Sensitivity for ${game} saved! <@${msg.author.id}>`);
                                return;

                            }


                        });

                    }
                } 
                else
                {

                    msg.channel.send("Game not supported. " + "<@" + msg.author.id + ">");
                    return;

                }  

            }
            else if ((args[0].toLowerCase() == "checksens" || args[0].toLowerCase() == "checkcm") && games.includes(args[1]))
            {
                var game = args[1].toLowerCase();
                var option = args[0].toLowerCase();
                var sens = args[2];
                var dpi = args[3];
                var fov = args[4];
                if (isNaN(sens) || isNaN(dpi) || isNaN(fov))
                {

                    msg.channel.send("Did you enter your sensitivity correctly?");
                    return;

                }
                else
                {

                    if (option == "checksens")
                    {
                        if (game == "mw")
                        {
                            // embed.setThumbnail("https://i.imgur.com/krDGoPh.png");
                            var thumbnail = "https://i.imgur.com/7NXhkSl.jpg";
                            // embed.setThumbnail("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.ie%2Fpin%2F753719687626705721%2F&psig=AOvVaw2tWuJ0_oersaQK5Y7jUBIC&ust=1610564287012000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMDs19aJl-4CFQAAAAAdAAAAABAJ");
                        }
                        if (game == "bo4")
                        {

                            var thumbnail = "https://pbs.twimg.com/media/DXyXrHfWAAUgHtt.jpg";

                        }
                        var keys = ["Sensitivity", "DPI", "CM/360", "Field of View"];
                        var values = [sens, dpi, sensToCm(sens, dpi, game), fov];
                        var embed = makeEmbed("Sensitivity Info", keys, values, color, thumbnail, "false");
                        msg.channel.send("<@" + msg.author.id + ">");
                        msg.channel.send(embed);
                        return;
                    }
                    if (option == "checkcm")
                    {

                        if (game == "mw")
                        {
                            var thumbnail = "https://i.imgur.com/7NXhkSl.jpg";
                        }
                        if (game == "bo4")
                        {
                            var thumbnail = "https://pbs.twimg.com/media/DXyXrHfWAAUgHtt.jpg";
                        }
                        var keys = ["Sensitivity", "DPI", "CM/360", "Field of View"];
                        var values = [cmToSens(sens, dpi, game), dpi, sens, fov];
                        var embed = makeEmbed("Sensitivity Info", keys, values, color, thumbnail, "false");
                        msg.channel.send("<@" + msg.author.id + ">");
                        msg.channel.send(embed);
                        return;

                    }


                }

            }
            else
            {

                msg.channel.send("Command not recognized! " + "<@" + msg.author.id + ">");

            }
            break;
        
        case 1:
        

            if (args[0].toLowerCase() == "games")
            {
                var embed = makeEmbed("Supported Games", ["COD: Modern Warfare(2019)", "COD: Black Ops 4", "COD: Modern Warfare 2 Campaign Remastered"], ["mw", "bo4", "mw2rm"], 0xc203fc, "false", "false")
            
                msg.channel.send(`<@${msg.author.id}>`);
                msg.channel.send(embed);

            }
            else
            {

                msg.channel.send("Command not recognized! " + "<@" + msg.author.id + ">");

            }
            break;

        
        case (2):
        

            if (args[0].toLowerCase() == "me")
            {
                var game = args[1].toLowerCase()
                if (games.includes(game))
                {
                    var dir = `./resources/user_data/${msg.author.username}_${msg.author.id}`;
                    if (!isDir(dir))
                    {

                        msg.channel.send("You haven't even added any sensitivities <@" + msg.author.id + ">! Try >>sens add (game) (sensitivity) (dpi) (fov)");
                        return;
                    }
                    if (!isDir(dir+'/sens_info.json'))
                    {
                    
                        msg.channel.send("You haven't even added any sensitivities <@" + msg.author.id + ">! Try >>sens add (game) (sensitivity) (dpi) (fov)");
                        return;
                    }

                    fs.readFile(dir + "/sens_info.json", 'utf8', (err, data) => {

                        if (err) console.log(err);

                        var json = JSON.parse(data);

                        if (game in json["games"])
                        {
                            var thumbnail = ""
                            if (game == "mw")
                            {
                                // embed.setThumbnail("https://i.imgur.com/krDGoPh.png");
                                thumbnail = "https://i.imgur.com/7NXhkSl.jpg";
                                // embed.setThumbnail("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.ie%2Fpin%2F753719687626705721%2F&psig=AOvVaw2tWuJ0_oersaQK5Y7jUBIC&ust=1610564287012000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMDs19aJl-4CFQAAAAAdAAAAABAJ");
                            }
                            if (game == "bo4")
                            {

                                thumbnail = "https://pbs.twimg.com/media/DXyXrHfWAAUgHtt.jpg";

                            }
                            var embed = makeEmbed("Sensitivity Information",["Sensitivity", "CM/360", "DPI", "Field of View"], [json["games"][args[1].toLowerCase()]["current"]["sensitivity"], json["games"][args[1].toLowerCase()]["current"]["cm360"], json["games"][args[1].toLowerCase()]["current"]["dpi"], json["games"][args[1].toLowerCase()]["current"]["fov"]], 0xc203fc, thumbnail, "false");
                            

                            msg.channel.send("<@" + msg.author.id + ">");
                            msg.channel.send(embed);
                            return;
                        }
                        else
                        {

                            msg.channel.send("You haven't added your sens for that game! >>sens add (game) (sensitivity) (dpi) (fov)");
                            return;

                        }

                    });

                }
                else
                {

                    msg.channel.send("Game not supported. <@" + msg.author.id + ">");
                    return;
                }

            }
            else if (args[0].toLowerCase() == "history")
            {

                var history = args[0].toLowerCase();
                var game = args[1].toLowerCase();

                if (games.includes(game))
                {
                    var dir = `./resources/user_data/${msg.author.username}_${msg.author.id}`;
                    var fileDir = dir + "/sens_info.json";

                    if (!isDir(dir) && !isDir(fileDir))
                    {

                        msg.channel.send("You still need to add your sensitivity <@" + msg.author.id + ">");
                        return;

                    }
                    else
                    {

                        fs.readFile(fileDir, 'utf8', (err, data) => {

                            if (err) console.log(err);

                            var d = JSON.parse(data);
                            if (game in d["games"])
                            {

                                dGame = d["games"][game];
                                if (Object.keys(dGame["previous"]).length < 1)
                                {

                                    msg.channel.send("You have no history!");
                                    return;

                                }
                                else
                                {
                                    var values = [];
                                    var previous = dGame["previous"];
                                    for (const i in previous)
                                    {

                                        var title = `Sensitivity for ${i}`;
                                        var values = [previous[i]["sensitivity"], previous[i]["dpi"], previous[i]["fov"], previous[i]["cm360"]];
                                        var keys = ["Sensitivity", "DPI", "Field of View", "CM/360"];

                                        var embed = makeEmbed(title, keys, values, color, thumbnails[game], "false");
                                        msg.channel.send(embed);
                                        

                                    }
                                    return;

                                }

                            }
                            else
                            {

                                msg.channel.send("You haven't added your sensitivity for this game yet.");
                                return;

                            }

                        });

                    }
                    //readfile
                    //check if anything in game 
                    //chek if anything in game > previous
                    //makeEmbed() accordingly and send it
                    

                }
                else
                {

                    msg.channel.send("This game is not supported yet.");
                    return;

                }

            }
            else
            {

                msg.channel.send("Command not recognized! " + "<@" + msg.author.id + ">");
                return;
            }
            break;

    }

}
module.exports = 
{
    sensConvert,
    sensToCm,
    cmToSens,
    isDir,
    makeEmbed,
    createDir
}
