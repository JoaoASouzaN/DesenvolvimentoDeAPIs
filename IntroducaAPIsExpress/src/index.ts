import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Vetor que simula uma tabela de usuários no banco de dados
const users = [
    { id: 1, name: 'Niltão', playlists: [1, 2] },
    { id: 2, name: 'Nick', playlists: [3] },
    { id: 3, name: 'Will I Am', playlists: [] }
];

// Vetor que simula uma tabela de playlists no banco de dados
const playlists = [
    { id: 1, name: 'Forróck', tracks: ['Foguete não tem ré', 'O golpe taí', 'Forrock das aranhas'] },
    { id: 2, name: 'Funk dos cria', tracks: ['Vida Louca', 'Deu Onda', 'Ela Só Quer Paz'] },
    { id: 3, name: 'K-pop', tracks: ['Dynamite', 'Lovesick Girls', 'Gee'] }
];

// Os exercícios virão aqui...
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) =>{
    res.send("Hello, Express!")
})

app.get("/users", (req, res) =>{
    res.send(users)
})

app.get("/users/:userId", (req, res) =>{
    res.send(users.find(user => user.id === parseInt(req.params.userId)))
})

app.get("/playlists", (req, res) =>{
    res.send(playlists)
})

app.get("/playlists/search", (req, res) =>{
    const name = String(req.query.name || "");
    res.send(
        playlists.filter(
            (playlist) => playlist.name.toLowerCase().includes(name.toLowerCase())
        )
    );
})