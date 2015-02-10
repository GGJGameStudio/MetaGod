function initPlayers(players){
    for(var i = 0 ; i < players.length ; i++){
        if (players[i].id == playerId) {
            client.color = players[i].color;
        }
    }
}

function updatePlayers(players){
    client.players = players;
    client.scoreText.text = faithScoreText(players);
}