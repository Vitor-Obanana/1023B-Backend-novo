import express from 'express'
import type { Request, Response } from 'express'
import 'dotenv/config'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGO_URI!)
await client.connect()
const db = client.db(process.env.MONGO_DB)

const app = express()
//Explique o que esse middleware faz com que o express faça o parse do body na requisição para json:
app.use(express.json())
//criando uma rota para acesso 
app.get('/produtos', async (req:Request, res:Response) => { 
    const produtos = await db.collection('produtos').find().toArray()
    res.json(produtos)
})
app.post('/produtos', async (req:Request, res:Response) => {
    const {nome, preco, urlfoto,decricao} = req.body
    if(!nome || !preco || !urlfoto || !decricao) 
        return res.status(400).json({error: 'Dados incompletos'})
    
    const produto = {nome, preco, urlfoto,decricao}
    const resultado = await db.collection('produtos').insertOne(produto)
    res.status(201).json({nome,preco,urlfoto,decricao, _id:resultado.insertedId})
})
//criando o seervidor na porta 8000 com o express
app.listen(8000, () => {
    console.log('Server is running on port 8000')
})