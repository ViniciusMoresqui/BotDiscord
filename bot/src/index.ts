import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

// Estendemos o tipo do client para incluir a coleção de comandos
const client: any = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Carregar os comandos da pasta commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

client.once('ready', (readyClient: any) => {
    console.log(`Bot online! Sessão iniciada como ${readyClient.user.tag}`);
});

// Ouvir e executar os comandos de barra (Slash Commands)
client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);