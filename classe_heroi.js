// Tipos de herói com atributos balanceados
const tiposDeHeroi = {
    mago: { ataque: "magia", poderDeAtaque: 40, vida: 100 },
    guerreiro: { ataque: "espada", poderDeAtaque: 45, vida: 130 }, // Nerfado levemente
    monge: { ataque: "artes marciais", poderDeAtaque: 35, vida: 120 },
    ninja: { ataque: "shuriken", poderDeAtaque: 30, vida: 110 },
    arqueiro: { ataque: "flecha precisa", poderDeAtaque: 38, vida: 105 },
    curandeiro: { ataque: "cura energética", poderDeAtaque: 25, vida: 130 },
    desconhecido: { ataque: "um ataque indefinido", poderDeAtaque: 20, vida: 100 }
};

// Classe principal do herói
class Hero {
    constructor(nome, idade, tipo, poderDeAtaque) {
        this.nome = nome;
        this.idade = idade;
        this.tipo = tipo.toLowerCase();

        // Busca atributos do tipo de herói ou usa 'desconhecido'
        const info = tiposDeHeroi[this.tipo] || tiposDeHeroi.desconhecido;

        // Permite sobrescrever poderDeAtaque se passado no construtor
        this.poderDeAtaque = (poderDeAtaque !== undefined && poderDeAtaque !== null)
            ? poderDeAtaque
            : info.poderDeAtaque;

        this.ataqueDescricao = info.ataque;
        this.vidaMaxima = info.vida;
        this.vidaAtual = this.vidaMaxima;
        this.pocoes = 3; // Cada herói começa com 3 poções
        this.estaDefendendo = false; // Estado de defesa
    }

    // Método de ataque
    atacar(alvo) {
        let dano = this.poderDeAtaque;
        // 20% de chance de ataque crítico
        if (Math.random() < 0.2) {
            dano *= 2;
            console.log("💥 ATAQUE CRÍTICO!");
        }

        // Curandeiro se cura ao atacar
        if (this.tipo === "curandeiro") {
            this.vidaAtual += 10;
            if (this.vidaAtual > this.vidaMaxima) this.vidaAtual = this.vidaMaxima;
            console.log(`🌿 ${this.nome} absorveu energia e se curou 10 de vida!`);
        }

        console.log(`\n🔴 ${this.nome} (${this.tipo}) atacou usando ${this.ataqueDescricao}!`);
        const resultado = alvo.receberDano(dano);
        console.log(resultado);
    }

    // Recebe dano, considerando defesa
    receberDano(dano) {
        let danoFinal = this.estaDefendendo ? Math.round(dano / 2) : dano;
        this.vidaAtual -= danoFinal;
        if (this.vidaAtual < 0) this.vidaAtual = 0;

        const msg = this.estaDefendendo
            ? `🛡️ ${this.nome} defendeu e reduziu o dano para ${danoFinal}.`
            : `💥 ${this.nome} recebeu ${danoFinal} de dano.`;

        this.estaDefendendo = false; // Defesa só vale para um ataque
        return `${msg} Vida atual: ${this.vidaAtual}/${this.vidaMaxima}.`;
    }

    // Prepara defesa para o próximo ataque
    defender() {
        this.estaDefendendo = true;
        console.log(`🧱 ${this.nome} se preparou para defender o próximo ataque.`);
    }

    // Usa poção para recuperar vida
    usarPocao() {
        if (this.pocoes <= 0) {
            console.log(`⚠️ ${this.nome} não tem mais poções!`);
            return;
        }
        if (this.vidaAtual === this.vidaMaxima) {
            console.log(`🧬 ${this.nome} já está com a vida cheia.`);
            return;
        }

        const cura = 25;
        this.vidaAtual += cura;
        if (this.vidaAtual > this.vidaMaxima) this.vidaAtual = this.vidaMaxima;

        this.pocoes--;
        console.log(`🧪 ${this.nome} usou uma poção! Recuperou ${cura} de vida. Vida atual: ${this.vidaAtual}/${this.vidaMaxima}. Poções restantes: ${this.pocoes}.`);
    }

    // Mostra status do herói
    status() {
        return `❤️ ${this.nome} (${this.tipo}) - Vida: ${this.vidaAtual}/${this.vidaMaxima} | 🧪 Poções: ${this.pocoes}`;
    }

    // Verifica se está vivo
    estaVivo() {
        return this.vidaAtual > 0;
    }

    // Restaura vida e poções (usado no início de batalhas)
    restaurarVida() {
        this.vidaAtual = this.vidaMaxima;
        this.pocoes = 3;
        this.estaDefendendo = false;
    }
}

// Sorteia uma ação aleatória para o herói
function escolherAcaoAleatoria() {
    const acoes = ["atacar", "defender", "usarPocao"];
    return acoes[Math.floor(Math.random() * acoes.length)];
}

// Simula uma batalha entre dois heróis
function batalhar(heroi1, heroi2) {
    let turno = 1;
    console.log(`\n⚔️ BATALHA: ${heroi1.nome.toUpperCase()} VS ${heroi2.nome.toUpperCase()}`);

    // Restaura vida e poções antes da luta
    heroi1.restaurarVida();
    heroi2.restaurarVida();

    // Loop até um dos heróis morrer
    while (heroi1.estaVivo() && heroi2.estaVivo()) {
        // Sorteia quem ataca e quem defende
        const [atacante, defensor] = Math.random() < 0.5 ? [heroi1, heroi2] : [heroi2, heroi1];
        const acao = escolherAcaoAleatoria();

        // Executa ação sorteada
        switch (acao) {
            case "atacar": atacante.atacar(defensor); break;
            case "defender": atacante.defender(); break;
            case "usarPocao": atacante.usarPocao(); break;
        }

        turno++;
    }

    // Exibe vencedor
    const vencedor = heroi1.estaVivo() ? heroi1 : heroi2;
    console.log(`🏆 Vencedor: ${vencedor.nome}\n`);
    return vencedor;
}

// Embaralha array de heróis (Fisher-Yates)
function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Organiza torneio eliminatório entre heróis
function torneio(herois) {
    let rodada = 1;
    embaralhar(herois);

    while (herois.length > 1) {
        console.log(`\n🔁 RODADA ${rodada} - ${herois.length} heróis restantes`);
        const proximos = [];

        for (let i = 0; i < herois.length; i += 2) {
            if (i + 1 >= herois.length) {
                // Avança automaticamente se número ímpar de heróis
                console.log(`👑 ${herois[i].nome} avança automaticamente para a próxima fase!`);
                proximos.push(herois[i]);
            } else {
                // Batalha entre pares
                const vencedor = batalhar(herois[i], herois[i + 1]);
                proximos.push(vencedor);
            }
        }

        herois = proximos;
        rodada++;
    }

    // Exibe campeão do torneio
    console.log(`\n🎉 CAMPEÃO DO TORNEIO: ${herois[0].nome.toUpperCase()} 🎉`);
}

// Criação dos heróis participantes
const herois = [
    new Hero("Arnaldo", 30, "mago"),
    new Hero("Ryu", 25, "ninja"),
    new Hero("Gandalf", 300, "mago"),
    new Hero("Conan", 35, "guerreiro"),
    new Hero("Legolas", 200, "arqueiro"),
    new Hero("Elrond", 5000, "curandeiro"),
    new Hero("Shaolin", 45, "monge"),
    new Hero("Naruto", 17, "ninja")
];

// Inicia o torneio
torneio(herois);