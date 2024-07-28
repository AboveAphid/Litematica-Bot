# INSTRUCTIONS
### Prep Data
1. Firstly download a litematica file you would like to use. I recommend downloading them from https://www.minecraft-schematics.com/
2. Next place the downloaded file (HAS TO BE: .litematica) into the "LitematicaSchematics" folder
3. Afterwards run "litematic-converter.py" and then input the name of the litematic (without the ending extension)
4. Now 2(ish) files should have appeared in the "Generated Files" and a folder with the same name as the litematica file

### Prep Bot
6. Move the "NAME.json" file into the "Bot/data" folder
7. Now move into the index.js file in the "Bot" folder
8. Change the info in createbot to the needed minecraft version, username, password (if needed), server ip, and server port.
9. Run the following commands:
   > `npm init -y`
   > `npm install mineflayer mineflayer-pathfinder minecraft-data vec3`
   > `node index.js` OR `node .`

### Run the bot!
1. Hop on to the server your bot logged into
1.5. Next you can type !help in chat for a list of commands (WARNING: If it is a public server it will be visible to all)
2. Position the bot where you want the model to spawn
3. Now send in chat `!commands FILENAME` E.g. `!commands test` and this will use that `NAME.json` OR `test.json` file
4. Now watch as it appears in front of your eyes 😲

## NOTES
- I switched accounts so this is a fork into my new account
- The bot will require OP to run the commands like /setblock, etc
- Currently anyone will be able to use the chat commands so that could lead to issues if multiple structures are being placed at once..
