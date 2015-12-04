/// Slots.js

//bar = 'http://i.imgur.com/b6k32zM.png'
//bell = 'http://i.imgur.com/T161HYi.png'
//cherry = 'http://i.imgur.com/5Fu60pP.png'
//grapes = 'http://i.imgur.com/WM4whuc.png'
//seven = 'http://i.imgur.com/8glKS86.png'
var path = require('path');
var fs = require('fs');
//functions
function currencyName (amount) {
	var name = " buck";
	return amount === 1 ? name : name + "s";
}

function logMoney (message) {
	if (!message) return;
	var file = path.join(__dirname, '../logs/money.txt');
	var date = "[" + new Date().toUTCString() + "] ";
	var msg = message + "\n";
	fs.appendFile(file, date + msg);
}

function awardMoney (user, amount, _this) {
	Database.read('money', toId(user), function (err, initial) {
					    if (err) throw err;
					    if (!initial) initial = 0;
						    Database.write('money', initial + amount, toId(user), function (err, total) {
						    if (err) throw err;
						    amount += currencyName(amount);
						    total += currencyName(total);
							_this.sendReply(user + " was given " + amount + ". " + user + " now has " + total + ".");
							if (Users.get(user)) Users.get(user).popup("You have won " + amount + " from slots. You now have " + total + ".");
							logMoney(user + " has won " + amount + " from slots.");
					    });
				    });
}

//variables
var userstimeout = {}
var Arrayslots = []; 
var numofsevens = 3;
var numofbars = 8;
var numofbells = 13;
var numofgrapes = 18;
var numofcherrys = 25;
var i;

for(i = 0; i < numofsevens; i+= 1){
	Arrayslots.push('seven');
}
for(i = 0; i < numofbars; i+= 1){
	Arrayslots.push('bar');
}
for(i = 0; i < numofbells; i+= 1){
	Arrayslots.push('bell');
}
for(i = 0; i < numofgrapes; i+= 1){
	Arrayslots.push('grapes');
}
for(i = 0; i < numofcherrys; i+= 1){
	Arrayslots.push('cherry');
}
//slots
slotsarray = {
	bar: 'http://i.imgur.com/b6k32zM.png',
    bell: 'http://i.imgur.com/T161HYi.png',
    cherry: 'http://i.imgur.com/5Fu60pP.png',
    grapes: 'http://i.imgur.com/WM4whuc.png',
    seven: 'http://i.imgur.com/8glKS86.png'
};

exports.commands = {
	'slots': function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (!userstimeout[toId(user)]){
			userstimeout[toId(user)] = {
				timeout:false,
			    warned:false,
			    counter:false,
			    count:0
			}
			
		}
		var useramount;
		
		Database.read('money', toId(user), function (err, amount) {
            if (err) throw err;
            if (!amount) amount = 0;
	        useramount = amount;
            //this.sendReplyBox(Tools.escapeHTML(user) + " has " + amount + currencyName(amount) + ".");
            room.update();
        }.bind(this));
		
		if (useramount < 1){
				return this.sendReplyBox("You don't have enough bucks to play.");			
		}else{
			if (userstimeout[toId(user)].counter == true){
				if (userstimeout[toId(user)].warned == false){
					userstimeout[toId(user)].warned = true;
					return this.sendReplyBox("You have to wait a minute before you can play again.");	
				}else{
					return false;
				}
			}else{
				if (userstimeout[toId(user)].count < 15){
					userstimeout[toId(user)].count += 1;
					
					
				    var amount = -1;
				    Database.read('money', toId(user), function (err, initial) {
					    if (err) throw err;
					    if (!initial) initial = 0;
						    Database.write('money', initial + amount, toId(user), function (err, total) {
						    if (err) throw err;
						    amount += currencyName(amount);
						    total += currencyName(total);
					    });
				    });
					
					var reelarray = Arrayslots;
				 var outcome = [];
				 for(i=0; i<3; i+=1){
					 var rand = (Math.round(Math.random()*(reelarray.length-1)));
						 outcome.push(reelarray[rand]);
						if (reelarray[rand] == 'seven'){
							outcome.push(slotsarray.seven);
						} 
						if (reelarray[rand] == 'bar'){
							outcome.push(slotsarray.bar);
						} 
						if (reelarray[rand] == 'bell'){
							outcome.push(slotsarray.bell);
						} 
						if (reelarray[rand] == 'grapes'){
							outcome.push(slotsarray.grapes);
						} 
						if (reelarray[rand] == 'cherry'){
							outcome.push(slotsarray.cherry);
						} 
				 }
				 //this is where you have to beautify it. I think the image sizes should be a little smaller. work ur  magic :)
				 var _this = this;
				 this.sendReplyBox('<div style="background-image: url(&quot;http://thepokeheat.cu.cc/images/avatars/slotsgame.png&quot;); background-repeat:no-repeat; background-size: 30%; background-position: center; border-style: solid ; border-radius: 4px ; border-color: black ;"><center><font size="6" color="white">Game Corner Slots</font></center><div><center>&nbsp;&nbsp;<img src='+outcome[1]+' width="30" height="30">&nbsp;&nbsp;&nbsp;&nbsp;<img src='+outcome[3]+' width="30" height="30">&nbsp;&nbsp;&nbsp;&nbsp;<img src='+outcome[5]+' width="30" height="30"></center></div><br><br></div>');
				 if (outcome[0]+outcome[2]+outcome[4] == "sevensevenseven"){
					awardMoney(user, 500, _this);
					return room.add("Congratulations to "+user+" for winning the jackpot of 500 bucks. If you wanna try your chance at winning do /slots.");
					 
				 }else if (outcome[0]+outcome[2]+outcome[4] == "barbarbar"){
					awardMoney(user, 300, _this);
					return this.sendReplyBox("Congrats on winning. You've won 300 bucks.");
					
				 }else if (outcome[0]+outcome[2]+outcome[4] == "bellbellbell"){
					 awardMoney(user, 150, _this);
					return this.sendReplyBox("Congrats on winning. You've won 150 bucks.");
					 
				 }else if (outcome[0]+outcome[2]+outcome[4] == "grapesgrapesgrapes"){
					 awardMoney(user, 75, _this);
					return this.sendReplyBox("Congrats on winning. You've won 75 bucks.");
					 
					 
				 }else if (outcome[0]+outcome[2]+outcome[4] == "cherrycherrycherry"){
					 awardMoney(user, 50, _this);
					return this.sendReplyBox("Congrats on winning. You've won 50 bucks.");
					 
				 }else{
					 return this.sendReplyBox("Sorry, not a winner. Try again?");
				 }
				}else{
					userstimeout[toId(user)].counter = true;
					this.sendReplyBox("You have to wait a minute before you can play again.");
					userstimeout[toId(user)].timeout = setTimeout(function(){
				        userstimeout[toId(user)].counter = false;
						userstimeout[toId(user)].warned = false;
						userstimeout[toId(user)].count = 0;
			        }.bind(this), 60000);
				}
			}
		}
	}		
						
};
