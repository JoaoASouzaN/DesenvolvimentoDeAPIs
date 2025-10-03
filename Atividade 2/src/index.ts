import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const pedidos = [
  // id, name = cliente, produtos = ids dos produtos
  { id: 1, name: 'Leonardo', produtos: [1, 2] },
  { id: 2, name: 'Philippe', produtos: [3] },
  { id: 3, name: 'Pablo', produtos: [2, 3] },
  { id: 4, name: 'Ana', produtos: [4] },
  { id: 5, name: 'Pablo', produtos: [5, 2, 1] },
  { id: 6, name: 'Leonardo', produtos: [3] },
  { id: 7, name: 'Marina', produtos: [2] },
  { id: 8, name: 'Ana', produtos: [2, 4] },
  { id: 9, name: 'Carlos', produtos: [6] },
];

const produtos = [
  // id, nome, categorias (strings)
  { id: 1, nome: 'Chocolate Ate', categorias: ['Doces', 'Guloseimas'] },
  { id: 2, nome: 'Chiclete Doido', categorias: ['Guloseimas', 'Apimentados'] },
  { id: 3, nome: 'Bala Encontrada', categorias: ['Guloseimas', 'Refrescante'] },
  { id: 4, nome: 'Amendoim Crocante', categorias: ['Salgados'] },
  { id: 5, nome: 'Pimenta Turbo', categorias: ['Apimentados'] },
  { id: 6, nome: 'Água com Gás', categorias: ['Bebidas', 'Refrescante'] },
];

// Hello, Express!
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Exercício 1: Retornar os produtos comprados por um cliente em específico
app.get("/clientes/:nome/produtos", function (req, res) {
  //Recebemos o nome passado por parans e salva em uma variavel
  const nomeInput = String(req.params.nome || "");

  //Fazendo tratamento para apenas letras minusculas
  const nomeInputNorm = nomeInput.toLowerCase();

  //Filtrando os pedidos pelo nome recebido
  const pedidosCliente = pedidos.filter(
    p => p.name.toLowerCase() === nomeInputNorm
  );

  //Fazendo tratamente de erro com retorno do codigo e mensagem de feedback
  if (pedidosCliente.length === 0) {
    return res.status(200).send(["O cliente não possuei pedidos."]);
  }

  //Salvando os ids dos produtos contidos no pedido
  const idsProdutosPedido = pedidosCliente.flatMap(p => p.produtos);

  //Convertendo ids produtos pedidos no nome dos produtos
  const nomesProdutos = idsProdutosPedido //Criando variavel que ira auxiliar 
    .map(id => produtos.find(prodID => prodID.id === id)) // Funcao de array .map criara um novo array o qual transforma cada id em um objeto de produto (ou undefined se não achar)
    .filter(Boolean) //remove valores falsys ou undefined, ou seja, em casos em que o id não existem na lista produtos
    .map(prodId => prodId!.nome) // funcao de array .map utilizada pra criar um array com os nomes dos produtos

  return res.send(nomesProdutos);
});

// Exercício 2: Retornar os clientes que compraram produtos de uma categoria em específico
app.get("/categoria/:nome/clientes", function (req, res) {
  // Primeiro preciso coletar o dado passado pelo params e aplicar um pequeno tratamento
  const nomeCategoria = String(req.params.nome || "");
  const nomeCategoriaNorm = nomeCategoria.toLowerCase();

  // Em seguida, preciso filtrar produtos e ficar apenas com os que possuem a categoria informada
  const filtroProduto = produtos.filter(prod =>
    prod.categorias.some(cat => cat.toLowerCase() === nomeCategoriaNorm)
  );
  if (filtroProduto.length === 0) {
    return res.status(200).send(["Categoria não encontrada."]);
  }
  // Com produtos filtrado, preciso pegar os ids e salvar em um array
  const idsProdutos = filtroProduto.map(p => p.id);

  // Com os ids dos produtos, posso filtrar quais pedidos possue algum deles
  const pedidosProdutos = pedidos.filter(p =>
    p.produtos.some(idProduto => idsProdutos.includes(idProduto))
  );

  if (pedidosProdutos.length === 0) {
    return res.status(200).send(["Não há pedidos com produtos da categoria informada."]);
  }

  // Por fim, retorno um array com os nomes dos clientes
  const nomesClientes = pedidosProdutos.map(p => p.name);
  return res.send(nomesClientes);

});

//Exercício 3: Retornar os clientes com apenas um item no pedido
app.get("/clientes/um-item", function (req, res) {
  // Primeiro preciso definir a função que ira filtrar os clientes deixando apenas os com um item
  const clienteUmItem = pedidos.filter(p => p.produtos.length === 1);

  // Em seguida fiz um map, deixando apenas os nomes dos clientes
  const nomeClienteUmItem = clienteUmItem.map(p => p.name)

  // Apos, preciso retornar o array de resposta
  return res.send(nomeClienteUmItem);

});

//Exercício 4: Retornar um relatório por cliente: total de pedidos, itens distintos e categorias distintas
app.get("/relatorio/cliente/:nome", function (req, res) {
  // Primeiro preciso coletar o nome do cliente passado por params e tratalo  
  const nomeCliente = String(req.params.nome || "");
  const nomeClienteNorm = nomeCliente.toLowerCase();

  // Filtrar pelo nome do cliente e somar o total de pedidos feitos
  const pedidosCliente = pedidos.filter(p => p.name.toLowerCase() === nomeClienteNorm);
  const numeroPedidosCliente = pedidosCliente.length;

  // Listar os produtos comprados sem repetir e pegar o total
  const idsProdutosComprados = pedidosCliente.flatMap(p => p.produtos);
  const idsProdutosUnicos = [...new Set(idsProdutosComprados)];
  const numeroItensDistintos = idsProdutosUnicos.length;

  // Listar as categorias dos itens comprados sem repetir e pegar o total
  const produtosComprados = idsProdutosUnicos.map(id =>
    produtos.find(prod => prod.id === id)
  ).filter(Boolean);

  const categoriasCompradas = produtosComprados.flatMap(prod => prod!.categorias);
  const categoriasUnicas = [...new Set(categoriasCompradas)];
  const numeroCategoriasDistintas = categoriasUnicas.length;

  // Montar o relatório
  const relatorio = {
    cliente: nomeClienteNorm,
    totalPedidos: numeroPedidosCliente,
    itensDistintos: numeroItensDistintos,
    categoriasDistintas: numeroCategoriasDistintas
  };

  return res.send(relatorio);

});

//Exercício 5: Retornar produtos que contenham um trecho de uma busca em suas categorias (com query params)
app.get("/busca/", function (req, res) {
  // Preciso coletar a string de busca passado por query.params e fazer um leve tratamento
  const categoriaInput = String(req.query.categoria || "");
  const catInputNorm = categoriaInput.toLowerCase();

  // Preciso individualizar as categorias para ter uma busca mais precisa
  const todasCategorias = produtos.flatMap(produto => produto.categorias);

  // Filtra apenas as categorias que contêm o trecho buscado
  const categoriasComMatch = [...new Set(
    todasCategorias.filter(todasCategorias => 
      todasCategorias.toLowerCase().includes(catInputNorm)
    )
  )];
  
  return res.send(categoriasComMatch);
});

app.listen(3000, () => console.log('API on http://localhost:3000'));