import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import axios from 'axios';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feriados')
        .setDescription('Mostra os feriados nacionais do ano atual (Brasil API)'),
        
    async execute(interaction: CommandInteraction) {
        // Diz ao Discord para esperar um pouco enquanto o bot vai buscar os dados à API
        await interaction.deferReply(); 

        try {
            const anoAtual = new Date().getFullYear();
            const resposta = await axios.get(`https://brasilapi.com.br/api/feriados/v1/${anoAtual}`);
            const feriados = resposta.data;

            if (feriados.length === 0) {
                return interaction.editReply(`Não encontrei feriados para o ano ${anoAtual}.`);
            }

            // Formata a data (de YYYY-MM-DD para DD/MM/YYYY) e o nome dos primeiros 15 feriados
            const listaFormatada = feriados
                .slice(0, 15)
                .map((f: any) => {
                    const dataPt = f.date.split('-').reverse().join('/');
                    return `**${dataPt}**: ${f.name}`;
                })
                .join('\n');

            await interaction.editReply(`📅 **Feriados Nacionais em ${anoAtual}:**\n\n${listaFormatada}`);
            
        } catch (erro) {
            console.error(erro);
            await interaction.editReply('Desculpe, ocorreu um erro ao comunicar com a Brasil API.');
        }
    },
};