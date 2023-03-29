let dados;
    let produtosTemp = []
    let trechosTemp = []
    async function iniciar() {
        dados = new Dados()
        await dados.puxarDadosCSV()
        gerarSelectsPrevia(dados)
        gerarSelectTrecho(dados)
    }
    function fecharPrograma() {
        const relatorio = document.getElementById("relatorio")
        relatorio.innerHTML = "<h1>Feito com muito carinho! <br> Obrigado pela atenção!<h1><p>André Carvalho Bonifácio - Eng. de Software - PUCRS</p><p id='regressiva'>10</p>"
        relatorio.style.left = "0vw"
        contagem = 10
        setInterval(() => {
            if (contagem <= 0) {
                window.location.reload(true)
            }
            document.getElementById("regressiva").innerText = contagem
            contagem--
        }, 1000);
    }
    function resetarViagem() {
        const div = document.getElementById("cadastro-translate")
        div.style.transform = "translate(0px)"
        const selects = document.querySelectorAll(".cidades-trechos")
        selects.forEach((select, index) => {
            if (index != 0) {
                select.remove()
            } else {
                select.value = ""
            }
        })
    }
    function adicionaProduto() {
        const nome = document.getElementById("cadastro-produto-nome")
        const qtd = document.getElementById("cadastro-produto-qtd")
        const peso = document.getElementById("cadastro-produto-peso")
        if (nome.value == "" || qtd.value == "" || peso.value == "") {
            alert("Preencha todos os campos!")
            return false
        }
        const produto = {
            "nome": nome.value,
            "quantidade": qtd.value,
            "peso": peso.value
        }
        produto.peso = (produto.peso / 1000)
        produtosTemp.push(produto)
        nome.value = ""
        qtd.value = ""
        peso.value = ""
    }
    function gerarSelectTrecho(dados) {
        const selects = document.querySelectorAll(".cidades-trechos")
        selects.forEach(select => {
            dados.cidadesIndex.forEach((cidade, index) => {
                const option = document.createElement("option")
                option.value = index
                option.innerText = cidade
                select.append(option)
            })
        })
    }
    function montarViagem() {
        if (produtosTemp.length == 0) {
            alert("Adicione ao menos 1 produto!")
            return false
        }
        let trechos = []
        for (let i = 0; i < (trechosTemp.length - 1); i++) {
            const novoTrecho = new Trechos(trechosTemp[i].value, trechosTemp[i + 1].value)
            trechos.push(novoTrecho)
        }
        trechos.forEach(trecho => {
            trecho.calcularDistancia(dados)
        })
        const viagem = new Viagem(trechos, produtosTemp)
        trechosTemp = []
        produtosTemp = []
        viagem.calcularPeso()
        viagem.calcularTransporte(viagem.pesoTotal)
        viagem.calcularValor()
        viagem.confirmarViagem(dados)
        let msg = ""
        trechos.forEach(trecho => {
            msg += "de " + dados.cidadesIndex[trecho.origem] + " para " + dados.cidadesIndex[trecho.destino] + ", "
        })
        msg += "a distância será de " + viagem.distanciaTotal + "KM, para o transporte de "
        let qtdItens = 0
        viagem.produtos.forEach(produto => {
            msg += produto.quantidade + " " + produto.nome + "(s), "
            qtdItens += parseInt(produto.quantidade)
        })
        msg += "será necessário " + viagem.trucks.pequeno + " caminhão(s) de PEQUENO PORTE, " + viagem.trucks.medio + " caminhão(s) de MÉDIO PORTE, " + viagem.trucks.grande + " caminhão(s) de GRANDE PORTE, "
        msg += "de forma a resultar no menor custo de transporte por km rodado. O valor total do transporte dos itens é " + parseFloat(viagem.valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        msg += ", sendo " + (viagem.valor / qtdItens).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + " o custo unitário médio"
        msg = msg[0].toUpperCase() + msg.substr(1)
        const div = document.getElementById("cadastro-translate")
        div.style.transform = "translate(-800px, 0px)"
        const resultadoDiv = document.getElementById("texto-sucesso")
        resultadoDiv.innerText = msg
    }
    function verificarTrechos() {
        let trechos = document.querySelectorAll(".cidades-trechos")
        let aux = trechos[0].value
        let valido = true
        if (trechos.length > 1) {
            trechos.forEach((trecho, index) => {
                if (trecho.value == "") {
                    alert("Preencha todos os campos")
                    valido = false
                }
                if (index > 0) {
                    if (aux == trecho.value) {
                        alert("Duas cidades seguidas repetidas!")
                        valido = false
                    }
                }
                aux = trecho.value
            })
            if (valido) {
                trechosTemp = [...trechos]
                iniciarCadastroProdutos()
            }
        } else {
            alert("Selecione ao menos duas cidades!")
            return false
        }
    }
    function iniciarCadastroProdutos() {
        const div = document.getElementById("cadastro-translate")
        div.style.transform = "translate(-400px, 0px)"
    }
    function adicionarInput(plus) {
        const select = document.createElement("select")
        select.classList.add("cidades-trechos")
        const div = document.getElementById("form-trechos")
        div.insertBefore(select, plus)
        gerarSelectTrecho(dados)
    }
    function gerarSelectsPrevia(dados) {
        const select1 = document.getElementById("cidades-previa-1")
        const select2 = document.getElementById("cidades-previa-2")
        dados.cidadesIndex.forEach((cidade, index) => {
            const option = document.createElement("option")
            option.value = index
            option.innerText = cidade
            select1.append(option)
        })
        dados.cidadesIndex.forEach((cidade, index) => {
            const option = document.createElement("option")
            option.value = index
            option.innerText = cidade
            select2.append(option)
        })
    }

    function simularTrecho() {
        const origem = document.getElementById("cidades-previa-1").value
        const destino = document.getElementById("cidades-previa-2").value
        const truck = document.getElementById("trucks-previa").value
        if (origem == "" || destino == "" || truck == "") {
            alert("Lembre-se de preencher os 3 campos!")
            return false
        }
        if(origem == destino){
            alert("Selecione duas cidades diferentes")
            return false
        }
        let preco
        switch (truck) {
            case "PEQUENO":
                preco = 4.87
                break;
            case "MÉDIO":
                preco = 11.92
                break;
            case "GRANDE":
                preco = 27.44
                break;
        }
        const trecho = new Trechos(origem, destino)
        const valor = parseInt(trecho.calcularDistancia(dados)) * preco
        const msg = "De " + dados.cidadesIndex[origem] + " para " + dados.cidadesIndex[destino] + ", utilizando " +
            "um caminhão de " + truck + " PORTE, a distância é de " + trecho.calcularDistancia(dados) + "km e o " +
            "custo será de " + valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }); + "R$"
        document.getElementById("previa").innerText = msg
        const translateContainer = document.getElementById("previa-translate")
        translateContainer.style.transform = "translate(-50%, 0px)"
    }
    function fecharRelatorio() {
        const relatorio = document.getElementById("relatorio")
        relatorio.style.left = "-100vw"
    }


