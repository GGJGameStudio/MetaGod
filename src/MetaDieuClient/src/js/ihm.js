function initIhm(){
    //faith score
    var text = "";
    var style = { font: "bold 25px Courier", fill: "#770022", align: "center" };

    client.scoreText = game.add.text(client.windowWidth - 400, 20, text, style);

    client.ihm = game.add.sprite(20, client.windowHeight - 75, 'ihm');
    client.ihm1 = game.add.sprite(20, client.windowHeight - 75, 'ihm1');
    client.ihm2 = game.add.sprite(20 + 64, client.windowHeight - 75, 'ihm2');
    client.ihm3 = game.add.sprite(20 + 64 * 2, client.windowHeight - 75, 'ihm3');
    client.ihm2.visible = false;
    client.ihm3.visible = false;

    client.ihm1.inputEnabled = true;
    client.ihm2.inputEnabled = true;
    client.ihm3.inputEnabled = true;

    /*client.ihm1.input.onInputDown.add(skill1);
    client.ihm2.input.onInputDown.add(skill2);
    client.ihm3.input.onInputDown.add(skill3);*/
    
    client.ihm1.events.onInputDown.add(skill1, this);
    console.log(client.ihm1);
    console.log(client.ihm2);

    client.ihmGroup.add(client.ihm);
    client.ihmGroup.add(client.ihm1);
    client.ihmGroup.add(client.ihm2);
    client.ihmGroup.add(client.ihm3);
}


function faithScoreText(players){
    var text = "";
    for(var i = 0 ; i < players.length ; i++){
        var player = players[i];
        var maxnamelength = 15;
        text += player.username;
        var namelength = (player.username + "").length;
        for(var j = namelength; j < maxnamelength ; j++) text += " ";
        text += "  ";
        var maxscorelength = 6;
        var scorelength = (player.faithScore + "").length;
        for(var j = scorelength; j < maxscorelength ; j++) text += " ";
        text += player.faithScore;
        text += "\n"
    }
    return text;
}