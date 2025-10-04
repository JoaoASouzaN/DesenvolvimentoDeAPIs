import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let users = [
    { id: 1, name: "João", email: "joao@email.com", role: "user", age: 25 },
    { id: 2, name: "Maria", email: "maria@email.com", role: "admin", age: 32 }
];

let posts: any[] = [];

// Exercício 2 - GET com Query Parameters (deve vir antes da rota /users/:id)
app.get("/users/age-range", function(req, res) {
    const min = parseInt(req.query.min as string);
    const max = parseInt(req.query.max as string);

    if (isNaN(min)) {
        return res.status(400).json({
            success: false,
            message: "Idade mínima inválida"
        });
    }

    if (isNaN(max)) {
        return res.status(400).json({
            success: false,
            message: "Idade máxima inválida"
        });
    }

    const filteredUsers = users.filter(u => u.age >= min && u.age <= max);

    return res.json({
        success: true,
        data: filteredUsers
    });
});

// Exercício 1 - GET com Route Parameter
app.get("/users/:id", function(req, res) {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }

    return res.json({
        success: true,
        data: user
    });
});

// Exercício 3 - POST com validações personalizadas
app.post("/posts", function(req, res) {
    const { title, content, authorId } = req.body;

    // Validações
    if (!title || title.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Título deve ter pelo menos 3 caracteres"
        });
    }

    if (!content || content.length < 10) {
        return res.status(400).json({
            success: false,
            message: "Conteúdo deve ter pelo menos 10 caracteres"
        });
    }

    const authorExists = users.some(u => u.id === authorId);
    if (!authorExists) {
        return res.status(400).json({
            success: false,
            message: "Autor não encontrado"
        });
    }

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        authorId,
        createdAt: new Date(),
        published: false
    };

    posts.push(newPost);

    return res.status(201).json({
        success: true,
        data: newPost
    });
});

// Exercício 4 - PUT (Atualização Completa de Usuário)
app.put("/users/:id", function(req, res) {
    const userId = parseInt(req.params.id);
    const { name, email, role, age } = req.body;

    // Verifica se todos os campos foram enviados
    if (!name || !email || !role || !age) {
        return res.status(400).json({
            success: false,
            message: "Todos os campos são obrigatórios: name, email, role, age"
        });
    }

    // Encontra o índice do usuário
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Usuário não encontrado"
        });
    }

    // Verifica se já existe outro usuário com o mesmo email
    const emailExists = users.some(u => u.email === email && u.id !== userId);
    if (emailExists) {
        return res.status(409).json({
            success: false,
            message: "Email já está em uso por outro usuário"
        });
    }

    // Atualiza substituindo completamente o usuário
    users[userIndex] = { id: userId, name, email, role, age };

    return res.json({
        success: true,
        data: users[userIndex]
    });
});

// Exercício 5 - PATCH (Atualização Parcial de Post)
app.patch("/posts/:id", function(req, res) {
    const postId = parseInt(req.params.id);
    const { title, content, published, id, authorId, createdAt } = req.body;

    // Impedir campos proibidos
    if (id || authorId || createdAt) {
        return res.status(400).json({
            success: false,
            message: "Não é permitido alterar id, authorId ou createdAt"
        });
    }

    // Procurar o post
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post não encontrado"
        });
    }

    // Atualizações permitidas
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (published !== undefined) post.published = published;

    return res.json({
        success: true,
        data: post
    });
});

// Exercício 6 - DELETE (Remover Post com autorização)
app.delete("/posts/:id", function(req, res) {
    const postId = parseInt(req.params.id);
    const userId = parseInt(req.header("User-Id") || "0");

    // Verifica se o post existe
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Post não encontrado"
        });
    }

    const post = posts[postIndex];

    // Verifica se o usuário existe
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(403).json({
            success: false,
            message: "Usuário não autorizado"
        });
    }

    // Permissão: autor ou admin
    if (post.authorId !== userId && user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Sem permissão para remover este post"
        });
    }

    // Remove o post
    posts.splice(postIndex, 1);

    return res.json({
        success: true,
        message: "Post removido com sucesso"
    });
});

// Exercício 7 - DELETE Condicional (remover usuários inativos)
app.delete("/users/cleanup-inactive", function(req, res) {
    const confirm = req.query.confirm === "true";

    if (!confirm) {
        return res.status(400).json({
            success: false,
            message: "Confirmação obrigatória (?confirm=true)"
        });
    }

    // Pega todos os IDs de usuários que têm posts
    const activeAuthors = posts.map(p => p.authorId);

    // Seleciona usuários que serão removidos
    const removedUsers = users.filter(
        u => !activeAuthors.includes(u.id) && u.role !== "admin"
    );

    // Atualiza a lista de usuários mantendo apenas ativos e admins
    users = users.filter(
        u => activeAuthors.includes(u.id) || u.role === "admin"
    );

    return res.json({
        success: true,
        removed: removedUsers
    });
});


app.listen(3000, () => console.log('API on http://localhost:3000'));
