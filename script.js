const CHAVE_USUARIOS = 'usuarios';
    const CHAVE_SESSAO = 'sessao';

    const telaAcesso = document.getElementById('telaAcesso');
    const app = document.getElementById('app');
    const titulo = document.getElementById('titulo');
    const abas = document.querySelectorAll('.aba');
    const form = document.getElementById('form');
    const campoNome = document.getElementById('campoNome');
    const inputNome = document.getElementById('nome');
    const inputEmail = document.getElementById('email');
    const inputSenha = document.getElementById('senha');
    const erro = document.getElementById('erro');
    const btnEnviar = document.getElementById('btnEnviar');
    const lateral = document.getElementById('lateral');
    const btnMenu = document.getElementById('btnMenu');
    const btnSair = document.getElementById('btnSair');
    const usuario = document.getElementById('usuario');
    const conteudo = document.getElementById('conteudo');
    const itensMenu = document.querySelectorAll('.menu-item:not(#btnSair)');

    let modo = 'login';

    /* ---------- Armazenamento (navegador; usa memória se o navegador bloquear) ---------- */
    const memoria = {};
    const guardar = {
      ler(chave) {
        try {
          const valor = localStorage.getItem(chave);
          if (valor !== null) return JSON.parse(valor);
        } catch (e) {}
        return memoria[chave] !== undefined ? JSON.parse(memoria[chave]) : null;
      },
      salvar(chave, valor) {
        const texto = JSON.stringify(valor);
        memoria[chave] = texto;
        try { localStorage.setItem(chave, texto); } catch (e) {}
      },
      apagar(chave) {
        delete memoria[chave];
        try { localStorage.removeItem(chave); } catch (e) {}
      }
    };

    /* ---------- Login / Cadastro ---------- */
    function mudarModo(novoModo) {
      modo = novoModo;
      const cadastro = modo === 'cadastro';
      campoNome.hidden = !cadastro;
      titulo.textContent = cadastro ? 'Criar conta' : 'Entrar';
      btnEnviar.textContent = cadastro ? 'Cadastrar' : 'Entrar';
      inputSenha.autocomplete = cadastro ? 'new-password' : 'current-password';
      erro.textContent = '';
      abas.forEach(aba => aba.classList.toggle('ativa', aba.dataset.modo === modo));
    }

    abas.forEach(aba => aba.addEventListener('click', () => mudarModo(aba.dataset.modo)));

    form.addEventListener('submit', e => {
      e.preventDefault();
      erro.textContent = '';

      const nome = inputNome.value.trim();
      const email = inputEmail.value.trim().toLowerCase();
      const senha = inputSenha.value;
      const usuarios = guardar.ler(CHAVE_USUARIOS) || [];

      if (!email || !email.includes('@') || !email.includes('.')) {
        erro.textContent = 'Digite um e-mail válido.';
        return;
      }

      if (modo === 'cadastro') {
        if (!nome) {
          erro.textContent = 'Digite seu nome.';
          return;
        }
        if (senha.length < 6) {
          erro.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
          return;
        }
        if (usuarios.some(u => u.email === email)) {
          erro.textContent = 'Este e-mail já está cadastrado.';
          return;
        }
        usuarios.push({ nome, email, senha });
        guardar.salvar(CHAVE_USUARIOS, usuarios);
        entrar({ nome, email });
      } else {
        const encontrado = usuarios.find(u => u.email === email && u.senha === senha);
        if (!encontrado) {
          erro.textContent = 'E-mail ou senha incorretos.';
          return;
        }
        entrar({ nome: encontrado.nome, email: encontrado.email });
      }
    });

    /* ---------- Troca de tela ---------- */
    function entrar(dados) {
      guardar.salvar(CHAVE_SESSAO, dados);
      usuario.textContent = dados.nome;
      telaAcesso.hidden = true;
      app.hidden = false;
      mostrarHome();
      fecharMenu();
    }

    function sair() {
      guardar.apagar(CHAVE_SESSAO);
      form.reset();
      conteudo.replaceChildren();
      itensMenu.forEach(i => i.classList.remove('ativo'));
      mudarModo('login');
      app.hidden = true;
      telaAcesso.hidden = false;
    }

    btnSair.addEventListener('click', sair);

    /* ---------- Menu lateral (3 tracinhos) ---------- */
    function abrirMenu() {
      lateral.classList.add('aberta');
      btnMenu.setAttribute('aria-expanded', 'true');
      btnMenu.setAttribute('aria-label', 'Fechar menu');
    }

    function fecharMenu() {
      lateral.classList.remove('aberta');
      btnMenu.setAttribute('aria-expanded', 'false');
      btnMenu.setAttribute('aria-label', 'Abrir menu');
    }

    btnMenu.addEventListener('click', () => {
      if (lateral.classList.contains('aberta')) fecharMenu();
      else abrirMenu();
    });

    itensMenu.forEach(item => {
      item.addEventListener('click', () => {
        itensMenu.forEach(i => i.classList.remove('ativo'));
        item.classList.add('ativo');
      });
    });

    conteudo.addEventListener('click', fecharMenu);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') fecharMenu();
    });


    /* ---------- Produtos (estilo marketplace) ---------- */
    /* Para testar o critério de falha, troque "estoque" por 0. */
    const PRODUTOS = [
      {
        id: 1,
        nome: 'Fone de Ouvido Bluetooth Sem Fio com Cancelamento de Ruído',
        marca: 'SonoMax',
        emoji: '🎧',
        preco: 189.90,
        precoAntigo: 249.90,
        parcelas: 12,
        freteGratis: true,
        estoque: 12,
        vendidos: 1840,
        avaliacao: 4.7,
        avaliacoes: 523,
        vendedor: 'SonoMax Oficial',
        descricao: 'Fone over-ear com Bluetooth 5.3, cancelamento ativo de ruído e microfone embutido para chamadas. A bateria dura até 40 horas e o carregamento rápido dá 5 horas de uso com 10 minutos na tomada.',
        caracteristicas: [
          ['Marca', 'SonoMax'],
          ['Modelo', 'SM-700'],
          ['Conexão', 'Bluetooth 5.3 e cabo P2'],
          ['Bateria', 'Até 40 horas'],
          ['Cor', 'Preto'],
          ['Garantia', '12 meses do vendedor']
        ]
      }
    ];

    const moeda = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    function criar(tag, classe, texto) {
      const el = document.createElement(tag);
      if (classe) el.className = classe;
      if (texto !== undefined) el.textContent = texto;
      return el;
    }

    function criarBarraPesquisa() {
      const busca = criar('form', 'barra-pesquisa');
      busca.setAttribute('role', 'search');

      const campo = criar('input', '', '');
      campo.type = 'search';
      campo.id = 'campoPesquisa';
      campo.name = 'pesquisa';
      campo.placeholder = 'Buscar produtos';
      campo.setAttribute('aria-label', 'Buscar produtos');

      const lupa = criar('button', 'btn-pesquisa', '⌕');
      lupa.type = 'submit';
      lupa.setAttribute('aria-label', 'Pesquisar');
      busca.append(campo, lupa);

      busca.addEventListener('submit', e => {
        e.preventDefault();
        const termo = campo.value.trim();
        if (termo) mostrarListaProdutos(termo);
      });

      return busca;
    }

    function mostrarHome() {
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina pagina-home');
      pagina.appendChild(criar('h1', 'home-titulo', 'Encontre o que você precisa'));
      pagina.appendChild(criar('p', 'home-subtitulo', 'Busque por produtos e anúncios disponíveis.'));
      pagina.appendChild(criarBarraPesquisa());
      conteudo.appendChild(pagina);
    }

    function mostrarListaProdutos(termo = '') {
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');
      pagina.appendChild(criar('h2', 'pagina-titulo', termo ? 'Resultados para "' + termo + '"' : 'Produtos'));

      const grade = criar('div', 'grade-produtos');
      const busca = termo.toLocaleLowerCase();
      const produtos = PRODUTOS.filter(p => {
        if (!busca) return true;
        return [p.nome, p.marca, p.descricao].some(valor =>
          valor.toLocaleLowerCase().includes(busca)
        );
      });

      produtos.forEach(p => {
        const card = criar('button', 'card-produto');
        card.type = 'button';
        card.setAttribute('aria-label', 'Abrir página do produto: ' + p.nome);
        card.appendChild(criar('div', 'card-imagem', p.emoji));

        const info = criar('div', 'card-info');
        if (p.precoAntigo) info.appendChild(criar('span', 'preco-antigo', moeda(p.precoAntigo)));
        info.appendChild(criar('span', 'preco', moeda(p.preco)));
        info.appendChild(criar('span', 'parcelas', 'em ' + p.parcelas + 'x ' + moeda(p.preco / p.parcelas) + ' sem juros'));
        if (p.freteGratis) info.appendChild(criar('span', 'frete', 'Frete grátis'));
        info.appendChild(criar('span', 'card-nome', p.nome));
        card.appendChild(info);

        card.addEventListener('click', () => abrirProduto(p.id));
        grade.appendChild(card);
      });

      if (produtos.length) {
        pagina.appendChild(grade);
      } else {
        const vazio = criar('p', 'resultado-vazio', 'Nenhum anúncio encontrado para essa busca.');
        vazio.setAttribute('role', 'status');
        pagina.appendChild(vazio);
      }
      conteudo.appendChild(pagina);
    }

    /* Abre a página do produto. Sem estoque, mostra erro. */
    function abrirProduto(id) {
      const p = PRODUTOS.find(item => item.id === id);
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');

      const voltar = criar('button', 'link-voltar', '‹ Voltar para produtos');
      voltar.type = 'button';
      voltar.addEventListener('click', mostrarListaProdutos);
      pagina.appendChild(voltar);

      if (!p || p.estoque <= 0) {
        const msg = criar('div', 'erro-produto', 'Produto indisponível no momento');
        msg.setAttribute('role', 'alert');
        pagina.appendChild(msg);
        conteudo.appendChild(pagina);
        window.scrollTo(0, 0);
        return;
      }

      const topo = criar('div', 'produto');

      const galeria = criar('div', 'produto-imagem', p.emoji);
      galeria.setAttribute('role', 'img');
      galeria.setAttribute('aria-label', 'Imagem do produto');
      topo.appendChild(galeria);

      const compra = criar('div', 'produto-compra');
      compra.appendChild(criar('span', 'produto-status', 'Novo | ' + p.vendidos.toLocaleString('pt-BR') + ' vendidos'));
      compra.appendChild(criar('h2', 'produto-nome', p.nome));
      compra.appendChild(criar('span', 'produto-avaliacao', '★ ' + p.avaliacao.toFixed(1) + ' (' + p.avaliacoes + ' avaliações)'));
      if (p.precoAntigo) compra.appendChild(criar('span', 'preco-antigo', moeda(p.precoAntigo)));
      const linhaPreco = criar('div', 'produto-preco', moeda(p.preco));
      if (p.precoAntigo) linhaPreco.appendChild(criar('small', 'desconto', Math.round((1 - p.preco / p.precoAntigo) * 100) + '% OFF'));
      compra.appendChild(linhaPreco);
      compra.appendChild(criar('span', 'parcelas', 'em ' + p.parcelas + 'x ' + moeda(p.preco / p.parcelas) + ' sem juros'));
      if (p.freteGratis) compra.appendChild(criar('span', 'frete', 'Chegará grátis'));
      compra.appendChild(criar('span', 'estoque', 'Estoque disponível: ' + p.estoque + ' unidades'));

      const comprar = criar('button', 'btn', 'Comprar agora');
      comprar.type = 'button';
      compra.appendChild(comprar);
      compra.appendChild(criar('span', 'vendedor', 'Vendido por ' + p.vendedor));
      topo.appendChild(compra);
      pagina.appendChild(topo);

      const detalhes = criar('div', 'produto-detalhes');
      detalhes.appendChild(criar('h3', 'secao-titulo', 'Características'));
      const tabela = criar('dl', 'caracteristicas');
      p.caracteristicas.forEach(([k, v]) => {
        tabela.appendChild(criar('dt', '', k));
        tabela.appendChild(criar('dd', '', v));
      });
      detalhes.appendChild(tabela);
      detalhes.appendChild(criar('h3', 'secao-titulo', 'Descrição'));
      detalhes.appendChild(criar('p', 'descricao', p.descricao));
      pagina.appendChild(detalhes);

      conteudo.appendChild(pagina);
      window.scrollTo(0, 0);
    }

    document.querySelector('[data-aba="produtos"]').addEventListener('click', () => {
      mostrarListaProdutos();
      fecharMenu();
    });

    document.querySelector('[data-aba="home"]').addEventListener('click', () => {
      mostrarHome();
      fecharMenu();
    });

    /* ---------- Ao abrir a página ---------- */
    const sessao = guardar.ler(CHAVE_SESSAO);
    if (sessao) entrar(sessao);