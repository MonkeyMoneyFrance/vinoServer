#créer un qrCode-client dans redis :
- "node app.js" et "redis-server" dans 2 terminaux
- jwt.io : générer un token signé avec la clé de l'API (voir key.js) et qui contient les clés demandées par le middleware (userId, isAdmin etc)
- postman, "localhost:3001/api/qrCode", POST ...


################# tests webservice le 21 mai 19  ############""""
### TESTER SERVEUR
#test1 :
- POST localhost:3001/api/qrCode?userId=12742376782674278 /// auth Bearer avec token jwt.io, secret api (key.js) + "isAdmin":true & "userId":12742376782674278
- => réponse : "5ce3b9ca52843c291bd6d2fd", c'est l'id du qrCode qui a été créé dans redis pour cet user

- GET localhost:3001/api/qrCode?id=5ce3b9ca52843c291bd6d2fd /// no auth
- => res : User couldnt be found code : CastError: Cast to ObjectId failed for value "12742376782674278" at path "userId" for model "Auth" => l'USERID A BIEN été MATCHé mais l'userId ne correspond pas à la norme "objectId" du schéma Auth de MongoDB

#test2 : test1 avec un userId du type [objectId mongoDB]
- POST : userId=5ce323600000000000000000 -> qrCodeId=5ce3c46a52843c291bd6d2fe
- GET => response 1

### WEBSERVICE (server - client)
#test3: test2 depuis l'application (émulateur androïd)
- Network failed
- "localhost" point vers l'émulateur !
- solution : utiliser ngrok, mettre en ligne mon port localhost:3001.
- => "ngrok http 3001", puis copier coller l'adresse temporaire dans URL dans le code client

################## tests webservice le 22 mai 19 #####################
(Une grande aventure de la matinée a été de pouvoir stocker l'émulateur et les images systèmes sur une autre partition, car cela prenait trop de place sur le SSD-linux) On reprend à 14h

#test1: création utilisateur visible dans mongoDB
on reproduit les expériences d'hier pour créer un utilisateur
(via Postman) userId : 5ce53a21e03e90db14bb9f5e => qrCodeId : "5ce53b2bc675bf26b3c2f456"
(via app) => 1 mais dans mongo, "users" est vide

#test2:
(postman) POST api/registerUser avec body = json de (voir schéma User):
{5ce53a21e03e90db14bb9f5e, Henri, LP, ici, 0123456789, patient}
=> renvoit _id": "5ce53eadc675bf26b3c2f459",
    "createdAt": "2019-05-22T12:21:01.145Z",    
    "updatedAt": "2019-05-22T12:21:01.145Z",
    "__v": 0//_
visible dans mongo/test/Users

(postman) POST api/registerAuth avec body = json de (voir schéma Auth):
{henri@lp.fr, unmotdepasse, "5ce53eadc675bf26b3c2f459"}


#test3: avec sous Postman body "url-encoded"
- api/registerUser
[{"key":"_id","value":"5ce53a21e03e90db14bb9f5e","description":"","type":"text","enabled":true},{"key":"firstName","value":"Henri","description":"","type":"text","enabled":true},{"key":"lastName","value":"LP","description":"","type":"text","enabled":true},{"key":"address","value":"Ici","description":"","type":"text","enabled":true},{"key":"phone","value":"0123456789","description":"","type":"text","enabled":true},{"key":"type","value":"0","description":"","type":"text","enabled":true}]_
=>
    "_id": "5ce53a21e03e90db14bb9f5e",
    "firstName": "Henri",
    "lastName": "LP",
    "address": "Ici",
    "phone": "0123456789",
    "type": 0,
    "createdAt": "2019-05-22T13:34:27.677Z",
    "updatedAt": "2019-05-22T13:34:27.677Z",
    "__v": 0_ }

- POST api/qrCode  http://b24d56c4.ngrok.io/api/qrCode?userId=5ce53a21e03e90db14bb9f5e
=> qrCodeId : "5ce55061c32af83f515386a7"

- GET api/qrCode http://b24d56c4.ngrok.io/api/qrCode?id=5ce55061c32af83f515386a7
=> 1 (user matché mais pas Auth)  // 0 : no match, 2 : match user + auth => login

- POST api/registerAuth body={email, password} et query={id=[qrCodeId]}
=> renvoit l'objet auth correspondant

#test 4 à faire :
côté front, tester la connexion serveur avec {email:"henri@lp.fr", password:"unmotdepasse"}
- fetchData("POST","/api/login", ,{email:vvvz, password:vvzvz})
=> status : "logged in", token

################## tests webservice le 23 mai 19 #####################
Pendant que Geo se dépatouille avec la blockchain, je tente de sortir de ma gueule de bois
# test 1
Charger les infos patient à la connexion.

#mise en place nomenclature
#arh bug

#################### tests lundi 27 mai  ################
On crée un nouveau user côté front
Donc on simule l'action de Distrimédic : http://localhost:3001/qrCode?userId=5cebd0edf84bc1e20113e19e avec token secret+isAdmin:true, ObjectId generated
=> qrCodeId = 5cebd11cc5c83a7e445a0c8e

################### tests mardi 28  mai ##################
Hier j'ai déployé la structure redux reliée à l'api server sur le front
Je vois que les qrCodes créés le sont indéfiniment pour le moment
Aujourd'hui je veux faire une procédure d'inscription fluide (côté patient et aidant)
Et commencer les objets graphiques (commençons par "pairs")
Supprimons la base de donnée et recréons des utilisateurs "sains"
Tant qu'on y est on modifie le nom des collections (Auths -> auths)

