const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Gives the current weather in the specified city!')
    .addStringOption(option =>
      option.setName('city')
        .setDescription('City to fetch weather from.')
        .setRequired(true)),
  async execute (interaction) {
    await interaction.deferReply()
    let city = interaction.options.getString('city')
    city = cleanString(city)
    try {
      const data = await getWeather(city)
      const { weather } = data
      // eslint-disable-next-line camelcase
      const { temp, feels_like, humidity, pressure } = data.main
      // eslint-disable-next-line camelcase
      await interaction.editReply(`Currently, in ${city}:\n${temp}°C - Feels like ${feels_like}°C\n${humidity}% humidity and ${pressure}hPa pressure\n${weather[0].main} - ${weather[0].description}`)
    } catch (error) {
      console.log(error)
      await interaction.editReply(`Sorry, I couldn't find ${city}.`)
    }
  }
}

async function getWeather (city) {
  const API_KEY = process.env.API_WEATHER

  console.log(`Getting coordinates of ${city}...`)

  let promise = axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`)

  let data = await promise.then((response) => response.data)

  const { lat, lon } = data[0]

  console.log(`Getting weather of ${city}, located in ${lat}, ${lon}...`)

  promise = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)

  data = await promise.then((response) => response.data)

  return data
}

function cleanString (string) {
  let modString = string.toLowerCase()
  modString = modString[0].toUpperCase() + modString.slice(1)
  return modString
}
