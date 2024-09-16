const express = require('express')
const cors = require('cors')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
// const VerifyToken = require('./Token/VerifyToken');
const app = express()
const port = 2000
app.use(express.json())
app.use(cors({
    origin: ['https://explore-world-theta.vercel.app', 'https://seller-zingzest.web.app', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}))
app.use(cookieParser())

app.get("/", async (req, res) => {
    res.send({ message: "Welcome back to our server" })
})



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://zingzest-world:bXoM1yLI5TdwGe59@cluster0.oqk84kq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const VerifyToken = async (req, res, next) => {
    const token = req.cookies?.code
    if (!token) {
        return res.send({ message: "user not found" })
    }
    jwt.verify(token, "hello", async (err, decoded) => {
        if (err) {
            return res.send({ message: "user valid failed" })
        }
        req.user = decoded
        next()
    })}



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        app.get("/myname", VerifyToken, async (req, res) => {

            console.log(req.user);
        
            if (req.user.userEmail == "masud@gmail.com") {
                res.send({ message: "Mahmud Hasan Siddique" })
            }
            else {
                res.send({ message: "User doesn't have permission" })
            }
        })
        
        app.post("/jwt", async (req, res) => {
            const email = req.body
            console.log(email);
        
            const token = jwt.sign(email, 'hello', { expiresIn: 60 * 60 })
            res
                .cookie('code', token, {
                    httpOnly: false,
                    secure: true,
                    sameSite:  'none'
                })
                .send(token)
        
        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})