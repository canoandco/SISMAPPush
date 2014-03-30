SISMAPPush
==========

Le serveur push SISMAPP permet aux applicatins SISMAPP d'envoyer et de recevoir des alertes sismiques.

Pour faire tourner le serveur. Il est nécessaire d'installer NodeJS et les modules suivants:

mysql
socket.io

Pour se connecter au serveur, une lib Socket.IO client est nécessaire. La lib javascript est disponible dans ce repository (socket.io.js).
Pour Android : https://github.com/koush/android-websockets
Pour iOS : https://github.com/pkyeck/socket.IO-objc

BASE DE DONNEES

Le serveur nécessite une base de données mysql doté d'une base "save" et des colonnes suivantes : alias, latitude, longitude.

EVENEMENTS SOCKET.IO

update position : permet de mettre à jour sa position. Paramètres requis : lat, long. (latitude, longitude). Renvoie "ok" si update réussie.
alert : permet d'envoyer une alerte. Paramètres requis : alias, lat, long. Tous les utilisateurs à moins de 2km la reçoivent, sauf l'émetteur.

Exemple de json renvoyé :

{
alias: "toto",
lat: 10.1,
long: 47.2
}


before : permet de recevoir les alertes passées (historique).

Exemple de json renvoyé : 

[
{
alias: "toto",
lat: 10.1,
long: 47.2
},
{
alias: "tata",
lat: 10.1,
long: 47.2
}
]
