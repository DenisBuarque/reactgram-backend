const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/reactgram');
    console.log('Conectou ao mongoose com sucesso!');
}

main().catch((err) => {
    console.log(err);
});

module.exports = mongoose;