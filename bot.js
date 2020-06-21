/* 
   Read the password and username from the configfile wihtin
   the directory
*/

const fs = require('fs');
var config = fs.readFileSync("./config.txt", {encoding: 'utf-8'});
config = config.split("\n");
userName = config[0].split(":")[1];
pw = config[1].split(":")[1];
desc = config[2].split(":")[1];

const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
      username: userName,
      password: pw
  },
  channels: [
      'paradoxialbot'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

var startTime = Date.now()
var ggcount = 0;

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();
    

    // If the command is known, let's execute it
    if (commandName === '!dice') {
	const num = rollDice();
	client.say(target, `You rolled a ${num}`);
	console.log(`* Executed ${commandName} command`);
    }
    else if (commandName === '!gg'){
	++ggcount;
	client.say(target, `GG:s have been called ${ggcount} times this session!`);
    }
    else if(commandName ==='!uptime') {
	var sender = "@" + context.username;
	var onlineTime = Date.now() - startTime;
	var seconds = onlineTime / 10;
	var m = 0;
	var h = 0;
	
	if((seconds / 60) > 1) {
	    m = Math.floor( seconds / 60 );
	    seconds = seconds % 60;	  
	}
	if(m / 60 > 1) {
	    h = Math.floor(m / 60);
	    m = m % 60;
	}
	
	client.say(target,`${context.username}, Paradoxial have been online for ${h} hours and ${m} minutes!`)
    }
    else if ( commandName ==='!about') {
	client.say(target, `@${context.username}, ${desc}`);
    }
    else {
	console.log(`* Unknown command ${commandName}`);
    } 
}
// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
