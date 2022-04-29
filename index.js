const express=require('express');
const app=express();

require('./startup/routes')(app);

var port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`server started on port number ${port}`);
})