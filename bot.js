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
    msg.channel.send("Type s?character <(optional) stats/coability/abilities> <character>, s?dragon <dragon>, or s?wyrm <wyrmprint> accordingly")
    return;
  }
  if(command.includes("sierra")){
    msg.channel.send("Sierra is S+ Tier.")
    return;
  }
  if(command.includes("dragon")){
    var nodragon = msg.content.slice(9);
    nodragon = nodragon.replace(" ", "_")
  if(command != ''){
      dragon(msg, nodragon)
      return;
    }
  }
  if(command.includes("character")){
    var nochar = msg.content.slice(12);
    if(nochar.includes("skill") || nochar.includes("skills")){
        if(nochar.includes("skills")){
          nochar = nochar.slice(7);
        } else {
          nochar = nochar.slice(6);
        }
        characterskill(msg, nochar)
        return;
      }
    if(nochar.includes("co-ability") || nochar.includes("coability")){
        if(nochar.includes("co-ability")){
          nochar = nochar.slice(11);
        } else {
          nochar = nochar.slice(10);
        }
        charactercoability(msg, nochar)
        return;
      }
    if(nochar.includes("abilities") || nochar.includes("ability")){
        if(nochar.includes("abilities")){
          nochar = nochar.slice(10);
        } else {
          nochar = nochar.slice(8);
        }
        characterabilities(msg, nochar)
        return;
      }
    if(nochar.includes("stat") || nochar.includes("stats")){
        if(nochar.includes("stats")){
          nochar = nochar.slice(6);
        } else {
          nochar = nochar.slice(5);
        }
        characters(msg, nochar)
        return;
      }
  if(command != ''){
      characters(msg, nochar)
      return;
    }
  }
  if(command.includes("wyrm")){
    var nochar = msg.content.slice(7);
    nochar = nochar.replace(" ", "_")
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
    var value2 = []
    var value3 = []
    var stat = []
    var a = ''
    var p = []
    $('p').each(function(i, elem) {
        //console.log($(this).text())
        p[i] = $(this).text();
    });
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
    $('table').each(function(i, elem){
        value2[i] = parsedragon($(this).html())// + ':';
        //value3[i] = console.log($(this).html().replace(" ", ""));//parsesability($(this).html()));
        value3[i] = parsedragonability($(this).html());
    })
    //a = a + ' \n\n' + '**Abilities**'
    //for(var i = 0; i < value2.length; i++){
      //a = a + ' \n' + value2[i] + '\n' + value3[i];
    //}
    for(var i = 0; i < value.length; i++){
        a = a + ' \n' + value[i] + ': ' + stat[i];
    }
    a = a + ' \n\n' + '**Skills**'
    a = a + ' \n' + value2[0] + '\n' + value3[0];
    a = a + ' \n\n' + '**Abilities**'
    a = a + ' \n' + value2[1] + '\n' + value3[1];
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + ' \n\n' + '**Stats**' + a);
    } else {
      msg.channel.send('Could not find stat data for: ' + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
  })
  .catch((err) => {
    msg.channel.send('Could not find skill data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
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
    var p = []
    $('p').each(function(i, elem) {
        p[i] = $(this).text();
    });
    if(p[0] == "There is currently no text in this page."){
      msg.channel.send('Could not find character: ' + h + ' (Note: wyrmprints are case sensitive)' )
      return;
    }
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
    $('th').each(function(i, elem){
        value2[i] = $(this).text().replace('\n', '').slice(2)//parsedragon($(this).html())// + ':';
        //value3[i] = console.log($(this).html().replace(" ", ""));//parsesability($(this).html()));
        //value3[i] = parsedragonability($(this).html());
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
    /*var x = 1;
    a = a + ' \n\n' + '**Skills**'
    a = a + ' \n' + value2[0] + ':';
    for(var i = 7; i < 10; i++){
        a = a + ' \n' + 'Level ' + x + ': ' + p[i]
        x++
    }
    a = a + ' \n' + value2[1] + ':';
    x = 1
    for(var i = 10; i < 12; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    a = a + ' \n\n' + '**Co-Abilities**'
    a = a + ' \n' + value2[2] + ':';
    x = 1
    for(var i = 13; i < 18; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    a = a + ' \n\n' + '**Abilities**'
    a = a + ' \n' + value2[3] + ':';
    x = 1
    for(var i = 19; i < 21; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    a = a + ' \n' + value2[4] + ':';
    x = 1
    for(var i = 21; i < 23; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    a = a + ' \n' + value2[5] + ':';
    x = 1
    a = a + ' \n' + 'Level ' + x + ': ' + p[23]
    x++
    if(p[24].charAt(p[24].length) != " "){
      a = a + ' \n' + 'Level ' + x + ': ' + p[24]
    }*/
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + ' \n\n' + '**Stats**' + a);
    } else {
      msg.channel.send('Could not find stat data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
  })
  .catch((err) => {
    msg.channel.send('Could not find skill data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
  });

//return 'Data not found';
}

function characterskill(msg, h){

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
    var p = []
    $('p').each(function(i, elem) {
        p[i] = $(this).text();
    });
    if(p[0] == "There is currently no text in this page."){
      msg.channel.send('Could not find character: ' + h + ' (Note: wyrmprints are case sensitive)' )
      return;
    }
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
    $('th').each(function(i, elem){
        value2[i] = $(this).text().replace('\n', '').slice(2)//parsedragon($(this).html())// + ':';
        //value3[i] = console.log($(this).html().replace(" ", ""));//parsesability($(this).html()));
        //value3[i] = parsedragonability($(this).html());
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
    var x = 1;
    a = ' \n\n' + '**Skills**'
    a = a + ' \n' + value2[0] + ':';
    for(var i = 7; i < 10; i++){
        a = a + ' \n' + 'Level ' + x + ': ' + p[i]
        x++
    }
    a = a + ' \n' + value2[1] + ':';
    x = 1
    for(var i = 10; i < 12; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + a);
    } else {
      msg.channel.send('Could not find skill data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
  })
  .catch((err) => {
    msg.channel.send('Could not find skill data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
  });

//return 'Data not found';
}

function charactercoability(msg, h){

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
    var p = []
    $('p').each(function(i, elem) {
        p[i] = $(this).text();
    });
    if(p[0] == "There is currently no text in this page."){
      msg.channel.send('Could not find character: ' + h + ' (Note: wyrmprints are case sensitive)' )
      return;
    }
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
    $('th').each(function(i, elem){
        value2[i] = $(this).text().replace('\n', '').slice(2)//parsedragon($(this).html())// + ':';
        //value3[i] = console.log($(this).html().replace(" ", ""));//parsesability($(this).html()));
        //value3[i] = parsedragonability($(this).html());
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
    a = ' \n\n' + '**Co-Abilities**'
    a = a + ' \n' + value2[2] + ':';
    x = 1
    for(var i = 13; i < 18; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    /*a = a + ' \n\n' + '**Abilities**'
    a = a + ' \n' + value2[3] + ':';
    x = 1
    for(var i = 19; i < 21; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    a = a + ' \n' + value2[4] + ':';
    x = 1
    for(var i = 21; i < 23; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    a = a + ' \n' + value2[5] + ':';
    x = 1
    a = a + ' \n' + 'Level ' + x + ': ' + p[23]
    x++
    if(p[24].charAt(p[24].length) != " "){
      a = a + ' \n' + 'Level ' + x + ': ' + p[24]
    }*/
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + a);
    } else {
      msg.channel.send('Could not find stat data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
  })
  .catch((err) => {
    msg.channel.send('Could not find skill data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
  });

//return 'Data not found';
}

function characterabilities(msg, h){

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
    var p = []
    $('p').each(function(i, elem) {
        p[i] = $(this).text();
    });
    if(p[0] == "There is currently no text in this page."){
      msg.channel.send('Could not find character: ' + h + ' (Note: wyrmprints are case sensitive)' )
      return;
    }
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
    $('th').each(function(i, elem){
        value2[i] = $(this).text().replace('\n', '').slice(2)//parsedragon($(this).html())// + ':';
        //value3[i] = console.log($(this).html().replace(" ", ""));//parsesability($(this).html()));
        //value3[i] = parsedragonability($(this).html());
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
    a = ' \n\n' + '**Abilities**'
    a = a + ' \n' + value2[3] + ':';
    x = 1
    for(var i = 19; i < 21; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    a = a + ' \n' + value2[4] + ':';
    x = 1
    for(var i = 21; i < 23; i++){
      a = a + ' \n' + 'Level ' + x + ': ' + p[i]
      x++
    }
    a = a + ' \n' + value2[5] + ':';
    x = 1
    a = a + ' \n' + 'Level ' + x + ': ' + p[23]
    x++
    if(p[24].charAt(p[24].length) != " "){
      a = a + ' \n' + 'Level ' + x + ': ' + p[24]
    }
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + a);
    } else {
      msg.channel.send('Could not find stat data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
  })
  .catch((err) => {
    msg.channel.send('Could not find skill data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
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
    var value2 = []
    var value3 = []
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
    $('table').each(function(i, elem){
        value2[i] = parsewyrm($(this).html().replace('/em', '/a'))// + ':';
        //value3[i] = console.log($(this).html().replace(" ", ""));//parsesability($(this).html()));
        value3[i] = parsesability($(this).html());
    })
    a = a + ' \n\n' + '**Abilities**'
    for(var i = 0; i < value2.length; i++){
      a = a + ' \n' + value2[i] + '\n' + value3[i];
    }
    if(a != ''){
      msg.channel.send(h.charAt(0).toUpperCase() + h.slice(1) + ' \n' + ' \n' + '**Stats**' + a);
    } else {
      msg.channel.send('Could not find stat data for: ' + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
    }
  })
  .catch((err) => {
    msg.channel.send('Could not find skill data for: ' + h.slice(1) + h.charAt(0).toUpperCase() + h.slice(1) + ' \n')
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
  var regex = /(.*)\>((\w*\d*[%\.]* \w*)*)\<\/(.*)/i
  let matches = param.match(regex)
  return matches[2];
}

function parsedragon(param){
  var regex = /(.*)\>(.*)\<\/a(.*)/i
  let matches = param.match(regex)
  return matches[2].replace('&amp;', '&');
}

function parsedragonability(param){
  var regex1 = /\<p\>(.*) \((.*)Might(.*) (\d*)\)(.*)\<p\>(.*) \((.*)Might(.*) (\d*)\)(.*)/s
  //var regex = /(.*)\<p\>(.*) \((.*)Might\:\<\/span\> (\d*)(.*)/i
  var regex = /\<p\>(.*) \((.*)Might(.*) (\d*)\)(.*)/i
  let matches1 = param.match(regex)
  //return matches1[1];
  let matches2 = param.match(regex1)
  return 'Level 1: ' + matches1[1].replace('&apos;', '\'') + ' (Might: ' + matches1[4] + ')' + '\n' + 'Level 2: ' + matches2[6].replace('&apos;', '\'') + ' (Might: ' + matches2[9] + ')';
}

function parsesability(param){
  //var regex = /(.*)\<p\>((\w*\d*[%\.\/]*\w* )*)(.*)Might\:\<\/span\> (\d*)(.*)/i//((.|\n)*)(.*)(\S*)/s//((\w*\d*[%\.]* )*)(.*)Might\:\<\/span\> (\d*)(.*)/i//(\S+ )*\. (.*) Might\: <\/span> (\d+)(.*)/i
  var regex1 = /(.*)\<p\>((\w*\d*[%\.]* )*)(.*)Might\:\<\/span\> (\d*)(.*)/s
  var regex = /\<p\>(\S*)\<\/p\>(.*)/i
  //var regex = /(.*)/s
  let matches1 = param.match(regex)
  //return matches1[0];
  let matches2 = param.match(regex1)
  if(!matches1){
    regex = /(.*)\<p\>((\w*\d*[%\.\/]*\w* )*)(.*)Might\:\<\/span\> (\d*)(.*)/i
    matches1 = param.match(regex)
    return 'Level 1: ' + matches1[2] + ' (Might: ' + matches1[5] + ')' + '\n' + 'Level 2: ' + matches2[2] + '(Might: ' + matches2[5] + ')';
  }
  return 'Level 1: ' + matches1[1] + '\n' + 'Level 2: ' + matches2[2] + '(Might: ' + matches2[5] + ')';
}
