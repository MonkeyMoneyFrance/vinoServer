const nodemailer = require("nodemailer");
// const mailTransport = nodemailer.createTransport(
//   `smtps://monkeymoneybot:weiH8ahb@smtp.gmail.com`
// );

const  mailTransport = nodemailer.createTransport({
  // host: 'smtp.ionos.fr',
  // service: 'gmail',
  // port: 465,
  //   secure: true, // use SSL
  //   auth: {
  //       user: 'bonjour@monkeymoney.fr',
  //       pass: 'weiH8ahb'
  //   }
  service: 'gmail',
  auth: {
       user: 'monkeymoneybot@gmail.com',
       pass: 'weiH8ahb'
   }
  })

  module.exports = {
  sendConfirmMail : function(hostname,email,userId,token){
    return new Promise(async function(resolve,reject) {
      // process.env.mode == test <=> VPS distrimedic.site
      let address = process.env.mode=="test" ? "https://"+hostname : "http://localhost:3000";
      let link = address+"/confirmMail?userId="+userId+"&token="+token;
      let options = {
        from : "Vinologie <noreply@vinologie.fr>",
        to: email,//email
        subject: "Confirmer votre email pour [Vinologie]",
        html: "<div><p><strong>Veuillez cliquer sur ce lien pour valider que vous êtes le propriétaire de ce compte </strong></p><br/><p>Veuillez cliquer sur ce lien </p><br/>"
        +"<p><a href="+link+">"+link+"</a></p></div>"
      };
      console.log(options)
      mailTransport.sendMail(options)
      .then(()=>{
        console.log("mail sent to "+email)
        resolve()
      })
      .catch(e=>{
        console.log("!! couldn't perform last step resetPassMail"+e);
        reject(e)
      })
    })
  },
  sendResetPasswordMail : function(hostname,email,userId,token){
    return new Promise(async function(resolve,reject) {
      // process.env.mode == test <=> VPS distrimedic.site
      let address = process.env.mode=="test" ? "https://"+hostname : "http://localhost:3000";

      let link = address+"/resetPass?userId="+userId+"&token="+token;

      let options = {
        from : "Vinologie <noreply@vinologie.fr>",
        to: email,//email
        subject: "Lien pour nouveau mot de passe [Vinologie]",
        html: "<div><p><strong>Changement de mot de passe pour Vinologie</strong></p><br/><p>Veuillez cliquer sur ce lien pour acc&eacute;der au formulaire de changement de mot de passe :</p><br/>"
        +"<p><a href="+link+">"+link+"</a></p></div>"
      };
      mailTransport.sendMail(options)
      .then(()=>{
        console.log("mail sent to "+email)
        resolve()
      })
      .catch(e=>{
        console.log("!! couldn't perform last step resetPassMail"+e);
        reject(e)
      })
    })
  }
}
