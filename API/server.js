//exigindo modulos 
const express = require('express');
const mongoClient = require(`mongodb`).MongoClient;
const bodyParser = require('body-parser');

// chamando a função express
const app = express();

//configurando middlewares para tratar tipos de dados vindo da requisição x-www-form-urlencoded | JSON | files 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// port do server
const port = 3000;

// configurando banco de dados
const mongoURL = 'mongodb://localhost:27017';

const dbName = `ApiPublicação`;

var createConnection = (data) =>{

    mongoClient.connect(mongoURL,function(err,client){
        const db = client.db(dbName);

        query(db,data)

        client.close();

    });
}

//função que realiza a interação com banco de find | insert | update | delete 
function query(db,data){
    const collection = db.collection(data.collection)

    switch(data.operacao){

        case `find`:
            collection.find(data.usuario,data.callback);
            break
    };

}

//configuração da route "/"
app.get(`/`, (req, res) => {

    res.send(`bem vindo faça suas publicação na /api`);
})

//middleware que irá tratar possiveis erros nos status internos
app.use(function(req, res, next){

    res.status(500).json({mensagem:"erro no servidor!"});

    next();
});


app.listen(port);
console.log(`servidor ON na porta ${port}`)