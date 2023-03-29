class Viagem {
    constructor(trechos, produtos) {
        this.trechos = trechos
        this.produtos = produtos
        this.distanciaTotal = 0
        this.pesoTotal = 0
        trechos.forEach(trecho => {
            this.distanciaTotal += parseInt(trecho.percorrido)
        })
    }
    calcularPeso() {
        const produtos = [...this.produtos]
        produtos.forEach(produto => {
            this.pesoTotal += (parseFloat(produto.peso) * parseFloat(produto.quantidade))
        })
        return this.pesoTotal
    }
    calcularTransporte(pesoTotal) {
        let peso = Math.ceil(pesoTotal)
        const truck = {
            "pequeno": 0,
            "medio": 0,
            "grande": 0
        }
        while (peso > 0) {
            if (peso == 16) {
                truck.medio += 4
                break
            }
            if (peso == 12) {
                truck.medio += 3
                break
            }
            if (peso <= 8 && peso >= 3) {
                truck.medio++
                peso += -4
                continue
            }
            if (peso == 1 || peso == 2) {
                truck.pequeno += peso
                break
            }
            peso += -10
            truck.grande++
        }
        this.trucks = truck
        return this.trucks
    }
    calcularValor() {
        this.valor = 0
        this.valor += (parseInt(this.trucks.pequeno) * 4.87)
        this.valor += (parseInt(this.trucks.medio) * 11.92)
        this.valor += (parseInt(this.trucks.grande) * 27.44)
        this.valor = this.valor * parseInt(this.distanciaTotal)
        this.valor = this.valor.toFixed(2)
        return this.valor
    }
    confirmarViagem(dados) {
        dados.viagensTotais.push(this)
    }
}