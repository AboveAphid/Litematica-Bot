const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder') //Imports Only certain parts of mineflayer-pathfinding //npm install mineflayer-pathfinder
const GoalNear = goals.GoalNear
const GoalBlock = goals.GoalBlock
const vec3 = require('vec3')


const bot = mineflayer.createBot({
    host: 'localhost',          //Server Ip
    port: 5555,                //Port
    username: 'LitematicaBot',      //Username OR Email if using a account
    //password: ''              //Password (Needed if logining into a actual account))
    version: '1.20'           //Minecraft Version
})


bot.loadPlugin(pathfinder)

const mcData = require('minecraft-data')(bot.version)

// const movements = new Movements(bot, mcData)
// bot.pathfinder.setMovements(movements)

bot.on('kick', console.log)
bot.on('error', console.log)
bot.on('login', () => {
    console.log('Logged on to server')
})
bot.on('spawn', () => {
    console.log('Spawned')
    bot.equipItem = equipItem // Allows me to access the custom equipItem func from the bot
})

bot.on('chat', doStuff)



let BuildingActive = false;
let reachedDestination = false; 
let Delay = 1


async function doStuff(username, msg) {
    bot.chat(`Hello!
To get a list of commands type "!help"
Created by: A_Aphid: https://www.youtube.com/channel/UC93w5xusCW-VQzpgS1CUM7Q
Thank you for using this software :)`)

    const player = bot.players[username]

    if (!player) { // Checks if player is null and if it is then it exits
        return
    }

    if (player.username === bot.username) { // If username is the bot then returns
        return
    }

    var tokens = msg.split(' ')

    switch (tokens[0])
    {
        case '!commands':
            if (BuildingActive)
            {
                bot.chat('Currently building! Type "!stop" to cancel other building (or wait till completed) first.')
                return
            }
            if (tokens.length < 2)
            {
                bot.chat('Requires filename!')
                return
            }

            bot.chat('Starting...')
            
            await commandsLitematica(tokens.slice(1, tokens.length))
            break

        case '!place':
            bot.chat('Warning! This can be VERY SLOW. I recommend canceling this with !stop and instead using !commands')
            if (BuildingActive)
            {
                bot.chat('Currently building! Type "!stop" to cancel other building (or wait till completed) first.')
                return
            }
            if (tokens.length < 2)
            {
                bot.chat('Missing arguments! [!place FILENAME POS]')
                return
            }
            var pos = [] 
            try {
                pos = tokens.slice(2, 5)
                
            } catch (error) {
                bot.chat('!', error)
                return
            }

            if (pos.length < 3)
            {
                try {
                    bot.chat(`Position not specified! Using player's position`)
                    pos = [player.entity.position.x, player.entity.position.y, player.entity.position.z]
                    bot.chat(`${pos}`)
                } catch (error) {
                    bot.chat("ERROR: Player undefined or out of distance. Using bot's position.")
                    pos = [bot.entity.position.x.toFixed(0), bot.entity.position.y.toFixed(0), bot.entity.position.z.toFixed(0)]
                }
            }
            
            await placeLitematica(tokens[1], pos);
            break

        case '!stop':
            BuildingActive = false
            bot.chat('Stopping...')
            break

        case '!QUIT':
            BuildingActive = false
            bot.chat('Goodbye!')
            bot.quit()
            break
        
        case '!delay':
            bot.chat(`Delay: ${Delay}`)
            break

        

        case '!setdelay':
            if (tokens.length < 2)
            {
                bot.chat('Requires time delay (ms)!')
                return
            }
            try
            {
                Delay = parseFloat(tokens[1])
                bot.chat(`Set delay to: ${Delay}`)
            }
            catch (error)
            {
                bot.chat('Invalid argument type, requires a float or integer!')
                return
            }
            break

        case '!active':
            bot.chat(`Currently Building: ${BuildingActive}`)

            break

        case '!help':
            bot.chat(`
NAME      - ARGS                      - DESCRIPTION
!commands   [FILENAME]                  This builds the specified file
NOT RECOMMENDED: !place    [FILENAME]  [POS]  [CREATIVE] Places the blocks instead of using commands (Also allows you to specify position)
!stop                                   Stops the current process of building
!QUIT                                   The bot exits the game
!delay                                  Shows the current delay per block placed (ms). Default 1ms/block
!setdelay   [DELAY]                     Sets a new delay for building (ms)
!active                                 Shows if the bot is activally build currently
!help                                   Brings up this text
`)
    }
}

