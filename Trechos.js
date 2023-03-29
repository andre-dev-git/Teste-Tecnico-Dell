class Trechos {
    constructor(origem, destino) {
        this.destino = parseInt(destino)
        this.origem = parseInt(origem)
    }
    calcularDistancia(dados) {
        this.percorrido = dados.distancias[this.destino + 1][this.origem]
        return this.percorrido
    }
}