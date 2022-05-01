const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
app = express();
require('dotenv').config();

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1nrl5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("emmaJohn").collection("products");
    app.get('/product', async (req, res) => {
      const page = parseInt(req.query.page);
      const count = parseInt(req.query.count);
      const query = {};
      const cursor = productsCollection.find(query);
      let products;
      if (page || count) {
        products = await cursor.skip(page * count).limit(count).toArray();
      } else {
        products = await cursor.limit(count).toArray();
      }
      res.send(products);
    });
    app.get('/productCount', async (req, res) => {
      const count = await productsCollection.estimatedDocumentCount();
      res.send({ count });
    });
    // POST : product by keys
    app.post('/productByKeys', async (req, res) => {
      const keys = req.body;
      const ids = keys.map(id => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = productsCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
      // console.log(keys);
    })
  } finally {

  }
}
run().catch(console.dir());


app.get('/', (req, res) => {
  res.send('server is running!!!');
});

app.listen(port, () => {
  console.log('server is ok');
});