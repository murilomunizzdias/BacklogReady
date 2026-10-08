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
      if (!conteudo.hasChildNodes()) {
        mostrarListaProdutos();
      }
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
        custo: 120.00,
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
      },
      {
        id: 2,
        nome: 'Smartwatch Fit Pro com GPS e Monitor Cardíaco',
        marca: 'Fit Pro',
        emoji: '⌚',
        preco: 299.90,
        precoAntigo: 379.90,
        parcelas: 10,
        freteGratis: true,
        estoque: 8,
        custo: 190.00,
        vendidos: 960,
        avaliacao: 4.5,
        avaliacoes: 312,
        vendedor: 'SonoMax Oficial',
        descricao: 'Relógio inteligente com GPS integrado, monitor cardíaco 24 horas, resistência à água de 5 ATM e bateria de até 7 dias.',
        caracteristicas: [
          ['Marca', 'Fit Pro'],
          ['Tela', '1,4 pol. AMOLED'],
          ['Bateria', 'Até 7 dias'],
          ['Resistência', '5 ATM'],
          ['Garantia', '12 meses do vendedor']
        ]
      },
      {
        id: 3,
        nome: 'Mochila Impermeável 25L para Notebook',
        marca: 'TrilhaUrbana',
        emoji: '🎒',
        preco: 129.90,
        precoAntigo: 159.90,
        parcelas: 6,
        freteGratis: true,
        estoque: 20,
        custo: 70.00,
        vendidos: 2410,
        avaliacao: 4.8,
        avaliacoes: 877,
        vendedor: 'SonoMax Oficial',
        descricao: 'Mochila impermeável de 25 litros com compartimento acolchoado para notebook de até 15,6 polegadas e porta USB externa.',
        caracteristicas: [
          ['Marca', 'TrilhaUrbana'],
          ['Capacidade', '25 litros'],
          ['Material', 'Poliéster impermeável'],
          ['Cor', 'Cinza grafite'],
          ['Garantia', '6 meses do vendedor']
        ]
      },
      {
        id: 4,
        nome: 'Garrafa Térmica de Inox 1 Litro',
        marca: 'TermoVida',
        emoji: '🥤',
        preco: 79.90,
        precoAntigo: 99.90,
        parcelas: 3,
        freteGratis: true,
        estoque: 35,
        custo: 35.00,
        vendidos: 5120,
        avaliacao: 4.9,
        avaliacoes: 1630,
        vendedor: 'SonoMax Oficial',
        descricao: 'Garrafa térmica de aço inox com parede dupla a vácuo. Mantém bebidas geladas por 24 horas ou quentes por 12 horas.',
        caracteristicas: [
          ['Marca', 'TermoVida'],
          ['Capacidade', '1 litro'],
          ['Material', 'Aço inox 304'],
          ['Cor', 'Prata'],
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

      const freteBox = criar('section', 'calculo-frete');
      freteBox.setAttribute('aria-labelledby', 'titulo-frete');
      const tituloFrete = criar('h3', 'calculo-frete-titulo', 'Calcule o frete');
      tituloFrete.id = 'titulo-frete';
      freteBox.appendChild(tituloFrete);

      const freteForm = criar('form', 'form-frete');
      const cepLabel = criar('label', 'campo-frete', 'Digite seu CEP');
      const cepInput = document.createElement('input');
      cepInput.type = 'text';
      cepInput.inputMode = 'numeric';
      cepInput.autocomplete = 'postal-code';
      cepInput.maxLength = 9;
      cepInput.placeholder = '00000-000';
      cepInput.setAttribute('aria-label', 'CEP');
      cepLabel.appendChild(cepInput);
      freteForm.appendChild(cepLabel);

      const calcularFrete = criar('button', 'btn btn-calcular-frete', 'Calcular');
      calcularFrete.type = 'submit';
      freteForm.appendChild(calcularFrete);
      freteBox.appendChild(freteForm);

      const freteMensagem = criar('p', 'mensagem-frete');
      freteMensagem.setAttribute('role', 'status');
      freteMensagem.setAttribute('aria-live', 'polite');
      freteBox.appendChild(freteMensagem);

      const opcoesFrete = criar('div', 'opcoes-frete');
      freteBox.appendChild(opcoesFrete);

      freteForm.addEventListener('submit', e => {
        e.preventDefault();
        const cep = cepInput.value.replace(/\D/g, '');
        freteMensagem.className = 'mensagem-frete';
        opcoesFrete.replaceChildren();

        if (cep.length !== 8 || /^0+$/.test(cep)) {
          freteMensagem.classList.add('mensagem-frete-erro');
          freteMensagem.textContent = 'CEP inválido. Digite um CEP com 8 números.';
          cepInput.focus();
          return;
        }

        freteMensagem.classList.add('mensagem-frete-sucesso');
        freteMensagem.textContent = 'Opções de frete para o CEP ' + cep.slice(0, 5) + '-' + cep.slice(5) + ':';

        const opcoes = [
          { nome: p.freteGratis ? 'Frete grátis' : 'Entrega econômica', prazo: '8 a 12 dias úteis', valor: p.freteGratis ? 0 : 18.90 },
          { nome: 'Entrega expressa', prazo: '3 a 5 dias úteis', valor: 29.90 }
        ];

        opcoes.forEach(opcao => {
          const item = criar('div', 'opcao-frete');
          const dados = criar('div', 'opcao-frete-dados');
          dados.appendChild(criar('strong', '', opcao.nome));
          dados.appendChild(criar('span', '', opcao.prazo));
          item.appendChild(dados);
          item.appendChild(criar('strong', 'opcao-frete-valor', opcao.valor === 0 ? 'Grátis' : moeda(opcao.valor)));
          opcoesFrete.appendChild(item);
        });
      });

      compra.appendChild(freteBox);

      const comprar = criar('button', 'btn', 'Comprar agora');
      comprar.type = 'button';
      comprar.addEventListener('click', () => abrirSelecaoModoCompra(p));
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

    /* ---------- Valor 8: Seleção do modo de compra ---------- */
    const MODOS_COMPRA = [
      { id: 'pix', nome: 'Pix', icone: '⚡', descricao: 'Aprovação imediata e 5% de desconto', desconto: 0.05 },
      { id: 'cartao', nome: 'Cartão de Crédito', icone: '💳', descricao: 'Em até 12x sem juros', desconto: 0 },
      { id: 'boleto', nome: 'Boleto Bancário', icone: '📄', descricao: 'Vencimento em 3 dias úteis', desconto: 0 }
    ];

    function abrirSelecaoModoCompra(p) {
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');

      const voltar = criar('button', 'link-voltar', '‹ Voltar ao produto');
      voltar.type = 'button';
      voltar.addEventListener('click', () => abrirProduto(p.id));
      pagina.appendChild(voltar);

      pagina.appendChild(criar('h2', 'pagina-titulo', 'Selecione o modo de compra'));

      const container = criar('div', 'checkout-container');

      // Resumo do produto
      const resumo = criar('div', 'checkout-resumo');
      resumo.appendChild(criar('h3', 'secao-titulo', 'Resumo do pedido'));

      const itemResumo = criar('div', 'resumo-item');
      itemResumo.appendChild(criar('div', 'resumo-icone', p.emoji));
      const itemInfo = criar('div', 'resumo-info');
      itemInfo.appendChild(criar('strong', '', p.nome));
      itemInfo.appendChild(criar('span', 'resumo-preco-unitario', 'Preço unitário: ' + moeda(p.preco)));
      itemResumo.appendChild(itemInfo);
      resumo.appendChild(itemResumo);

      const totalInfo = criar('div', 'resumo-total');
      const labelTotal = criar('span', '', 'Total:');
      const valorTotal = criar('strong', 'total-destaque', moeda(p.preco));
      totalInfo.appendChild(labelTotal);
      totalInfo.appendChild(valorTotal);
      resumo.appendChild(totalInfo);

      container.appendChild(resumo);

      // Opções do modo de compra
      const opcoesContainer = criar('div', 'checkout-opcoes');
      opcoesContainer.appendChild(criar('h3', 'secao-titulo', 'Modo de compra'));

      let modoSelecionado = null;
      const botoesModos = [];

      const btnConfirmar = criar('button', 'btn btn-confirmar-compra', 'Confirmar compra');
      btnConfirmar.type = 'button';
      btnConfirmar.disabled = true;

      const listaModos = criar('div', 'grade-modos');

      MODOS_COMPRA.forEach(modo => {
        const opcao = criar('button', 'opcao-modo');
        opcao.type = 'button';

        const topoOpcao = criar('div', 'opcao-modo-topo');
        topoOpcao.appendChild(criar('span', 'opcao-modo-icone', modo.icone));
        topoOpcao.appendChild(criar('strong', 'opcao-modo-nome', modo.nome));
        opcao.appendChild(topoOpcao);

        opcao.appendChild(criar('span', 'opcao-modo-desc', modo.descricao));

        opcao.addEventListener('click', () => {
          modoSelecionado = modo;
          botoesModos.forEach(b => b.classList.remove('selecionado'));
          opcao.classList.add('selecionado');
          btnConfirmar.disabled = false;

          const precoFinal = modo.desconto > 0 ? p.preco * (1 - modo.desconto) : p.preco;
          valorTotal.textContent = moeda(precoFinal);
          labelTotal.textContent = modo.desconto > 0 ? 'Total com 5% de desconto (Pix):' : 'Total:';
        });

        botoesModos.push(opcao);
        listaModos.appendChild(opcao);
      });

      opcoesContainer.appendChild(listaModos);

      btnConfirmar.addEventListener('click', () => {
        if (!modoSelecionado) return;
        finalizarCompra(p, modoSelecionado);
      });

      opcoesContainer.appendChild(btnConfirmar);
      container.appendChild(opcoesContainer);

      pagina.appendChild(container);
      conteudo.appendChild(pagina);
      window.scrollTo(0, 0);
    }

    function finalizarCompra(p, modo) {
      if (p.estoque > 0) {
        p.estoque -= 1;
      }

      const precoFinal = modo.desconto > 0 ? p.preco * (1 - modo.desconto) : p.preco;
      const sessaoAtual = guardar.ler(CHAVE_SESSAO);
      const emailUsuario = sessaoAtual ? sessaoAtual.email : 'geral';
      const chaveExtrato = 'extrato_' + emailUsuario;

      const extratoAtual = guardar.ler(chaveExtrato) || [];
      const agora = new Date();
      const novaTransacao = {
        id: Date.now(),
        data: agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        produtoId: p.id,
        produto: p.nome,
        vendedor: p.vendedor,
        freteGratis: p.freteGratis,
        emoji: p.emoji,
        modoCompra: modo.nome,
        valor: precoFinal,
        status: 'Aprovado'
      };

      extratoAtual.unshift(novaTransacao);
      guardar.salvar(chaveExtrato, extratoAtual);

      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');

      const cardSucesso = criar('div', 'sucesso-compra');
      cardSucesso.appendChild(criar('div', 'sucesso-icone', '✅'));
      cardSucesso.appendChild(criar('h2', 'sucesso-titulo', 'Compra realizada com sucesso!'));
      cardSucesso.appendChild(criar('p', 'sucesso-desc', 'Você selecionou o modo de compra: ' + modo.nome));

      const infoResumo = criar('div', 'sucesso-detalhes');
      infoResumo.appendChild(criar('p', '', 'Produto: ' + p.nome));
      infoResumo.appendChild(criar('p', '', 'Valor pago: ' + moeda(precoFinal)));
      infoResumo.appendChild(criar('p', '', 'Data: ' + novaTransacao.data));
      cardSucesso.appendChild(infoResumo);

      const acoes = criar('div', 'sucesso-acoes');
      const btnExtrato = criar('button', 'btn', 'Ver extrato');
      btnExtrato.type = 'button';
      btnExtrato.addEventListener('click', () => {
        mostrarExtrato();
      });

      const btnProdutos = criar('button', 'btn btn-secundario', 'Continuar comprando');
      btnProdutos.type = 'button';
      btnProdutos.addEventListener('click', () => {
        mostrarListaProdutos();
      });

      const btnPedidos = criar('button', 'btn btn-secundario', 'Meus pedidos');
      btnPedidos.type = 'button';
      btnPedidos.addEventListener('click', () => {
        abrirPedido(novaTransacao.id);
      });

      acoes.appendChild(btnExtrato);
      acoes.appendChild(btnPedidos);
      acoes.appendChild(btnProdutos);
      cardSucesso.appendChild(acoes);

      pagina.appendChild(cardSucesso);
      conteudo.appendChild(pagina);
      window.scrollTo(0, 0);
    }

    /* ---------- Valor 7: Ver extrato ---------- */
    function mostrarExtrato() {
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');

      const voltar = criar('button', 'link-voltar', '‹ Voltar para produtos');
      voltar.type = 'button';
      voltar.addEventListener('click', mostrarListaProdutos);
      pagina.appendChild(voltar);

      pagina.appendChild(criar('h2', 'pagina-titulo', 'Extrato de Compras'));

      const sessaoAtual = guardar.ler(CHAVE_SESSAO);
      const emailUsuario = sessaoAtual ? sessaoAtual.email : 'geral';
      const chaveExtrato = 'extrato_' + emailUsuario;
      const transacoes = guardar.ler(chaveExtrato) || [];

      if (transacoes.length === 0) {
        const vazio = criar('div', 'extrato-vazio');
        vazio.appendChild(criar('p', '', 'Nenhuma compra registrada no seu extrato.'));
        const btnComprar = criar('button', 'btn', 'Ver produtos disponíveis');
        btnComprar.type = 'button';
        btnComprar.addEventListener('click', mostrarListaProdutos);
        vazio.appendChild(btnComprar);
        pagina.appendChild(vazio);
      } else {
        const listaExtrato = criar('div', 'lista-extrato');
        transacoes.forEach(t => {
          const item = criar('div', 'card-extrato');

          const esq = criar('div', 'extrato-col-esq');
          if (t.emoji) {
            esq.appendChild(criar('span', 'extrato-emoji', t.emoji));
          }
          const info = criar('div', 'extrato-info');
          info.appendChild(criar('strong', 'extrato-produto-nome', t.produto));
          info.appendChild(criar('span', 'extrato-modo', 'Modo: ' + t.modoCompra));
          info.appendChild(criar('span', 'extrato-data', t.data));
          esq.appendChild(info);
          item.appendChild(esq);

          const dir = criar('div', 'extrato-col-dir');
          dir.appendChild(criar('span', 'extrato-valor', moeda(t.valor)));
          dir.appendChild(criar('span', 'badge-status', t.status || 'Aprovado'));
          item.appendChild(dir);

          listaExtrato.appendChild(item);
        });
        pagina.appendChild(listaExtrato);
      }

      conteudo.appendChild(pagina);
      window.scrollTo(0, 0);
    }

    /* ---------- Meus Pedidos ---------- */
    /* Os pedidos são as compras salvas no extrato do usuário. */
    const ETAPAS_PEDIDO = ['Pedido realizado', 'Pagamento aprovado', 'Em preparação', 'Enviado', 'Entregue'];

    function lerPedidos() {
      const sessaoAtual = guardar.ler(CHAVE_SESSAO);
      const emailUsuario = sessaoAtual ? sessaoAtual.email : 'geral';
      return guardar.ler('extrato_' + emailUsuario) || [];
    }

    const numeroPedido = pedido => '#' + String(pedido.id).slice(-8);

    /* Boleto fica aguardando pagamento; Pix e cartão já saem aprovados. */
    function etapaAtual(pedido) {
      return pedido.modoCompra === 'Boleto Bancário' ? 0 : 1;
    }

    function textoStatus(pedido) {
      return etapaAtual(pedido) === 0 ? 'Aguardando pagamento' : ETAPAS_PEDIDO[etapaAtual(pedido)];
    }

    function mostrarPedidos() {
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');

      const voltar = criar('button', 'link-voltar', '‹ Voltar para produtos');
      voltar.type = 'button';
      voltar.addEventListener('click', mostrarListaProdutos);
      pagina.appendChild(voltar);

      pagina.appendChild(criar('h2', 'pagina-titulo', 'Meus Pedidos'));

      const pedidos = lerPedidos();

      if (pedidos.length === 0) {
        const vazio = criar('div', 'extrato-vazio');
        vazio.appendChild(criar('p', '', 'Você ainda não fez nenhum pedido.'));
        const btnComprar = criar('button', 'btn', 'Ver produtos disponíveis');
        btnComprar.type = 'button';
        btnComprar.addEventListener('click', mostrarListaProdutos);
        vazio.appendChild(btnComprar);
        pagina.appendChild(vazio);
      } else {
        const lista = criar('div', 'lista-extrato');
        pedidos.forEach(pedido => {
          const item = criar('button', 'card-extrato card-pedido');
          item.type = 'button';
          item.setAttribute('aria-label', 'Ver detalhes do pedido ' + numeroPedido(pedido));

          const esq = criar('div', 'extrato-col-esq');
          if (pedido.emoji) esq.appendChild(criar('span', 'extrato-emoji', pedido.emoji));
          const info = criar('div', 'extrato-info');
          info.appendChild(criar('span', 'pedido-numero', 'Pedido ' + numeroPedido(pedido)));
          info.appendChild(criar('strong', 'extrato-produto-nome', pedido.produto));
          info.appendChild(criar('span', 'extrato-data', 'Feito em ' + pedido.data));
          esq.appendChild(info);
          item.appendChild(esq);

          const dir = criar('div', 'extrato-col-dir');
          dir.appendChild(criar('span', 'extrato-valor', moeda(pedido.valor)));
          const status = criar('span', 'badge-status', textoStatus(pedido));
          if (etapaAtual(pedido) === 0) status.classList.add('pendente');
          dir.appendChild(status);
          item.appendChild(dir);

          item.addEventListener('click', () => abrirPedido(pedido.id));
          lista.appendChild(item);
        });
        pagina.appendChild(lista);
      }

      conteudo.appendChild(pagina);
      window.scrollTo(0, 0);
    }

    function abrirPedido(id) {
      const pedido = lerPedidos().find(item => item.id === id);
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');

      const voltar = criar('button', 'link-voltar', '‹ Voltar para meus pedidos');
      voltar.type = 'button';
      voltar.addEventListener('click', mostrarPedidos);
      pagina.appendChild(voltar);

      if (!pedido) {
        const msg = criar('div', 'erro-produto', 'Pedido não encontrado');
        msg.setAttribute('role', 'alert');
        pagina.appendChild(msg);
        conteudo.appendChild(pagina);
        window.scrollTo(0, 0);
        return;
      }

      pagina.appendChild(criar('h2', 'pagina-titulo', 'Pedido ' + numeroPedido(pedido)));

      const container = criar('div', 'checkout-container');

      // Acompanhamento do pedido
      const acompanhamento = criar('div', 'checkout-resumo');
      acompanhamento.appendChild(criar('h3', 'secao-titulo', 'Acompanhamento'));
      const etapas = criar('ol', 'etapas-pedido');
      const atual = etapaAtual(pedido);
      ETAPAS_PEDIDO.forEach((nome, i) => {
        const etapa = criar('li', 'etapa', i === 1 && atual === 0 ? 'Aguardando pagamento' : nome);
        if (i < atual) etapa.classList.add('concluida');
        if (i === atual) {
          etapa.classList.add('atual');
          etapa.setAttribute('aria-current', 'step');
        }
        etapas.appendChild(etapa);
      });
      acompanhamento.appendChild(etapas);
      container.appendChild(acompanhamento);

      // Resumo do pedido
      const resumo = criar('div', 'checkout-resumo');
      resumo.appendChild(criar('h3', 'secao-titulo', 'Resumo do pedido'));

      const itemResumo = criar('div', 'resumo-item');
      itemResumo.appendChild(criar('div', 'resumo-icone', pedido.emoji || '📦'));
      const itemInfo = criar('div', 'resumo-info');
      itemInfo.appendChild(criar('strong', '', pedido.produto));
      itemInfo.appendChild(criar('span', 'resumo-preco-unitario', 'Quantidade: 1'));
      if (pedido.vendedor) itemInfo.appendChild(criar('span', 'resumo-preco-unitario', 'Vendido por ' + pedido.vendedor));
      itemResumo.appendChild(itemInfo);
      resumo.appendChild(itemResumo);

      const dados = criar('dl', 'caracteristicas pedido-dados');
      [
        ['Data', pedido.data],
        ['Pagamento', pedido.modoCompra],
        ['Frete', pedido.freteGratis === false ? 'A combinar' : 'Grátis'],
        ['Status', textoStatus(pedido)]
      ].forEach(([k, v]) => {
        dados.appendChild(criar('dt', '', k));
        dados.appendChild(criar('dd', '', v));
      });
      resumo.appendChild(dados);

      const totalInfo = criar('div', 'resumo-total');
      totalInfo.appendChild(criar('span', '', atual === 0 ? 'Total:' : 'Total pago:'));
      totalInfo.appendChild(criar('strong', 'total-destaque', moeda(pedido.valor)));
      resumo.appendChild(totalInfo);

      container.appendChild(resumo);
      pagina.appendChild(container);

      const produto = PRODUTOS.find(p => p.id === pedido.produtoId);
      if (produto) {
        const btnNovamente = criar('button', 'btn btn-comprar-novamente', 'Comprar novamente');
        btnNovamente.type = 'button';
        btnNovamente.addEventListener('click', () => abrirProduto(produto.id));
        pagina.appendChild(btnNovamente);
      }

      conteudo.appendChild(pagina);
      window.scrollTo(0, 0);
    }

    document.querySelector('[data-aba="produtos"]').addEventListener('click', () => {
      mostrarListaProdutos();
      fecharMenu();
    });

    const btnAbaExtrato = document.querySelector('[data-aba="extrato"]');
    if (btnAbaExtrato) {
      btnAbaExtrato.addEventListener('click', () => {
        mostrarExtrato();
        fecharMenu();
      });
    }

    document.querySelector('[data-aba="pedidos"]').addEventListener('click', () => {
      mostrarPedidos();
      fecharMenu();
    });

    /* ---------- Extrato de vendas (vendedor) ---------- */
    /* "adicionais" = custos descontados no recebimento (frete, embalagem).
       Sem adicionais, o valor recebido é igual ao valor da venda. */
    const VENDAS = [
      { id: 'V-1001', produtoId: 1, quantidade: 1, data: '03/10/2026', comprador: 'Mariana S.', adicionais: [] },
      { id: 'V-1002', produtoId: 2, quantidade: 1, data: '03/10/2026', comprador: 'Carlos P.', adicionais: [] },
      { id: 'V-1003', produtoId: 3, quantidade: 2, data: '04/10/2026', comprador: 'Juliana M.', adicionais: [] },
      { id: 'V-1004', produtoId: 1, quantidade: 1, data: '04/10/2026', comprador: 'Roberto A.',
        adicionais: [{ tipo: 'Frete', valor: 24.90 }] },
      { id: 'V-1005', produtoId: 4, quantidade: 3, data: '05/10/2026', comprador: 'Fernanda L.',
        adicionais: [{ tipo: 'Frete', valor: 18.50 }, { tipo: 'Embalagem', valor: 6.00 }] },
      { id: 'V-1006', produtoId: 2, quantidade: 2, data: '05/10/2026', comprador: 'Paulo H.',
        adicionais: [{ tipo: 'Frete', valor: 31.40 }, { tipo: 'Embalagem', valor: 12.90 }] }
    ];

    const centavos = v => Math.round(v * 100);
    const porcento = v => v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';

    /* Calcula venda, recebimento, diferença e lucro de uma venda */
    function calcularVenda(v) {
      const prod = PRODUTOS.find(p => p.id === v.produtoId);
      const venda = centavos(prod.preco) * v.quantidade;
      const adicionais = v.adicionais.reduce((t, a) => t + centavos(a.valor), 0);
      const recebido = venda - adicionais;
      const custo = centavos(prod.custo) * v.quantidade;
      const lucro = recebido - custo;
      return {
        prod,
        venda: venda / 100,
        recebido: recebido / 100,
        diferenca: (recebido - venda) / 100,
        custo: custo / 100,
        lucro: lucro / 100,
        margem: lucro / venda * 100,
        correto: recebido === venda
      };
    }

    function mostrarExtratoVendas() {
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');
      pagina.appendChild(criar('h2', 'pagina-titulo', 'Extrato de vendas'));

      const calc = VENDAS.map(calcularVenda);
      const totalVenda = calc.reduce((t, c) => t + c.venda, 0);
      const totalRecebido = calc.reduce((t, c) => t + c.recebido, 0);
      const comDiferenca = calc.filter(c => !c.correto).length;

      const resumo = criar('div', 'vendas-resumo');
      [
        ['Total vendido', moeda(totalVenda)],
        ['Total recebido', moeda(totalRecebido)],
        ['Vendas com diferença', comDiferenca + ' de ' + calc.length]
      ].forEach(([k, val]) => {
        const item = criar('div', 'vendas-resumo-item');
        item.appendChild(criar('span', 'vendas-meta', k));
        item.appendChild(criar('strong', 'vendas-resumo-valor', val));
        resumo.appendChild(item);
      });
      pagina.appendChild(resumo);

      const lista = criar('div', 'vendas-lista');
      VENDAS.forEach((v, i) => {
        const c = calc[i];
        const linha = criar('button', 'vendas-linha');
        linha.type = 'button';
        linha.setAttribute('aria-label', 'Abrir extrato da venda ' + v.id);
        linha.appendChild(criar('span', 'vendas-icone', c.prod.emoji));

        const info = criar('span', 'vendas-info');
        info.appendChild(criar('span', 'vendas-nome', c.prod.nome));
        info.appendChild(criar('span', 'vendas-meta', 'Venda ' + v.id + ' • ' + v.data + ' • ' + v.quantidade + ' un.'));
        linha.appendChild(info);

        const valores = criar('span', 'vendas-valores');
        valores.appendChild(criar('span', 'vendas-valor', moeda(c.recebido)));
        valores.appendChild(criar('span', 'vendas-meta', 'venda ' + moeda(c.venda)));
        linha.appendChild(valores);

        linha.appendChild(criar('span', c.correto ? 'selo selo-ok' : 'selo selo-dif', c.correto ? 'Valores iguais' : 'Diferença'));
        linha.addEventListener('click', () => abrirExtratoVenda(v.id));
        lista.appendChild(linha);
      });
      pagina.appendChild(lista);
      conteudo.appendChild(pagina);
      window.scrollTo(0, 0);
    }

    /* Abre o extrato da venda e compara valor vendido x valor recebido */
    function abrirExtratoVenda(idVenda) {
      const v = VENDAS.find(item => item.id === idVenda);
      conteudo.replaceChildren();
      const pagina = criar('div', 'pagina');

      const voltar = criar('button', 'link-voltar', '‹ Voltar para extrato de vendas');
      voltar.type = 'button';
      voltar.addEventListener('click', mostrarExtratoVendas);
      pagina.appendChild(voltar);

      if (!v) {
        const msg = criar('div', 'erro-produto', 'Venda não encontrada');
        msg.setAttribute('role', 'alert');
        pagina.appendChild(msg);
        conteudo.appendChild(pagina);
        return;
      }

      const c = calcularVenda(v);
      const caixa = criar('div', 'vendas-detalhe');
      caixa.appendChild(criar('h2', 'produto-nome', c.prod.nome));
      caixa.appendChild(criar('span', 'vendas-meta', 'Venda ' + v.id + ' • ' + v.data + ' • Comprador: ' + v.comprador + ' • Quantidade: ' + v.quantidade));

      const linhas = [['Valor da venda', moeda(c.venda)]];
      v.adicionais.forEach(a => linhas.push(['(−) ' + a.tipo, moeda(a.valor)]));
      linhas.push(['Valor recebido', moeda(c.recebido)]);
      linhas.push(['Diferença (recebido − venda)', moeda(c.diferenca)]);
      linhas.push(['Custo do produto', moeda(c.custo)]);
      linhas.push(['Lucro', moeda(c.lucro) + ' (' + porcento(c.margem) + ' da venda)']);

      const tabela = criar('dl', 'caracteristicas vendas-comparacao');
      linhas.forEach(([k, val]) => {
        tabela.appendChild(criar('dt', '', k));
        tabela.appendChild(criar('dd', '', val));
      });
      caixa.appendChild(tabela);

      const resultado = criar('div', c.correto ? 'resultado-ok' : 'erro-produto');
      resultado.setAttribute('role', c.correto ? 'status' : 'alert');
      if (c.correto) {
        resultado.textContent = 'Os valores estão corretos: o valor recebido é igual ao valor da venda. Seu lucro foi de ' + porcento(c.margem) + '.';
      } else {
        const motivos = v.adicionais.map(a => a.tipo.toLowerCase() + ' de ' + moeda(a.valor)).join(' e ');
        resultado.textContent = 'O valor recebido é menor que o valor da venda em ' + moeda(-c.diferenca) +
          ', por custo adicional de ' + motivos + ' na entrega. Seu lucro foi de ' + porcento(c.margem) + '.';
      }
      caixa.appendChild(resultado);

      pagina.appendChild(caixa);
      conteudo.appendChild(pagina);
      window.scrollTo(0, 0);
    }

    document.querySelector('[data-aba="vendas"]').addEventListener('click', () => {
      mostrarExtratoVendas();
      fecharMenu();
    });

    document.querySelector('[data-aba="home"]').addEventListener('click', () => {
      mostrarHome();
      fecharMenu();
    });

    /* ---------- Ao abrir a página ---------- */
    const sessao = guardar.ler(CHAVE_SESSAO);
    if (sessao) entrar(sessao);