from litemapy import Schematic, Region
import json, os

FOLDER = "LitematicaSchematics\\"
SAVEFOLDER = 'Generated Files'
FILENAME = input('Filename: ') #"test"
DEFAULTFILENAME = FILENAME

# Load the schematic and get its first region
schem = Schematic.load(FOLDER + FILENAME + ".litematic")
reg: Region = list(schem.regions.values())[0]

# Print out the basic shape and read litematica
sections = {}
section = []
i = 0
for y in reg.range_y():
    for x in reg.range_x():
        for z in reg.range_z():
            b = reg[x, y, z]
            if b.id == "minecraft:air":
                print(" ", end="")
            else:
                print("#", end='')

                section.append([(x, y, z), b.id])
        print()
    
    print('\n\n')
    sections[i] = section
    i += 1
    section = []


if os.path.exists(f'{SAVEFOLDER}\\{FILENAME}'):
    if input('Folder already exists! Would you like to overide with new processed data? (y/N) ').lower() == 'y':
        if input('Are you SURE you want to overide these files? (y/N) ').lower() == 'y':
            print('Overiding...')
        else:
            print("Operation canceled!")
    else:
        # Find a folder that isn't used/existing yet
        FILENAME = f'{DEFAULTFILENAME}_{i}'
        i = 0
        while os.path.exists(os.path.join(SAVEFOLDER, FILENAME)):
            FILENAME = f'{DEFAULTFILENAME}_{i}'
            print('Trying new name:', FILENAME)
            i += 1

# Create folder
print("Saved to:", FILENAME)
os.mkdir(f'{SAVEFOLDER}\\{FILENAME}')

# Export out into json for other files to read
with open(f'{SAVEFOLDER}\\{FILENAME}\\{FILENAME}.json', 'w') as f:
    json.dump(sections, f)

with open(f'{SAVEFOLDER}\\{FILENAME}\\{FILENAME}-readable.json', 'w') as f:
    json.dump(sections, f, indent=4)
