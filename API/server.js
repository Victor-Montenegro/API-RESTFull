//exigindo modulos 
const express = require('express');
const mongoClient = require(`mongodb`).MongoClient;
const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator');

// chamando a função express
const app = express();

//configurando middlewares para tratar tipos de dados vindo da requisição x-www-form-urlencoded | JSON | files 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// port do server
const port = 3000;

// configurando banco de dados
const mongoURL = 'mongodb://localhost:27017';

const dbName = `ApiPublicacao`;

var createConnection = (data) =>{

    mongoClient.connect(mongoURL,function(err,client){
        const db = client.db(dbName);
        console.log(`conexao realizada!`);
        query(db,data);

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
        case `insert`:
            collection.insertOne(data.usuario,data.callback);
            break;
    };

}

app.listen(port);
console.log(`servidor ON na porta ${port}`);

//configuração da route "/"
app.get(`/`, (req, res) => {

    res.send(`bem vindo! Faça suas publicações na /api |  passando chave valor EX: {titulo: "hello word",png_imagem: hello.png}`);
})

//configurando a route "/api" para realizar inserção de dados atraves do "POST"
app.post(
    '/api',
    body(`titulo`).notEmpty(),
    body(`png_imagem`).notEmpty(),
    (req, res) => {
        
        const dadosPublicacao = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){

            res.status(400).json({errors: errors.array()});
            return;
        }

        //confgurando a inserção de dados para o banco dedados
        const dados = { 
            operacao: `insert`,
            usuario: dadosPublicacao,
            collection: `publicacao`,
            callback: (err,records)=>{
                if(err){
                    res.status(500).json({err});
                }else{
                    res.status(200).json(records);
                }
            }
        };

        createConnection(dados);
});

app.get('/api', (req, res)=>{

    //configurando a consulta das publicações no banco
    const dados = { 
        operacao: `find`,
        usuario: {},
        collection: `publicacao`,
        callback: (err,records)=>{
            if(err){
                res.status(500).json(err);
            }else{

                records.toArray((err,records)=>{
                    
                    if(records.length == 0){
                        res.status(400).json({mensagem:`nao existe publicação`})
                        return
                    }
                    res.status(200).json(records)
                })
            }
        }
    };

    createConnection(dados)
})

//middleware que irá tratar possiveis erros nos status externos
app.use(function(req, res, next){

    res.status(404).json({mensagem:"erro, nao foi possivel achar a pagina!"});

    next();
});


//middleware que irá tratar possiveis erros nos status internos
app.use(function(req, res, next){

    res.status(500).json({mensagem:"erro no servidor!"});

    next();
});


