class Dados {
    constructor() {
        this.viagensTotais = []
    }
    gerarRelatorio() {
        let html = '<button onclick="fecharRelatorio()">Fechar Relatório</button>'
        if(this.viagensTotais.length == 0){
            alert("Insira ao menos uma viagem para acessar o relatório")
            return false
        }
        this.viagensTotais.forEach((viagem, index) => {
            const dadosRelatorio = this.calcularDadosViagem(index)
            html += "<h2>" + (index + 1) + " - "
            for (let i = 0; i < dadosRelatorio.dadosTrecho.length; i++) {
                html += this.cidadesIndex[dadosRelatorio.dadosTrecho[i].origem] + " - "
            }
            html += this.cidadesIndex[dadosRelatorio.dadosTrecho[(dadosRelatorio.dadosTrecho.length - 1)].destino] + "<h2>"
            html += "<p>Custo Total: " + parseFloat(dadosRelatorio.custoTotal).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "<br>"
            html += "Custo Médio por Trecho: " + dadosRelatorio.custoMedioTrecho.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "<br>"
            html += "Custo Médio por KM: " + dadosRelatorio.custoKM.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "<br>"
            dadosRelatorio.dadosProduto.forEach(produto => {
                html += "Valor Unitário - " + produto.nome + ": " + produto.valorMedio.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "<br>"
                html += "Valor Total - "+ produto.nome + ": "+ (parseFloat(produto.valorMedio) * produto.quantidade).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "<br>"
                html += "Quantidade - "+produto.nome+": "+produto.quantidade+"<br>"
            })
            dadosRelatorio.dadosTrecho.forEach(trecho => {
                html += "Valor do Trecho " + this.cidadesIndex[trecho.origem] + " - " + this.cidadesIndex[trecho.destino] + ": " + trecho.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "<br>"
            })
            html += "Quantidade de caminhões de PEQUENO PORTE: " + dadosRelatorio.trucks.pequeno + "<br>"
            html += "Custo com caminhões de PEQUENO PORTE: " + (parseFloat(dadosRelatorio.custoPorModadelidade.pequeno) * parseInt(dadosRelatorio.trucks.pequeno) ).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + " <br> "
            html += "Quantidade de caminhões de MÉDIO PORTE: " + dadosRelatorio.trucks.medio + "<br>"
            html += "Custo com caminhões de MÉDIO PORTE: " + (parseFloat(dadosRelatorio.custoPorModadelidade.medio) * parseInt(dadosRelatorio.trucks.medio) ).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + " <br> "
            html += "Quantidade de caminhões de GRANDE PORTE: " + dadosRelatorio.trucks.grande + "<br>"
            html += "Custo com caminhões de GRANDE PORTE: " + (parseFloat(dadosRelatorio.custoPorModadelidade.grande) * parseInt(dadosRelatorio.trucks.grande) ).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + " <br> "
            html += "Total de caminhões deslocados: " + dadosRelatorio.numTrucks + "<br>"
            html += "Peso Total: " + dadosRelatorio.pesoTotal.toFixed(2) + " toneladas <br>"
            html += "Total de itens transportados: " + dadosRelatorio.quantidadeProdutos + "</p>"

            const relatorio = document.getElementById("relatorio")
            relatorio.innerHTML = html
            relatorio.style.left = "0vw"
        });
    }
    async puxarDadosCSV() {
        await fetch('./DNIT-Distancias.csv')
            .then(response => response.text())
            .then(text => {
                this.distancias = text.split("\n")
                this.cidadesIndex = this.distancias[0].split(";")
                this.distancias.forEach((element, index) => {
                    this.distancias[index] = element.split(";")
                })
            })
    }
    calcularDadosViagem(index) {
        const viagem = this.viagensTotais[index]
        const dados = {}
        dados.custoTotal = viagem.calcularValor()
        dados.custoMedioTrecho = (parseFloat(dados.custoTotal) / parseInt(viagem.trechos.length))
        dados.custoKM = dados.custoTotal / viagem.distanciaTotal
        dados.dadosProduto = []
        dados.quantidadeProdutos = 0
        viagem.produtos.forEach(produto => {
            const dadosProduto = {}
            dadosProduto.nome = produto.nome
            dadosProduto.quantidade = produto.quantidade
            dadosProduto.peso = produto.peso
            dadosProduto.valorMedio = (dados.custoTotal / viagem.pesoTotal) * dadosProduto.peso
            dados.quantidadeProdutos += parseInt(dadosProduto.quantidade)
            dados.dadosProduto.push(dadosProduto)
        })
        dados.dadosTrecho = []
        viagem.trechos.forEach(trecho => {
            const dadosTrecho = {}
            dadosTrecho.valor = dados.custoKM * trecho.percorrido
            dadosTrecho.origem = trecho.origem
            dadosTrecho.destino = trecho.destino
            dados.dadosTrecho.push(dadosTrecho)
        })
        dados.trucks = viagem.trucks
        dados.custoPorModadelidade = {
            "pequeno": (parseInt(viagem.trucks.pequeno) * 4.87),
            "medio": (parseInt(viagem.trucks.medio) * 11.92),
            "grande": (parseInt(viagem.trucks.grande) * 27.44)
        }
        dados.numTrucks = parseInt(dados.trucks.pequeno) + parseInt(dados.trucks.medio) + parseInt(dados.trucks.grande)
        dados.pesoTotal = viagem.pesoTotal
        return dados
    }
}