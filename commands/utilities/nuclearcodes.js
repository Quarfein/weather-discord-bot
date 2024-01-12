const { SlashCommandBuilder } = require('discord.js')
require('dotenv').config()
const axios = require('axios')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuclearcodes')
    .setDescription('...don\'t tell the gov about this...'),
  async execute (interaction) {
    await interaction.reply(`The nuclear codes are: ${genCodes()}`)
    // await interaction.followUp(await getExplosion())
  }
}

function genCodes () {
  const codes = []
  for (let i = 0; i < 8; i++) {
    codes.push(Math.floor(Math.random() * 10))
  }
  return codes.join('')
}

async function getExplosion () {
  const API_KEY = process.env.API_GIF

  const promise = axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=bomb&rating=r`)

  const data = await promise.then((response) => response.data)

  return data.data.embed_url
}
