const Discord = require('discord.js');
const fs = require('fs');

function sensConvert(msg, args, client)
{


    //>>sens attach mw sens dpi fieldofview
    //>>sens detach mw
    if (args.length == 5)
    {

        if (args[0].toLowerCase() == "attach" && typeof args[1] == "string")
        {

            var fov = args[4];
            var game = args[1];
            var sensitivity = args[2];
            var dpi = args[3];
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var hh = today.getHours();
            var mmm = today.getMinutes();

            today = mm + '/' + dd + '/' + yyyy + '@' + hh + ':' + mmm;

            if (isNaN(sensitivity) || isNaN(dpi) || isNaN(fov))
            {

                msg.channel.send("Invalid sensitivity or dpi!");
                // msg.channel.send(`Sens: ${sensitivity}(${typeof sensitivity}), Dpi: ${dpi}(${typeof dpi}), FOV: ${fov}(${typeof fov})`);
                return;

            }
            else
            {

                var dir = `./resources/user_data/${msg.author.username}_${msg.author.id}`;

                if (!fs.existsSync(dir))
                {

                    fs.mkdirSync(dir);

                }
                var fileDir = `./resources/user_data/${msg.author.username}_${msg.author.id}/sens_info.json`;
                if (!fs.existsSync(fileDir))
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
                    // var test = 
                    // {
                    //     "creation": 
                    //     {
                    //         "date": "1/1/1111"
                    //     },
                    //     "games":
                    //     {
                    //         "mw":
                    //         {
                    //             "current":
                    //             {
                    //                 "sensitivity": 3,
                    //                 "dpi": 800,
                    //                 "fov": 120
                    //             },
                    //             "previous":
                    //             {
                    //                 "2/2/2222":
                    //                 {
                    //                     "sensitivity": 3,
                    //                     "dpi": 300,
                    //                     "fov": 200
                    //                 },
                    //                 "3/3/3333":
                    //                 {
                    //                     "sensitivity": 4,
                    //                     "dpi": 300,
                    //                     "fov": 103
                    //                 }
                    //             }
                    //         }
                    //     }
                    // };
                    var json = JSON.parse(data);
                    console.log(json);

                    if (game in json["games"])
                    {

                        //set current on previous
                        json["games"][game]["previous"][json["games"][game]["current"]["date"]] =
                        {
                            "sensitivity": json["games"][game]["current"]["sensitivity"],
                            "dpi": json["games"][game]["current"]["dpi"],
                            "fov": json["games"][game]["current"]["fov"]
                        };
                        //set current accordingly
                        json["games"][game]["current"] = 
                        {
                            "sensitivity": sensitivity,
                            "dpi": dpi,
                            "fov": fov,
                            "cm360": "unknown",
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
                                "cm": "unknown",
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

            msg.channel.send("Invalid argument. (" + args[0] + ")");

        }

    }
    else if (args.length == 1)
    {

        if (args[0].toLowerCase() == "games")
        {

            var embed = new Discord.MessageEmbed()
            .setTitle("Supported Games")
            .setColor(0xc203fc);

            embed.addFields([
                {
                    "name": "\nCall of Duty: Modern Warfare(2019)",
                    "value": "'mw'",
                    "inline": false
                },
                {
                    "name": '\u200B',
                    "value": '\u200B'
                },
                {
                    "name": "Call of Duty: Black Ops 4",
                    "value": "'bo4'",
                    "inline": false
                },
                {
                    "name": '\u200B',
                    "value": '\u200B'
                },
                {
                    "name": "Call of Duty: Modern Warfare 2 Campaign Remastered",
                    "value": "'mw2rm'",
                    "inline": false
                }
            ]);
            msg.channel.send(`<@${msg.author.id}>`);
            msg.channel.send(embed);

        }
        else
        {

            msg.channel.send("Improper format/usage.");

        }

    }
    else
    {

        msg.channel.send("Improper format/usage.");

    }

}
module.exports = 
{
    sensConvert
}
//do >>sens games command
//do game check for adding cm/360
//do >>sens history command
//do >>sens game command