- _Création de 5 qrCodeIds avec Postman_
    userIds             =>         qrCodeIds      =>      auth      => user
5cece8f000359b3decbc89af      5cece9e419df82196da3b609  Jose / Bove   type:0 + ?
5cece93b59193d36fe0432e2      5cece9fb19df82196da3b60a
5cece9416ffb11fdae6e766e      5cecea0a19df82196da3b60b
5cece94530ca9bd8e7658edf      5cecea1719df82196da3b60c
5cece949e100408eddd84095      5cecea3919df82196da3b60d

Ok. maintenant, le problème qu'on avait hier était que Auth était créé mais le User pas forcémeent instancié.
D'où le "profileForm.js" et la nécessité de mettre au moins 1 champ obligatoire dedans (comme "FirstName")
-> on passe firstName et lastName en "required"

- procédure de register avec qrCodeId 5cece9e419df82196da3b609
emai : "jose", password : "bove"
=> l'Auth est bien register, puis "navigate" vers login.
Il faudrait créer l'Auth et le User en même temps si possible. Vu qu'on ne peut pas passer de props aux Views, mettre registerForm et profileForm en 1 seule View ?
Hmm.
_On choisit de garder registerForm ET profileForm.
_registerForm validé => auto login => profileForm
_si profileForm non rempli cette fois, login redirige toujours vers profileForm jusqu'à ce que user soit créé_

##fin de journée
demander à Geoffroy de gérer le cas {email:"Jose", password:"Bove"}
=> on arrive pas à update / créer un "user" depuis le front
=> voir pourquoi on atteint pas le chemin POST /user (isAllowed ?)

###################### tests mercredi 29 mai ########################
On explore le middleware "isAllowed"
on refait un schéma propre de "AUTHPROCESS"
on retente l'inscription avec les qrCodeIds créés hier.
simulation de l'action Distrimedic :
_[
    {
        "_id": "5cee9a1e05bc11178e278ed4",
        "firstName": "Riri",
        "lastName": "1",
        "type": 0,
        "createdAt": "2019-05-29T14:41:34.721Z",
        "updatedAt": "2019-05-29T14:41:34.721Z",
        "__v": 0,
        "qrCodeId": "5cee9a1e05bc11178e278ed9"
    },
    {
        "_id": "5cee9a1e05bc11178e278ed5",
        "firstName": "Fifi",
        "lastName": "1",
        "type": 0,
        "createdAt": "2019-05-29T14:41:34.722Z",
        "updatedAt": "2019-05-29T14:41:34.722Z",
        "__v": 0,
        "qrCodeId": "5cee9a1e05bc11178e278eda"
    },
    {
        "_id": "5cee9a1e05bc11178e278ed6",
        "firstName": "Loulou",
        "lastName": "2",
        "type": 0,
        "createdAt": "2019-05-29T14:41:34.722Z",
        "updatedAt": "2019-05-29T14:41:34.722Z",
        "__v": 0,
        "qrCodeId": "5cee9a1e05bc11178e278edb"
    },
    {
        "_id": "5cee9a1e05bc11178e278ed7",
        "firstName": "Donald",
        "lastName": "Duck",
        "type": 0,
        "createdAt": "2019-05-29T14:41:34.722Z",
        "updatedAt": "2019-05-29T14:41:34.722Z",
        "__v": 0,
        "qrCodeId": "5cee9a1e05bc11178e278edc"
    },
    {
        "_id": "5cee9a1e05bc11178e278ed8",
        "firstName": "Gontran",
        "lastName": "Bonheur",
        "type": 0,
        "createdAt": "2019-05-29T14:41:34.722Z",
        "updatedAt": "2019-05-29T14:41:34.722Z",
        "__v": 0,
        "qrCodeId": "5cee9a1e05bc11178e278edd"
    }
]_
test riri => on détruit le qrCode sans register dans auth lol
test fifi
17h12 : tous les patients ci-dessus sont authentifiés, la procédure marche nickel :)

17h36 : on a adapté qrCodeRegister, et on tente l'authentification d'un aidant à partir du qrCode patient

################## jeudi 30 mai #################
on teste le AUTHPROCESS pour aidant : on scanne le qrCode de riri, on veut carer
CARER : (email:riricarer,pwd:riri)
ok
patientsList ok (/pairs)
#test POST /medication (pour riri), req.body.medications :
[
{
  "userId":"5cee9a1e05bc11178e278ed4",
  "timeStart": "2019-06-15T15:14:59+02:00",
  "timeEnd" : "2019-06-15T15:16:59+02:00",
  "in" : [
    {"name":"UnPtiDoli","quantity":"1g","picture":"url photo"},
    {"name":"weed thérapeuthique","quantity":"1g","picture":"url photo"}
  ],
  "out" : [
    {"name":"pilule bleue","quantity":"2g","picture":"url photo"},
    {"name":"pilule rouge","quantity":"2g","picture":"url photo"}
  ]
},
{
  "userId":"5cee9a1e05bc11178e278ed4",
  "timeStart": "2019-06-20T15:14:59+02:00",
  "timeEnd" : "2019-06-20T15:16:59+02:00",
  "in" : [
    {"name":"Arsenic lol","quantity":"1g","picture":"url photo"},
    {"name":"Fraise tagada","quantity":"1g","picture":"url photo"}
  ],
  "out" : [
    {"name":"Un sucre de canne","quantity":"2g","picture":"url photo"},
    {"name":"3 gouttes de placebo","quantity":"2g","picture":"url photo"}
  ]
}
]
==================================
