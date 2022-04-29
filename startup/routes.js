var express=require('express');
const sentimentAnalysis = require('../routes/sentimentAnalysis');

module.exports=function(app){
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use("/api/sentimentAnalysis",sentimentAnalysis);
}
