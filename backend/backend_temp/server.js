import express from 'express';
import cors from "cors"
import prisma from './prisma.js';
const app = express();
app.use(express.json());
app.use(cors());

app.get('/trees', async (req, res) => {
    try {
        const trees = await prisma.tree.findMany(); 
        res.json({ trees });
    } catch (err) {
        console.error("Erro ao buscar árvores:", err);
        res.status(500).json({ message: "Erro ao tentar encontrar árvores", error: err.message });
    }
});

app.post('/trees', async (req, res) => {
    try {
        const novaArvore = req.body;
        const tree = await prisma.tree.create({ data: novaArvore });
        res.json({ message: "Árvore criada com sucesso!", tree });
    } catch (err) {
        console.error("Erro ao criar árvore:", err);
        res.status(500).json({ message: "Erro ao tentar criar árvore", error: err.message });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Servidor rodando..."));
