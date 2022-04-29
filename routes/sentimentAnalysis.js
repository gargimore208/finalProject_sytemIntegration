"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const express=require('express');
const { exist } = require("joi");
const Joi = require("joi");
const router=express.Router();

const endpoint = 'https://my-machine.cognitiveservices.azure.com/';
const key = process.env.KEY;

// Authenticate the client with your key and endpoint
const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

router.post("/",async(req,res)=>{
  const schema = Joi.array().items(Joi.string()).min(1);
  const result = schema.validate(req.body);
  if(result.error){
    res.status(400).send(result.error.details[0].message);
  }else{
    res.send(await sentimentAnalysis(textAnalyticsClient,req.body));
  }
});

router.post("/opnionMining",async(req,res)=>{

  const schema = Joi.array().required().items(
  Joi.object().required().keys({
    text: Joi.string().required(),
    language: Joi.string().required().valid(
    'en', 'fr', "de", "it", "pt-BR", "pt-PT", "es")
  }));
  const result = schema.validate(req.body);
  if(result.error){
    res.status(400).send(result.error.details[0].message);
  }else{
    let input = [];
    for(let i=0;i<req.body.length;i++){
      let eachInput = req.body[i];
      eachInput["id"] = i.toString();
      input.push(eachInput);
    }
    res.send(await sentimentAnalysisWithOpinionMining(textAnalyticsClient,input));
  }
});

async function sentimentAnalysis(client,sentimentInput){
    const sentimentResult = await client.analyzeSentiment(sentimentInput);
    return sentimentResult;
}

async function sentimentAnalysisWithOpinionMining(client,sentimentInput){

  const results = await client.analyzeSentiment(sentimentInput, { includeOpinionMining: true });
  return results;
}
module.exports=router;