//-------------------------------------------------------------//
//-------------------------------------------------------------//
//-------------------------------------------------------------//


async function placeLitematica(filename, pos, increative=true) {
    BuildingActive = true

    var data = loadFile('data', filename);

    if (increative) {
        bot.creative.startFlying()
    }

    var numOfBlocks = getLengthOfData(data)
    var currentBlockNum = 1;
        
    for (var key in data) {

        if (data.hasOwnProperty(key)) {
            mass = data[key]
            // mass = data
            for (var rowkey in mass)
            {
                reachedDestination = true
                if (!BuildingActive)
                {
                    bot.chat('Canceled!')
                    return;
                }
                if (mass.hasOwnProperty(rowkey)) {
                    
                    var d = new Date();
                    var st = d.getSeconds()

                    row = mass[rowkey]

                    var x = roundFloatToInt(row[0][0] + pos[0])
                    var y = roundFloatToInt(row[0][1] + pos[1])
                    var z = roundFloatToInt(row[0][2] + pos[2])
                    var dx = x
                    var dy = y + 2
                    var dz = z

                    var blockType = row[1]
                    // bot.chat(`Block: ${x} ${y} ${z}: ${blockType}`)
                    // bot.chat(`Desired location: ${dx} ${dy} ${dz}`)
                    console.log(`Block: ${x} ${y} ${z}: ${blockType}`)
                    console.log(`Desired location: ${dx} ${dy} ${dz}`)

                    var block = bot.blockAt(vec3(x, y, z));

                    currentBlockNum += 1
                    


                    if (!block) {
                        bot.chat('Skipped')
                        continue
                    };
                    
                    console.log(`Current block there: ${block.name}`)
                    var replace = block.name != removePrefix(blockType, 'minecraft:');
                    console.log(`Will replace: ${replace}`)



                    if (!replace) {
                        continue
                    };
                
                    if (block && block.displayName != 'Air' && block.diggable)
                    {
                        await bot.dig(bot.blockAt(vec3(x, y, z)))
                    }

                    
                    


                    bot.chat(`/give @s ${blockType}`)
                    await bot.equipItem(removePrefix(blockType, 'minecraft:'), 'hand')
                    await moveToCoords(increative, dx, dy, dz)
                    await bot.placeBlock(block, determineFaceVector3(vec3(x, y, z))).catch((error) => {
                        // console.log('Failed to place block :(') // Sometimes logs it when it does place it sooooo
                        // bot.chat('Failed to place block :(')
                    })

                    
                    
                    
                    
                    
                    var d = new Date();
                    var et = d.getSeconds() - st
                    // bot.chat(`Took ${et} seconds to complete.`)
                    console.log(`Took ${et} seconds to complete.`)

                    var percentageComplete =  roundFloatToInt((currentBlockNum/numOfBlocks)*100, 2);
                    var leftNumOfBlocks = numOfBlocks - currentBlockNum
                    var estimatedTimeLeftSeconds = leftNumOfBlocks * et
                    var estimatedTimeLeft = convertSecondsToTime(estimatedTimeLeftSeconds)
                    
                    var logString = `${currentBlockNum}/${numOfBlocks}  -  ${percentageComplete}%  | ${estimatedTimeLeft} (estimated)`
                    bot.chat(logString)
                    console.log(logString)


                    console.log(`------------------------------------\n`)

                    
                }
            }
        }
        bot.chat(`Completed Layer: ${key}`)
        console.log(`Completed Layer: ${key}`)
    }
    bot.chat("Completed build: " + filename + '!');

    console.log("Completed build: " + filename + '!');
    BuildingActive = false

    // Safety block
    
    if (increative) {
        bot.creative.stopFlying()
    }
}


async function moveToCoords(increative, x, y, z) {
    reachedDestination = true
    if (increative && !(bot.entity.position.y == y && bot.entity.onGround)) {
        // bot.chat('Flying to destination')
        bot.creative.flyTo(vec3(x, y, z)).catch(() => {
            // bot.chat('Failed to reach achieve goal. (Fly)')
            reachedDestination = false
        })
    } else {
        //                                 POS    Allowed offset
        // bot.chat('Walking to destination')
        bot.pathfinder.setGoal(new GoalNear(x, y, z, 1))
        await bot.pathfinder.goto(new GoalBlock(x, y, z)).catch(() => {
            // bot.chat('Failed to reach achieve goal. (Walk)');
            reachedDestination = false;
        })
    }

    // bot.chat(`Reached destination: ${reachedDestination}`)

    return reachedDestination
}



