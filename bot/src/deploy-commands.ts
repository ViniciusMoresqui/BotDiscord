import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const commands: any[] = [];
const commandsPath = path.join(__dirname, 'commands');

// Lê os arquivos dentro da pasta 'commands'
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

(async () => {
    try {
        console.log(`A iniciar a atualização de ${commands.length} comandos (/) da aplicação.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID as string),
            { body: commands },
        ) as any[];

        console.log(`Sucesso! ${data.length} comandos (/) recarregados.`);
    } catch (error) {
        console.error(error);
    }
})();