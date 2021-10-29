//1.
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
//2.
const app = express();
app.use(cors());
app.use(express.json());

//3.
const port = 5000;


//pass:svwRrBcmTesHnZnH
//username: carMechanicUser



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luxos.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/*
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

async function run(){

    try{
        await client.connect();
        console.log('connected database');
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');
        ///get api

        app.get('/services', async (req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
            console.log('get success')
        })

        ///get single service
        app.get('/services/:id', async (req,res)=>{
            const id = req.params.id;
            console.log('single user success')
            const query = {_id : ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })
        ///POST API
        app.post('/services', async (req,res)=>{
            console.log(req.body);
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result);
        })

        ///DELETE
        app.delete('/services/:id', async (req,res)=>{
            const id= req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            console.log('delete hit')
            res.send(result)
            console.log(result)
        })

    }
    finally{
        //await client.close();
    }

}
run().catch(console.dir);



//4.
app.get('/',(req,res)=>{
    res.send('connected');
})

//5.
app.listen(port,()=>{
    console.log('lostening from: ', port);
})