//-------------------------------------------------------------//
//-------------------------------------------------------------//
//-------------------------------------------------------------//

async function commandsLitematica(filename) {
    BuildingActive = true;

    var data = loadFile('data', filename);
    

    bot.chat("/gamerule sendCommandFeedback false");

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            mass = data[key]
            
            for (var rowkey in mass)
            {
                if (!BuildingActive)
                {
                    bot.chat('Canceled!')
                    return;
                }
                if (mass.hasOwnProperty(rowkey)) {
                    row = mass[rowkey]
                    command = datapointToCommand(row)
                    // console.log(rowkey, ':', row);

                    bot.chat(command);
                    await new Promise(r => setTimeout(r, Delay));
                }
            }
        }
    }
    bot.chat("/gamerule sendCommandFeedback true");
    bot.chat("Completed build: " + filename + '!');

    console.log("Completed build: " + filename + '!');
    BuildingActive = false

}

function datapointToCommand(datapoint)
{
    var command = `/setblock ~${datapoint[0][0]} ~${datapoint[0][1]} ~${datapoint[0][2]} ${datapoint[1]}`
    return command
}


//-------------------------------------------------------------//
//-------------------------------------------------------------//
//-------------------------------------------------------------//

function loadFile(filepath='data', filename='test') {
    try {
        var data = require(`./${filepath}/${filename}.json`);
        return data;
    } catch (error) {
        bot.chat('Unknown file!');
        // console.log(error);
        return;
    }
}


function removePrefix(string, prefix)
{
    if (string.startsWith(prefix)) {
        // PREFIX is exactly at the beginning
        string = string.slice(prefix.length);
    }
    return string
}

function roundFloatToInt(float, digits=0) {
    var tenToN = 10 ** digits;
    return /*Math.trunc*/(Math.round(float * tenToN)) / tenToN;
}

function convertSecondsToTime (seconds) {
    var hours = Math.floor(seconds / 3600)
    var minutes = Math.floor((seconds % 3600) / 60)
    seconds = Math.floor(seconds / 60 / 60)
  
    return `${hours} hours, ${minutes} minutes, and ${seconds} seconds left`
}


function determineFaceVector3(blockPos) {

    var dx = blockPos.x
    var dy = blockPos.y
    var dz = blockPos.z

    var block = bot.blockAt(vec3(dx, dy-1, dz))
    if (block && block.displayName != 'Air' && block.diggable) {
        return vec3(0,-1,0)
    }
    var block = bot.blockAt(vec3(dx, dy+1, dz))
    if (block && block.displayName != 'Air' && block.diggable) {
        return vec3(0,1,0)
    }
    var block = bot.blockAt(vec3(dx-1, dy, dz))
    if (block && block.displayName != 'Air' && block.diggable) {
        return vec3(-1,0,0)
    }
    var block = bot.blockAt(vec3(dx+1, dy, dz))
    if (block && block.displayName != 'Air' && block.diggable) {
        return vec3(1,0,0)
    }
    var block = bot.blockAt(vec3(dx, dy, dz-1))
    if (block && block.displayName != 'Air' && block.diggable) {
        return vec3(0,0,-1)
    }
    var block = bot.blockAt(vec3(dx, dy, dz+1))
    if (block && block.displayName != 'Air' && block.diggable) {
        return vec3(0,0,1)
    }

    console.log('ERROR: NO OPEN FACES')
    return vec3(0,1,0) // Sometimes the bot will glitch and be able to place anyways
}



// Inventory Managment: https://github.com/PrismarineJS/mineflayer/blob/fe549f88476f3739c7952d91ec7fa603d9513414/examples/inventory.js#L99
function equipItem (name, destination) {
    const item = itemByName(name)
    if (item) {
        bot.equip(item, destination, () => {console.log})
    } else 
    {
        console.log(`ERROR: I have no ${name} to equip`)
    }
}

function itemByName (name) {
    return bot.inventory.items().filter(item => item.name === name)[0]
}

function getLengthOfData(data) {
    flatternedData = [].concat(...Object.values(data));
    return flatternedData.length
}
