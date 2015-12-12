exports.commands = {
	/*********************************************************
	 * Clan commands
	 *********************************************************/

	ayudaclan :  ' clanshelp
	clanhelp: 'clanshelp',
	clanshelp: function () {
		if (!this.canBroadcast()) return false;
		this. sendReplyBox (
			"<big><b>Comandos Básicos:</b></big><br /><br />" +
			" / clans - List <br /> clans. "  +
			" / clan (clan / member) - Sample sheet / profile <br /> clan. "  +
			" / miembrosclan (clan / member) - shows the members are there in a clan <br />. "  +
			" / clanauth (clan / member) - shows the hierarchy of clansmen <br />. "  +
			" / warlog (clan / member) - shows the last 10 clan wars <br /> a. "  +
			" / invitarclan - Invite a user to join the clan Requires a clan Officer <br />.. "  +
			" / expulsarclan (member) - Kicks a clan member required to be sub-clan leader. <br />. "  +
			" / aceptarclan (clan) - Accept an invitation to <br /> clan. "  +
			" / invitacionesclan (clan / member) - list guests to users <br /> clan. "  +
			" / borrarinvitaciones - Delete pending invitations Clan Requires a clan leader. <br />. "  +
			"/abandonarclan - Abandona el clan.<br />" +
			"<br />" +
			"<big><b>Comandos de Clan-Auth:</b></big><br /><br />" +
			" / liderclan (member) - Name a leading member of the clan requires ~ <br />. "  +
			" / subliderclan (member) - Name a sub-leader of the clan member Clan Leader Requires a <br />.. "  +
			" / oficialclan (member) - Appoint an official member of the clan Requires a sub-clan leader. <br />. "  +
			" / demoteclan (member) - Delete a staff member be required Clan Leader Clan and ~ to demotear a Leader <br />.. "  +
			" / lemaclan (slogan) - Sets the Clan Motto Requires a clan leader. <br />. "  +
			" / logoclan (logo) - Sets the clan logo Requires a clan leader. <br />. "  +
			" / closeclanroom - Blocks a guild hall to all who are not members of the clan, except administrators <br />. "  +
			" / openclanroom - Removes blocking command / closeclanroom <br />. "  +
			" / llamarmiembros or / fjg - Call the clansmen <br /> his room. "  +
			" / rk o / roomkick - Kicks a user of a room requires @ or higher. <br />. "  +
			"<br />" +
			"<big><b>Comandos de Administración:</b></big><br /><br />" +
			"/createclan <name> - Crea un clan.<br />" +
			"/deleteclan <name> - Elimina un clan.<br />" +
			"/addclanmember <clan>, <user> - Fuerza a un usuario a unirse a un clan.<br />" +
			"/removeclanmember <clan>, <user> - Expulsa a un usuario del clan.<br />" +
			"/setlemaclan <clan>,<lema> - Establece un lema para un clan.<br />" +
			"/setlogoclan <clan>,<logo> - Establece un logotipo para un clan.<br />" +
			"/setsalaclan <clan>,<sala> - Establece una sala para un clan.<br />" +
			"/setgxeclan <clan>,<wins>,<losses>,<draws> - Establece la puntuación de un clan.<br />" +
			" / serankclan & lt; clan> & lt; points> - Set the score of a clan <br />. "  +
			" / settitleclan & lt; clan> & lt;. points> - Stable a title for the clan <br /> "
		);
	},

	createclan: function (target) {
		if (!this.can('clans')) return false;
		if (target.length < 2)
			esta . SendReply ( " The clan name is too short " );
		else if (!Clans.createClan(target))
			esta . SendReply ( " . Could not create the clan is possible that one exists with the same name. " );
		else
			this.sendReply("Clan: " + target + " creado con éxito.");

	},

	deleteclan: function (target) {
		if (!this.can('clans')) return false;
		if (!Clans.deleteClan(target))
			esta . SendReply ( " . Could not delete the clan's posble not exist or is at war. " );
		else
			this.sendReply("Clan: " + target + " eliminado con éxito.");
	},

	getclans: 'clans',
	Clans :  ' clans ' ,
	clans: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		var clansTableTitle =  " List of Clans " ;
		if (toId(target) === 'rank' || toId(target) === 'puntos' || toId(target) === 'prestigio' || toId(target) === 'puntuacion') {
			target = "rank";
			clansTableTitle =  " List of Clans by punctuation & oacute; n " ;
		}
		if (toId(target) === 'miembros' || toId(target) === 'members') {
			target = "members";
			clansTableTitle =  " List of Clans by Members " ;
		}
		var clansTable = '<center><big><big><strong>' + clansTableTitle + '</strong></big></big><center><br /><table class="clanstable" width="100%" border="1" cellspacing="0" cellpadding="3" target="_blank"><tr><td><center><strong>Clan</strong></center></td><td><center><strong>Nombre Completo</strong></center></td><td><center><strong>Miembros</strong></center></td><td><center><strong>Sala</strong></center></td><td><center><strong>Wars</strong></center></td><td><center><strong>Puntuación</strong></center></td></tr>';
		var clansList = Clans.getClansList(toId(target));
		was auxRating = {};
		was Nmembers =  0;
		var membersClan = {};
		was auxGxe =  0;
		for (var m in clansList) {
			auxRating =  Clans. getElementalData (m);
			membersClan = Clans.getMembers(m);
			if (!membersClan) {
				nMembers = 0;
			} else {
				nMembers = membersClan.length;
			}
			clansTable += '<tr><td><center>' + Tools.escapeHTML(Clans.getClanName(m)) + '</center></td><td><center>' +Tools.escapeHTML(auxRating.compname) + '</center></td><td><center>' + nMembers + '</center></td><td><center>' + '<button name="send" value="/join ' + Tools.escapeHTML(auxRating.sala) + '" target="_blank">' + Tools.escapeHTML(auxRating.sala) + '</button>' + '</center></td><td><center>' + (auxRating.wins + auxRating.losses + auxRating.draws) + '</center></td><td><center>' + auxRating.rating + '</center></td></tr>';
		}
		clansTable += '</table>';
		this.sendReply("|raw| " + clansTable);
	},

	clanauth: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			esta . SendReply ( " The clan specified does not exist or is not available. " );
			return;
		}
		//html codes for clan ranks
		var leaderClanSource = Clans.getAuthMembers(target, 3);
		if (leaderClanSource !== "") {
			leaderClanSource = "<big><b>Líderes</b></big><br /><br />" + leaderClanSource + "</b></big></big><br /><br />";
		}
		var subLeaderClanSource = Clans.getAuthMembers(target, 2);
		if (subLeaderClanSource !== "") {
			subLeaderClanSource = "<big><b>Sub-Líderes</b></big><br /><br />" + subLeaderClanSource + "</b></big></big><br /><br />";
		}
		var oficialClanSource = Clans.getAuthMembers(target, 1);
		if (oficialClanSource !== "") {
			oficialClanSource = "<big><b>Oficiales</b></big><br /><br />" + oficialClanSource + "</b></big></big><br /><br />";
		}
		var memberClanSource = Clans.getAuthMembers(target, 0);
		if (memberClanSource !== "") {
			memberClanSource = "<big><b>Resto de Miembros</b></big><br /><br />" + memberClanSource + "</b></big></big><br /><br />";
		}

		this. sendReplyBox (
			"<center><big><big><b>Jerarquía del clan " + Tools.escapeHTML(Clans.getClanName(target)) + "</b></big></big> <br /><br />" + leaderClanSource + subLeaderClanSource + oficialClanSource + memberClanSource + '</center>'
		);
	},

	clanmembers :  ' miembrosclan ' ,
	miembrosclan: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			esta . SendReply ( " The clan specified does not exist or is not available. " );
			return;
		}
		was Nmembers =  0;
		var membersClan = Clans.getMembers(target);
		if (!membersClan) {
			nMembers = 0;
		} else {
			nMembers = membersClan.length;
		}
		this. sendReplyBox (
			"<strong>Miembros del clan " + Tools.escapeHTML(Clans.getClanName(target)) + ":</strong> " + Clans.getAuthMembers(target, "all") + '<br /><br /><strong>Número de miembros: ' + nMembers + '</strong>'
		);
	},
	invitacionesclan: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			esta . SendReply ( " The clan specified does not exist or is not available. " );
			return;
		}
		this. sendReplyBox (
			"<strong>Invitaciones pendientes del clan " + Tools.escapeHTML(Clans.getClanName(target)) + ":</strong> " + Tools.escapeHTML(Clans.getInvitations(target).sort().join(", "))
		);
	},
	clan: 'getclan',
	getclan: function (target, room, user) {
		var autoClan = false;
		var memberClanProfile = false;
		var clanMember = "";
		if (!target) autoClan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getProfile(target);
		if (!clan) {
			clanMember = target;
			target = Clans.findClanFromMember(target);
			memberClanProfile = true;
			if (target)
				clan = Clans.getProfile(target);
		}
		if (!clan && autoClan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getProfile(target);
			memberClanProfile = true;
			clanMember = user.name;
		}
		if (!clan) {
			esta . SendReply ( " The clan specified does not exist or is not available. " );
			return;
		}
		var salaClanSource = "";
		if (clan.sala === "none") {
			salaClanSource =  ' not yet established. ' ;
		} else {
			salaClanSource = '<button name="send" value="/join ' + Tools.escapeHTML(clan.sala) + '" target="_blank">' + Tools.escapeHTML(clan.sala) + '</button>';
		}
		var clanTitle = "";
		if (memberClanProfile) {
			var authValue = Clans.authMember(target, clanMember);
			if (authValue === 3) {
				clanTitle = clanMember + " - Líder del clan " + clan.compname;
			} Else  if (auth value ===  2) {
				clanTitle = clanMember + " - Sub-Líder del clan " + clan.compname;
			} Else  if (auth value ===  1) {
				clanTitle = clanMember + " - Oficial del clan " + clan.compname;
			} else {
				clanTitle = clanMember +  " - Member of Clan "  +  clan . compname ;
			}
		} else {
			clanTitle = clan.compname;
		}
		There medalsClan =  ' ' ;
		if (clan.medals) {
			for (var u in clan.medals) {
				medalsClan += '<img id="' + u + '" src="' + encodeURI(clan.medals[u].logo) + '" width="32" title="' + Tools.escapeHTML(clan.medals[u].desc) + '" />  ';
			}
		}
		this. sendReplyBox (
			'<div class="fichaclan">' +
			'<h4><center><p> <br />' + Tools.escapeHTML(clanTitle) + '</center></h4><hr width="90%" />' +
			'<table width="90%" border="0" align="center"><tr><td width="180" rowspan="2"><div align="center"><img src="' + encodeURI(clan.logo) +
			'" width="160" height="160" /></div></td><td height="64" align="left" valign="middle"><span class="lemaclan">'+ Tools.escapeHTML(clan.lema) +
			'</span></td> </tr>  <tr>    <td align="left" valign="middle"><strong>Sala Propia</strong>: ' + salaClanSource +
			' <p style="font-style: normal;font-size: 16px;"><strong>Puntuación</strong>: ' + clan.rating +
			' (' + clan.wins + ' Victorias, ' + clan.losses + ' Derrotas, ' + clan.draws + ' Empates)<br />' +
			' </p> <p style="font-style: normal;font-size: 16px;"> ' + medalsClan +
			'</p></td>  </tr></table></div>'
		);
	},

	setlemaclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setlemaclan clan, lema");

		if (!Clans.setLema(params[0], params[1]))
			esta . SendReply ( " The clan does not exist or slogan is longer than 80 characters. " );
		else {
			esta . SendReply ( " The new clan motto "  + params [ 0 ] +  " has been successfully established. " );
		}
	},

	setlogoclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setlogoclan clan, logo");

		if (!Clans.setLogo(params[0], params[1]))
			esta . SendReply ( " The clan does not exist or link the logo is longer than 120 characters. " );
		else {
			esta . SendReply ( " The new logo of the clan "  + params [ 0 ] +  " has been successfully established. " );
		}
	},

	settitleclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /settitleclan clan, titulo");

		if (!Clans.setCompname(params[0], params[1]))
			esta . SendReply ( " The clan does not exist or the title is longer than 80 characters. " );
		else {
			esta . SendReply ( " The new title of the clan "  + params [ 0 ] +  " has been successfully established. " );
		}
	},

	setrankclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setrankclan clan, valor");

		if (!Clans.setRanking(params[0], params[1]))
			esta . SendReply ( " The clan does not exist or the value is invalid. " );
		else {
			esta . SendReply ( " The new rank for the clan "  + params [ 0 ] +  " has been successfully established. " );
		}
	},

	setgxeclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 4) return this.sendReply("Usage: /setgxeclan clan, wins, losses, ties");

		if (!Clans.setGxe(params[0], params[1], params[2], params[3]))
			esta . SendReply ( " The clan does not exist or the value is invalid. " );
		else {
			esta . SendReply ( " The new GXE for the clan "  + params [ 0 ] +  " has been successfully established. " );
		}
	},

	setsalaclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setsalaclan clan, sala");

		if (!Clans.setSala(params[0], params[1]))
			esta . SendReply ( " The clan does not exist or the name of the room is greater than 80 characters. " );
		else {
			esta . SendReply ( " The new guild hall "  + params [ 0 ] +  " has been established successfully. " );
		}
	},
	
	giveclanmedal: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 4) return this.sendReply("Usage: /giveclanmedal clan, medallaId, imagen, desc");

		if (!Clans.addMedal(params[0], params[1], params[2], params[3]))
			esta . SendReply ( " The clan does not exist or any of the data is not correct " );
		else {
			this.sendReply("Has entegado una medalla al clan " + params[0]);
		}
	},
	
	removeclanmedal: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /removeclanmedal clan, medallaId");

		if (!Clans.deleteMedal(params[0], params[1]))
			esta . SendReply ( " The clan does not exist or podeía this medal " );
		else {
			this.sendReply("Has quitado una medalla al clan " + params[0]);
		}
	},

	lemaclan: function (target, room, user) {
		var permisionClan = false;
		if (!target) return this.sendReply("Debe especificar un lema.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			was clanUserid =  toid (clan user);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 3) permisionClan = true;
			if (!permisionClan && !this.can('clans')) return false;
		} else {
			return false;
		}
		var clan info =  Clans. getElementalData (clan user);
		if (room && room.id === toId(claninfo.sala)) {
			if (!Clans.setLema(clanUser, target))
				esta . SendReply ( " The motto is longer than 80 characters. " );
			else {
				esta . addModCommand ( " A new slogan for the clan "  + clanUser +  " has been established by "  +  user . name );
			}
		} else {
			esta . SendReply ( " This command can only be used in the guild hall. " );
		}
	},

	logoclan: function (target, room, user) {
		var permisionClan = false;
		if (!target) return this.sendReply("Debe especificar un logo.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			was clanUserid =  toid (clan user);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 3) permisionClan = true;
			if (!permisionClan && !this.can('clans')) return false;
		} else {
			return false;
		}
		var clan info =  Clans. getElementalData (clan user);
		if (room && room.id === toId(claninfo.sala)) {
			if (!Clans.setLogo(clanUser, target))
				esta . SendReply ( " The logo is more than 120 characters. " );
			else {
				esta . addModCommand ( " A new logo for the clan "  + clanUser +  " has been established by "  +  user . name );
			}
		} else {
			esta . SendReply ( " This command can only be used in the guild hall. " );
		}
	},

	llamarmiembros:  'fjg',
	fjg: function (target, room, user) {
		var permisionClan = false;
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			was clanUserid =  toid (clan user);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 2 || perminsionvalue === 3) permisionClan = true;
			if (!permisionClan && !this.can('clans')) return false;
		} else {
			return false;
		}
		var clan info =  Clans. getElementalData (clan user);
		if (room && room.id === toId(claninfo.sala)) {
			var clanMembers = Clans.getMembers(clanUser);
			var targetUser;
			for (var i = 0; i < clanMembers.length; ++i) {
				if (!room.users[toId(clanMembers[i])]) {
					targetUser = Users.get(clanMembers[i])
					if (targetUser && targetUser.connected) {
						targetUser.joinRoom(room.id);
						targetUser.popup('Has sido llamado a la sala ' + claninfo.sala.trim() + ' por ' + user.name + '.');
					}
				}
			}
			esta . addModCommand ( " clan members "  + clanUser +  " have been called to the room "  +  Toid ( claninfo . room ) +  ' to '  +  user . name  +  ' . ' );
		} else {
			esta . SendReply ( " This command can only be used in the guild hall. " );
		}
	},

	addclanmember: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (params.length !== 2) return this.sendReply("Usage: /addclanmember clan, member");

		var user = Users.getExact(params[1]);
		if (!user || !user.connected) return this.sendReply("User: " + params[1] + " is not online.");

		if (!Clans.addMember(params[0], params[1]))
			this.sendReply("Could not add the user to the clan. Does the clan exist or is the user already in another clan?");
		else {
			this.sendReply("User: " + user.name + " successfully added to the clan.");
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join">' + Tools.escapeHTML(user.name) + " se ha unido al clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</div>');
		}
	},

	clanlead is:  'lidercl that',
	liderclan: function (target, room, user) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params) return this.sendReply("Usage: /liderclan member");

		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");

		if (!Clans.addLeader(params[0]))
			esta . SendReply ( " The user does not exist, does not belong to any clan or was already leader of his clan. " );
		else {
			var clanUser = Clans.findClanFromMember(params[0]);
			esta . SendReply ( " User: "  +  userk . name  +  " correctly named clan leader "  + clanUser +  " . " );
			userk . popup ( user . name  +  " made ​​you leader of the clan "  + clanUser +  " . \ n Use the command / clanhelp for more information. " );
		}
	},

	clanoficial :  ' oficialclan ' ,
	oficialclan: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
				return this.sendReply("Usage: /oficialclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			was clanUserid =  toid (clan user);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if ((perminsionValue === 2 || perminsionValue === 3) && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");
		if (clanTarget) {
			was clanId =  toid (clan target);
			var userId = toId(params[0]);
			if ((Clans.authMember(clanId, userId) > 2 && !this.can('clans')) || (Clans.authMember(clanId, userId) === 2 && perminsionValue < 3 && !this.can('clans'))) return false;
		}
		if (!Clans.addOficial(params[0]))
			esta . SendReply ( " The user does not exist, does not belong to any clan or was an officer and his clan. " );
		else {
			esta . SendReply ( " User: "  +  userk . name  +  " Guild Officer correctly named "  + clanTarget +  " . " );
			userk . popup ( user . name  +  " made ​​you Official Clan "  + clanTarget +  " . \ n Use the command / clanhelp for more information. " );
		}
	},
	
	clansubleader :  ' subliderclan ' ,
	subliderclan: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
				return this.sendReply("Usage: /subliderclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			was clanUserid =  toid (clan user);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionValue === 3 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");
		if (clanTarget) {
			was clanId =  toid (clan target);
			var userId = toId(params[0]);
			if ((Clans.authMember(clanId, userId) > 2 && !this.can('clans')) || (Clans.authMember(clanId, userId) === 2 && perminsionValue < 3 && !this.can('clans'))) return false;
		}
		if (!Clans.addSubLeader(params[0]))
			esta . SendReply ( " The user does not exist, does not belong to any clan or sub-leader it was his clan. " );
		else {
			esta . SendReply ( " User: "  +  userk . name  +  " correctly named sub-clan leader "  + clanTarget +  " . " );
			userk . popup ( user . name  +  " made ​​you sub-clan leader "  + clanTarget +  " . \ n Use the command / clanhelp for more information. " );
		}
	},

	degradarclan:  'declanauth',
	demoteclan:  'declanauth',
	declanauth: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
			return this.sendReply("Usage: /demoteclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			was clanUserid =  toid (clan user);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionValue >= 2 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var userk = Users.getExact(params[0]);
		if (!clanTarget) {
			return  esta . SendReply ( " The browser does not belong to any clan. " );
		} else {
			was clanId =  toid (clan target);
			var userId = toId(params[0]);
			if ((Clans.authMember(clanId, userId) > 2 && !this.can('clans')) || (Clans.authMember(clanId, userId) === 2 && perminsionValue < 3 && !this.can('clans'))) return false;
		}
		if (!Clans.deleteLeader(params[0])) {
			if (!Clans.deleteOficial(params[0])) {
				esta . SendReply ( " You did not have any authority within the clan. " );
			} else {
				if (!userk || !userk.connected) {
					esta . addModCommand (params [ 0 ] +  " has been demoted in "  + clanTarget +  " to "  +  user . name );
				} else {
					esta . addModCommand ( userk . name  +  " has been demoted in "  + clanTarget +  " to "  +  user . name );
				}
			}
		} else {
			var oficialDemote = Clans.deleteOficial(params[0]);
			if (!userk || !userk.connected) {
				esta . addModCommand (params [ 0 ] +  " has been demoted in "  + clanTarget +  " to "  +  user . name );
			} else {
				esta . addModCommand ( userk . name  +  " has been demoted in "  + clanTarget +  " to "  +  user . name );
			}
		}
	},

	invitarclan: function (target, room, user) {
		var permisionClan = false;
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			was clanUserid =  toid (clan user);
			var iduserwrit = toId(user.name);
			var permisionValue = Clans.authMember(clanUserid, iduserwrit);
			if (permisionValue > 0) permisionClan = true;
		}
		if (!permisionClan) return this.sendReply("/invitarclan - Acceso denegado");
		var params = target.split(',');
		if (!params) return this.sendReply("Usage: /invitarclan user");
		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");
		if (!Clans.addInvite(clanUser, params[0]))
			esta . SendReply ( " Could not invite the User does not exist, you are invited or are in another clan.? " );
		else {
			clanUser = Clans.findClanFromMember(user.name);
			userk . popup ( user . name  +  " has invited you to join the clan "  + clanUser +  " . \ n To join the clan writes in chat / aceptarclan "  + clanUser);
			room . addRaw ( userk . name  +  " has been invited to join the clan "  + clanUser +  " to "  +  user . name );
		}
	},
	aceptarclan: function (target, room, user) {
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			return  esta . SendReply ( " . Now you belong to a clan can not join another. " );
		}
		var params = target.split(',');
		if (!params) return this.sendReply("Usage: /aceptarclan clan");
		var clanpropio = Clans.getClanName(params[0]);
		if (!clanpropio) return this.sendReply("El clan no existe o no está disponible.");

		if (!Clans.aceptInvite(params[0], user.name))
			esta . SendReply ( " The clan does not exist or has been invited to this. " );
		else {
			this.sendReply("Te has unido correctamente al clan" + clanpropio);
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join">' + Tools.escapeHTML(user.name) + " se ha unido al clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</div>');
		}
	},
	inviteclear: 'borrarinvitaciones',
	borrarinvitaciones: function (target, room, user) {
		var permisionClan = false;
		var clanUser = Clans.findClanFromMember(user.name);
		if (!target) {
			if (clanUser) {
				was clanUserid =  toid (clan user);
				var iduserwrit = toId(user.name);
				var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
				if (perminsionvalue === 3) permisionClan = true;
			}
			if (!permisionClan) return false;
		} else {
			if (!this.can('clans')) return;
			clanUser = target;
		}
		if (!Clans.clearInvitations(clanUser))
			esta . SendReply ( " The clan does not exist or is not available. " );
		else {
			esta . SendReply ( " List of Pending Invitations Clan "  + clanUser +  " deleted successfully. " );
		}
	},

	removeclanmember: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (params.length !== 2) return this.sendReply("Usage: /removeclanmember clan, member");
		if (!Clans.removeMember(params[0], params[1]))
			this.sendReply("Could not remove the user from the clan. Does the clan exist or has the user already been removed from it?");
		else {
			this.sendReply("User: " + params[1] + " successfully removed from the clan.");
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join">' + Tools.escapeHTML(params[1]) + " ha abandonado el clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</div>');
		}
	},

	expulsarclan: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
				return this.sendReply("Usage: /expulsarclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			was clanUserid =  toid (clan user);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionValue >= 2 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var currentWar = War.findClan(clanTarget);
		if (currentWar) {
			var currentWarParticipants = War.getTourData(currentWar);
			if (currentWarParticipants.teamAMembers[toId(params[0])] || currentWarParticipants.teamBMembers[toId(params[0])]) return this.sendReply("No puedes expulsar del clan si el miembro estaba participando en una war.");
		}
		var userk = Users.getExact(params[0]);
		if (!clanTarget) {
			return  esta . SendReply ( " The browser does not belong to any clan. " );
		} else {
			was clanId =  toid (clan target);
			var userId = toId(params[0]);
			if ((Clans.authMember(clanId, userId) > 2 && !this.can('clans')) || (Clans.authMember(clanId, userId) === 2 && perminsionValue < 3 && !this.can('clans'))) return false;
		}
		if (!Clans.removeMember(clanTarget, params[0])) {
			esta . SendReply ( " The user could not be expelled from the clan. " );
		} else {
			if (!userk || !userk.connected) {
				this.addModCommand(params[0] + " ha sido expulsado del clan " + clanTarget + " por " + user.name);
			} else {
				this.addModCommand(userk.name + " ha sido expulsado del clan " + clanTarget + " por " + user.name);
			}
		}
	},

	 salirdelclan: 'abandonarclan',
	 clanleave: 'abandonarclan',
	 abandonarclan: function (target, room, user) {
		var clanUser = Clans.findClanFromMember(user.name);
		if (!clanUser) {
			return  esta . SendReply ( " You do not belong to any clan. " );
		}
		var currentWar = War.findClan(clanUser);
		if (currentWar) {
			var currentWarParticipants = War.getTourData(currentWar);
			if (currentWarParticipants.teamAMembers[toId(user.name)] || currentWarParticipants.teamBMembers[toId(user.name)]) return this.sendReply("No puedes salir del clan si estabas participando en una war.");
		}
		if (!Clans.removeMember(clanUser, user.name)) {
			 esta . SendReply ( " Error while trying to leave the clan. " );
		} else {
			this.sendReply("Has salido del clan" + clanUser);
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join">' + Tools.escapeHTML(user.name) + " ha abandonado el clan: " + Tools.escapeHTML(Clans.getClanName(clanUser)) + '</div>');
		}
	},


	//new war system
	resetclanranking: function (target, room, user) {
		if (!this.can('clans')) return false;
		if (room.id !== 'staff') return this.sendReply("Este comando solo puede ser usado en la sala Staff");
		Clans.resetClansRank();
		esta . addModCommand ( user . name  +  " has restarted ranking clan. " );
	},
	
	resetwarlog: function (target, room, user) {
		if (!this.can('clans')) return false;
		if (room.id !== 'staff') return this.sendReply("Este comando solo puede ser usado en la sala Staff");
		Clans.resetWarLog();
		esta . addModCommand ( user . name  +  " has erased all warlogs. " );
	},
	
	pendingwars: 'wars',
	wars: function (target, room, user) {
		this.parse("/war search");
	},

	viewwar: 'vw',
	warstatus: 'vw',
	vw: function (target, room, user) {
		this.parse("/war round");
	},
	
	endwar: function (target, room, user) {
		this.parse("/war end");
	},
	
	warlog: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			esta . SendReply ( " The clan specified does not exist or is not available. " );
			return;
		}
		var f = new Date();
		var dateWar = f.getDate() + '-' + f.getMonth() + ' ' + f.getHours() + 'h';
		this. sendReply (
			"|raw| <center><big><big><b>Ultimas Wars del clan " + Tools.escapeHTML(Clans.getClanName(target)) + "</b></big></big> <br /><br />" + Clans.getWarLogTable(target) + '<br /> Fecha del servidor: ' + dateWar + '</center>'
		);
	},
	
	cerrarsalaclan :  ' closeclanroom ' ,
	closeclanroom: function (target, room, user) {
		var permisionClan = false;
		var clanRoom = Clans.findClanFromRoom(room.id);
		if (!clanRoom) return this.sendReply("Esta no es una sala de Clan.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser && toId(clanRoom) === toId(clanUser)) {
			was clanUserid =  toid (clan user);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue >= 2) permisionClan = true;
			
		} 
		if (!permisionClan && !this.can('clans')) return false;
		if (!Clans.closeRoom(room.id, clanRoom))
			esta . SendReply ( " . Error trying to close the room may already be closed. " );
		else {
			esta . addModCommand ( " This room has been closed to non-members of "  + clanRoom +  " to "  +  user . name );
		}
	},
	
	abrirsalaclan :  ' openclanroom ' ,
	openclanroom: function (target, room, user) {
		var permisionClan = false;
		var clanRoom = Clans.findClanFromRoom(room.id);
		if (!clanRoom) return this.sendReply("Esta no es una sala de Clan.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser && toId(clanRoom) === toId(clanUser)) {
			was clanUserid =  toid (clan user);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue >= 2) permisionClan = true;
			
		} 
		if (!permisionClan && !this.can('clans')) return false;
		if (!Clans.openRoom(room.id, clanRoom))
			esta . SendReply ( " . Error trying to open the room may already be open. " );
		else {
			esta . addModCommand ( " This room has been open to all users "  +  user . name );
		}
	},
	
	kickall: function (target, room, user, connection) {
		if (!this.can('makeroom')) return false;
		var targetUser;
		for (var f in room.users) {
			targetUser = Users.getExact(room.users[f]);
			if (!targetUser) {
				delete room.users[f];
			} else {
				targetUser.leaveRoom(room.id);
			}
		}
		room.userCount = 0;
		this.addModCommand("" + user.name + " has kicked all users from room " + room.id + '.');
		setTimeout(function () {user.joinRoom(room.id);}, 2000);
	}
};
