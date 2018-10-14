const Discord = require('discord.js')
const bot = new Discord.Client()
const rp = require('request-promise');
const cheerio = require('cheerio');
let axios = require('axios');

var prefix = "s?"

bot.login('')

bot.on('ready', function(){
  console.log('The bot is online!')
  bot.user.setActivity(`on ${bot.guilds.size} servers`)
})

bot.on('message', function(msg) {
  if(!msg.content.startsWith(prefix)){
    return;
  }
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift();
  if(msg.content === prefix + ""){
    msg.channel.send("No command supplied.")
    //hewwo(msg, "")
    //console.log(heylisten(msg))
    return;
  }
  if(msg.content === prefix + "help"){
    msg.channel.send("Type s?character <character> or s?dragon <dragon> accordingly")
    return;
  }
  if(command.includes("sierra")){
    msg.channel.send("Sierra is S+ Tier.")
    return;
  }
  if(command.includes("dragon")){
  const nodragon = msg.content.slice(9);
  if(command != ''){
      dragon(msg, nodragon)
      return;
    }
  }
  if(command.includes("character")){
    const nochar = msg.content.slice(11);
  if(command != ''){
      characters(msg, nochar)
      return;
    }
  }
  if(command.includes("wyrm")){
    const nochar = msg.content.slice(7);
  if(command != ''){
      wyrm(msg, nochar)
      return;
    }
  }
  if(command == "ragutesting"){
    console.log(parseclass('<div style="margin:-2px 0 0 1px"><img alt="Icon Type Row Attack.png" src="https://d1u5p3l4wpay3k.cloudfront.net/dragalialost_gamepedia_en/thumb/8/85/Icon_Type_Row_Attack.png/105px-Icon_Type_Row_Attack.png?version=34836f95c6ba41ceec9cb8d9c6fc5b50" width="105" height="21" srcset="https://d1u5p3l4wpay3k.cloudfront.net/dragalialost_gamepedia_en/8/85/Icon_Type_Row_Attack.png?version=34836f95c6ba41ceec9cb8d9c6fc5b50 1.5x"></div>'));
    return;
  }

})

function dragon(msg, h){

const options = {
  uri: `https://dragalialost.gamepedia.com/` + h,
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    var value = []
    var stat = []
    var a = ''
    $('.dt-term').each(function(i, elem) {
        value[i] = $(this).text();
    });
    $('.dd-description').each(function(i, elem) {
      if(value[i] != 'Rarity'){
        stat[i] = $(this).text();
      } else {
        stat[i] = parseit($(this).html());
      }
    });
    for(var i = 0; i < value.length; i++){
        a = a + ' \n' + value[i] + ': ' + stat[i];
    }
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + ' \n' + a);
    } else {
      msg.channel.send('Could not find stat data for: ' + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
    console.log(a)
  })
  .catch((err) => {
    console.log(err);
  });

//return 'Data not found';
}

function characters(msg, h){

const options = {
  uri: `https://dragalialost.gamepedia.com/` + h,
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    var value = []
    var value1 = []
    var value2 = []
    var stat = []
    var a = ''
    //$('.dt-term').each(function(i, elem) {
        //value[i] = $(this).text();
    //});
    $('.tooltip').each(function(i, elem){
      if(i % 2 == 0 && i < 4){
        value[i] = parsething($(this).html());
      } else if(i < 4){
        value[i] = parsestat($(this).html());
      } else if(i < 6){
        value[i] = parsestat($(this).html());
      }
    })
    $('.dt-term').each(function(i, elem) {
        value1[i] = $(this).text();
    });
    $('.dd-description').each(function(i, elem) {
      if(value1[i] != 'Class' && value1[i] != 'Base Rarity'){
        stat[i] = $(this).text();
      } else if(value1[i] == 'Class') {
        stat[i] = parseclass($(this).html());
      } else {
        stat[i] = parseit($(this).html())
      }
    });
    try{
    a = a + ' \n' + value[0] + ': ' + value[1].substring(0, value[1].length - 1) + ' With Maxed Mana Circle)' + ' \n' + value[2] + ': ' + value[3].substring(0, value[3].length - 1) + ' With Maxed Mana Circle)'
    a = a + ' \n' + value1[0] + ': ' + stat[0]
    a = a + ' \n' + 'Base Min Might: ' + value[4]
    a = a + ' \n' + 'Base Max Might: ' + value[5]
    }
    catch(err){
      var backedup = [];
      var backedupa = '';
      //msg.channel.send("Fuck you go to the wiki: " + "https://dragalialost.gamepedia.com/" + h.slice(1))
      $('li').each(function(i, elem){
        backedup[i] = $(this).html();
      })
      var backedupa = parsenotevent(backedup[backedup.length - 71])
      characters(msg, backedupa)
      return;
    }
    for(var i = 1; i < value1.length; i++){
        a = a + ' \n' + value1[i] + ': ' + stat[i];
    }
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + ' \n' + a);
    } else {
      msg.channel.send('Could not find stat data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
    console.log(a)
  })
  .catch((err) => {
    console.log(err);
  });

//return 'Data not found';
}

function wyrm(msg, h){

const options = {
  uri: `https://dragalialost.gamepedia.com/` + h,
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    var value = []
    var value1 = []
    var stat = []
    var a = ''
    $('.dt-term').each(function(i, elem) {
        value[i] = $(this).text();
    });
    $('.dd-description').each(function(i, elem) {
      if(value[i] != 'Rarity'){
        stat[i] = $(this).text();
      } else {
        stat[i] = $(this).text().substring(0, $(this).text().length - 2) + "*";
      }
    });
    $('.tooltip').each(function(i, elem){
        value1[i] = parsestat($(this).html());
    })
    for(var i = 0; i < 2; i++){
        a = a + ' \n' + value[i] + ': ' + stat[i];
    }
    a = a + ' \n' + 'Base Min Might: ' + value1[0]
    a = a + ' \n' + 'Base Max Might: ' + value1[1]
    for(var i = 2; i < value.length; i++){
        a = a + ' \n' + value[i] + ': ' + stat[i];
    }
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + ' \n' + a);
    } else {
      msg.channel.send('Could not find stat data for: ' + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
    console.log(a)
  })
  .catch((err) => {
    console.log(err);
  });

//return 'Data not found';
}

function parseit(param){
  var regex = /(.*)Icon Rarity Row (\d*)\.png(.*)/i
  let matches = param.match(regex)
  return matches[2] + '*';
}

function parsething(param){
  var regex = /(\w*)<(.*)/i
  let matches = param.match(regex)
  return matches[1];
}

function parsestat(param){
  var regex = /(.*)\<\/span\>(.*)/i
  let matches = param.match(regex)
  return matches[2];
}

function parseclass(param){
  var regex = /(.*)Icon Type Row (\w*)\.png(.*)/i
  let matches = param.match(regex)
  return matches[2] + 'er';
}

function parsenotevent(param){
  var regex = /(.*)href=\"\/(\S*)\"(.*)/i
  let matches = param.match(regex)
  return matches[2];
}

function parsewyrm(param){
  var regex = /(.*)href=\"\/(\S*)\"(.*)/i
  let matches = param.match(regex)
  return matches[2];
}
