const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 9988;

// middleware
app.use(cors());
app.use(express());
// iKFW3xVM9O0W0hzq all-operation
const uri = `mongodb+srv://${process.env.USERKEY}:${process.env.USERPASS}@cluster0.ugrpd0k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allCollection = client.db('allCollection').collection('allItems');

    app.get('/all-items', async(req, res)=>{
        const allData = await allCollection.find().toArray();
        res.send(allData)
    });
    app.get('/sorting', async(req, res)=>{
        const result = await allCollection.find().sort({price: -1}).toArray();
        res.send(result)
    })
    app.put('all-items', async(req, res)=>{
        const data = req.body;
        const result = await allCollection.insertOne(data);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// default route
app.get('/', (req, res)=>{
    res.send('the server is running')
});

app.listen(port, ()=>{
    console.log("the server is running on: ", port)
})