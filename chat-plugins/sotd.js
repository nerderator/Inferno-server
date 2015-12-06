var currentSong = '',
currentSongName = '';
exports.commands = {
  sotd: 'songoftheday',
  songoftheday: function (target, room, user) {
    if (!this.canBroadcast()) return;
    
    var targets = target.split(','),
    length = targets.length;
    
    while (length--) 
      targets[length] = targets[length].trim();
    if (!target) 
        return this.sendReplyBox('<a href=' + currentSong + '> <button> Song Of The Day! Todays song is: ' + currentSongName + '</button> </a>');
    if (user.can('kill', null, room)) {
      if (targets[0] == 'help') return this.sendReplyBox('/sotd - Shows a button link to the song of the day' + '<br/>' +   
        '/sotd setlink, link - sets the button link' + '<br/>' + '/sotd setname, songname - sets the title of the song which appears on the button' + '<br/>' + '/sotd resetname - resets the song name to \'\'' + '<br/>' + '/sotd resetlink - resets song link to \'\'');
      else if (targets[0] == 'setlink' && targets[1] && targets[1].indexOf('watch') == 24) {
        currentSong = targets[1];
        return this.sendReplyBox('The link to the Song Of The Day has been successfully changed to: <a href=' + targets[1] + '>' + targets[1] + '</a>');
      }
      else if (targets[0] == 'setlink' && targets[1] && targets[1].indexOf('watch') != 24) 
        return this.errorReply('The link to the Song Of The Day must be a YouTube link. (Not mobile)');
      else if (targets[0] == 'setlink' && !targets[1]) return this.parse('/sotd help');
      else if (targets[0] == 'setname' && targets[1] && targets[1].length < 40) {
        currentSongName = targets[1];
        return this.sendReplyBox('The name of the Song Of The Day was successfully changed to: ' + targets[1]);
      }
      else if (targets[0] == 'setname' && targets[1] && targets[1].length >= 40) return this.errorReply('The song name must be less than 40 characters long.');
      if (targets[0] == 'setname' && !targets[1]) return this.parse('/sotd help');
      else if (targets[0] == 'resetname') {
        currentSongName = '';
        return this.sendReply('The song name was successfully reset.');
      }
      else if (targets[0] == 'resetlink') {
        currentSong = '';
        return this.sendReply('The song link was successfully reset.');
      }
      else if (targets[0] != 'setlink') return this.parse('/sotd help');
    }
    else return this.errorReply('You must be of rank Administrator to use this command.');
  },
};
