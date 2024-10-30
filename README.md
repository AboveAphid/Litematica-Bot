# INSTRUCTIONS
### Prep Data
1. Firstly download a litematica file you would like to use. I recommend downloading them from https://www.minecraft-schematics.com/
2. Next place the downloaded file (HAS TO BE: .litematica) into the "LitematicaSchematics" folder
3. Afterwards run "litematic-converter.py" and then input the name of the litematic (without the ending extension)
4. Now 2(ish) files should have appeared in the "Generated Files" and a folder with the same name as the litematica file

### Prep Bot
1. Move the "NAME.json" file into the "Bot/data" folder
2. Now move into the index.js file in the "Bot" folder
3. Change the info in config.json file to the needed minecraft version, username, password (if logging into a real Account), server ip, and server port.
4. Next run the following commands:
   > `npm init -y`
   > `npm install mineflayer mineflayer-pathfinder minecraft-data vec3`
   > `node index.js` OR `node .`
5. If using the supply chest option place a chest with the materials needed at the coords (specified in the config.json file)

### Run the bot!
1. (If needed and using !place) Refill the supply chest with needed blocks
2. Hop on to the server your bot logged into
2.5. Next you can type !help in chat for a list of commands (WARNING: If it is a public server it will be visible to all)
3. Position the bot where you want the model to spawn (if no coords specified it will use the player as anchor coords)
4. Now send in chat `!commands FILENAME` E.g. `!commands test` and this will use that `NAME.json` OR `test.json` file | Or you can use `!place FILENAME` to manually place the blocks
5. Now watch as it appears in front of your eyes 😲

## NOTES
- I switched accounts so this is a fork into my new account. The old account has outdated code btw / lacks some new features.
- Check the ./config.json file in the Bot folder for more configuration options of the bot.
- The bot will require OP to run the commands like /setblock, etc* Unless you use supply chest mode (check config.json in ./Bot)
- Currently anyone will be able to use the chat commands so that could lead to issues if multiple structures are being placed at once.. Please don't try and build two things at once!

## EXTRA CREDITS
- Thanks to Johnson also known as "y3621555" on github for the updated / more survival friendly* pathfinding algorithm!
*Kind of it's definitely way faster, good for creative as well
