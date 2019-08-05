module.exports  = {
  facebook : {
    clientID: 649559492141498,
    clientSecret: "59a21ce5eacfd0858a596df4eb19cc67",
    fbGraphVersion: 'v3.0'
    // callbackURL: "https://e48930f4.ngrok.io/auth/facebook/callback",
    // profileFields: ['id', 'name', 'displayName', 'picture', 'email'],
  },
  google : {
    clientID: 'INSERT-CLIENT-ID-HERE',
    clientSecret: 'INSERT-CLIENT-SECRET-HERE',
    callbackURL: 'http://localhost:3000/auth/google/callback',
  }
}
