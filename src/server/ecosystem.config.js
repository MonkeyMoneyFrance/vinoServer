module.exports = {
  apps : [
      {
        name: "Vino",
        script: "./app.js",
        watch: true,
        env: {
            "HOST_NAME" : "vinologie.opp"
            "PORT": 8081,//you can choose
            "NODE_ENV": "development"
        },
        env_production: {
            "HOST_NAME" : "vinologie.ovh"
            "PORT": 3000,//you can choose
            "NODE_ENV": "production",
        }
      }
  ]
}
