const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexao feita com sucesso ao Banco de dados!");
    })
    .catch((msgErro)=>{
        console.log(msgErro)
    });

//estou dizendo p o express usar ejs como engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//vai decodificar os dados enviados para que possa ser ultizados em uma estrutura javaScript
app.use(bodyParser.urlencoded({extended: false})) 
app.use(bodyParser.json());


app.get("/", (req, res) => {
    
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC']
    ] }).then(perguntas =>{
        console.log(perguntas);
        res.render("index", {
            perguntas: perguntas
        });
    });
    //equi. SELECT all from perguntas
});

app.get("/pergunta", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao
    //insert na table do banco
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    })
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where:{id:id}
    }).then(pergunta=>{
        if(pergunta != undefined){//pergunta achada
            
            Resposta.findAll({
                where:{perguntaId:pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas =>{
                res.render("pergunta", {
                pergunta:pergunta,
                respostas: respostas
                });
            });
            
        }else{//nao encontrada
            res.redirect("/");
        }
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo:corpo,
        perguntaId:perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId);
    });
});

app.listen(8080, ()=>{
    console.log("App rodando!");
});