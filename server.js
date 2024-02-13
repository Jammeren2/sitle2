const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = 62124;

app.use(bodyParser.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

async function getPlayerClanStats(playerId) {
    const url = `https://romansh.ru/blitz/ru/player/${playerId}`;
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const clanStatsTable = $('table.clanStat').html();
    return clanStatsTable;
}

app.post('/search', async (req, res) => {
    // Получаем значение никнейма из тела запроса
    const nickname = req.body.nickname;

    try {
        // Получаем id игрока
        const playerId = await getPlayerId(nickname);
        
        if (!playerId) {
            throw new Error('Player not found');
        }

        // Получаем статистику игрока и клана
        const playerStats = await getPlayerStats(playerId);
        const clanStats = await getPlayerClanStats(playerId);

        // Возвращаем статистику игрока и клана клиенту
        res.json({ playerStats: playerStats, clanStats: clanStats });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

async function getPlayerId(nickname) {
    const url = `https://romansh.ru/blitz/ru/player-search/${nickname}`;
    const response = await fetch(url);
    const data = await response.json();
    if ("success" in data && data["success"].length > 0) {
        const player_id = data["success"][0]["id"];
        return player_id;
    }
    return null;
}

async function getPlayerStats(playerId) {
    const url = `https://romansh.ru/blitz/ru/player/${playerId}`;
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const playerStatsTable = $('table.playerInfoTable').html();
    return playerStatsTable;
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
