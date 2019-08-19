const Cellar = require('../models/cellar.js')
const {getSocketClient} = require('../routes/redismethods')
var io;
Cellar.watch([],{ fullDocument: 'updateLookup' }).on('change', async (change) => {
  let next = change.fullDocument
  const cellarId = change.documentKey._id
  let userId = next.userId
  // here catch the pairs and propagate to theme
  // here catch the patient
  console.log('SHOULD DO SOMTHING',userId)
  let socketId = await getSocketClient(userId)
  io.to(socketId).emit('cellarChanged',cellarId)
});

module.exports = {
  setIo : (ioDeclared) => {
    return io = ioDeclared;
  }
}
