const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://remydbuser1:XVvcekDoJpe5Lrhx@cluster0.ucfjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => {
  res.send('hello')
})
async function run() {
    try {
      await client.connect();
      const database = client.db("shop");
      const productCollection = database.collection("products");

      // GET API
      app.get("/products", async(req, res) => {
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.json(products)
      });

      app.get("/products/:id", async(req, res) => {
        const id = req.params.id;
        const query = { _id:  ObjectId(id)};
        const result = await productCollection.findOne(query);
        res.send(result)
      })

      // POST API
      app.post("/products", async(req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        console.log(result);
        res.send(result);
      });

      // update product
      app.put('/products/:id', async(req, res) => {
        const id = req.params.id;
        const updateProductReq = req.body;
        const query = { _id:  ObjectId(id)};
        const updateProduct = {
          $set: {
            name: updateProductReq.name,
            category: updateProductReq.category,
            price: updateProductReq.price,
            quantity: updateProductReq.quantity
          },
        };
        const result = await productCollection.updateOne(query, updateProduct);
        console.log(result);
        res.send(result);
      })

      // delete api
      app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id:  ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.send(result);
      })

    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);


app.listen(port, () => console.log('App listen port', port));