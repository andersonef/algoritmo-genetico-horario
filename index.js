//JavaScript-C24.2.0 (SpiderMonkey)

/**
    Problema: tenho uma semana com capacidade para 25 aulas
    Tenho que distribuir da melhor maneira possível as matérias, de forma que quanto mais juntas elas ficarem, melhor:
    Português: 5 aulas
    Matemática: 5 aulas
    História: 3 aulas
    Geografia: 3 aulas
    Física: 3 aulas
    Química: 3 aulas
    Inglês: 3 aulas
    
    Critérios: 
     - Máximo de 3 aulas seguidas
    

*/
const MATERIAS = {
    portugues: 5,
    matematica: 5,
    historia: 3,
    geografia: 3,
    fisica: 3,
    quimica: 3,
    ingles: 3
};
function Semana() {
    this.dias = []; // vetor de vetores, algo como: [ ['portugues', 'portugues', 'matematica'], ['historia', 'geo', '... ] ];
    this.nota = 0.0;
    this.mutado = false;
}

let populacaoAtual = [];
let maiorNota = 0.0;
let iteracoes = 0;
while (true) {
    populacaoAtual = gerarNovaPopulacao( populacaoAtual,  20 - populacaoAtual.length); //se a populacao atual = 0, vai gerar 50. Se a populacao atual = 25, vai gerar 25...
    console.log('POPULAÇÃO ORIGINAL =>>');
    
    console.log('POPULAÇÃO APÓS CRUZAMENTO');
    cruzarGenes(populacaoAtual);
    
    calcularMutacoes(populacaoAtual, 10); //10% de chances de ocorrer mutação

    verificarNotas(populacaoAtual);
    
    let maiorNotaAtual = calcularMaiorNota(populacaoAtual); //soma as 5 maiores notas e devolve o somatório
    
    if (maiorNotaAtual === maiorNota) {
        break; // iteração sem melhora genética... chegamos ao fim.
    }
    
    if (maiorNotaAtual > maiorNota) {
        maiorNota = maiorNotaAtual;
    }
    
    if (++iteracoes > 200) {
        break; //segurança... o máximo q vai rodar vão ser 200 gerações.
    }
}

function printarPopulacao(populacao) {
    populacao.forEach((individuo, ii) => {
        individuo.dias.forEach((dia, i) => {
            let strDia = dia.reduce((str, materia) => {
                return str += '\t' + materia;
            }, '');
            console.log('IND. ' + ii + ' \t NOTA: ' + individuo.nota + ' \t MUT: ' + individuo.mutado + '  \t DIA ' + i + '. MAT => ' + strDia);
        });
    });
}

/**
 *  Verifica a nota de cada individuo da população com base nos critérios
 *  Todos começam com nota: 1
 *  -> 5 matérias, qtd de cada matéria cuja repetição em sequencia é menor que: MATERIAS[materia]: 0.3 / 0.2
 *  -> 5 dias, algum dia com mais ou menos de 5 matérias: 0.3 / 0.2
 *  -> 5 matérias, alguma cujo o indivíduo não atendeu a quantidade em MATERIAS[materia]? 0.3 / 0.2 
 *  Como são 3 critérios, se em um critério o individuo não atender nada, vai ter 0.2 x 5 (pq kda critério envolve 5 dias ou 5 matérias), 
 *  Logo o critério não atendido faz ele perder 0.3 pontos
 *  -> 3 critérios inteiros não atendidos, irá perder 0.3 * 3 = 0.9, ficando com 0.1 de nota
 * @param Semana[] populacao 
 */
function verificarNotas(populacao) {
    populacao.forEach(individuo => {
        individuo.nota = 1;
        
    });
}

/**
*  Gera uma nova população, populando diretamente o vetor recebido, com novos individuos gerados aleatoriamente até a quantidade desejada
*/
function gerarNovaPopulacao(populacaoOriginal, qtd) {
    const gerarIndividuo = function() {
        const materiasEmbaralhadas = [];
        for(let materia in MATERIAS) {
            for (let x = 0; x < MATERIAS[materia]; x++) {
                materiasEmbaralhadas.push(materia);
            }
        }
        const individuo = new Semana();
        //inicializo o primeiro dia = vetor vazio:
        individuo.dias[0] = [];
        while (individuo.dias.length <= 5){
            let indiceAleatorioMateria = Math.floor(Math.random() * materiasEmbaralhadas.length);
            let materiaAleatoria = materiasEmbaralhadas.splice(indiceAleatorioMateria, 1); 
            //Se o dia iterado tiver menos de 5 matérias, insiro uma nova e já era... 
            //caso contrário crio um novo dia = vetor vazio;
            const indiceDiaAtual = individuo.dias.length-1;
            if (individuo.dias[indiceDiaAtual].length < 5) {
                individuo.dias[indiceDiaAtual].push(materiaAleatoria);
                continue;
            }
            if (!materiaAleatoria) {
                break; //se acabou as matérias, não faço mais nada..
            }
            //se chegou aki é pq o dia atual já tem 5 matérias... novo dia com a materia selecionada lá dentro:
            individuo.dias.push([materiaAleatoria]);
        }
        individuo.dias.pop(); // vamo focar no q eh importante... primeiro faz funcionar, depois melhora. 
        return individuo; //retorna um individuo completamente formado, com genes totalmente aleatórios...
    }
    while (populacaoOriginal.length < qtd) {
        populacaoOriginal.push(gerarIndividuo());
    }
    return populacaoOriginal;
}

function cruzarGenes(populacao) {
    for (let inicio = 0, fim = populacao.length-1; inicio < fim; inicio++, fim--) {
        //pego o primeiro individuo
        //troco o dia 1 3 e 5 dele pelo dia 1, 3 e 5 do último individuo (estrategia bosta... mas estamos apenas aprendendo...)
        const diasDoInicial = [populacao[inicio].dias[0], populacao[inicio].dias[2], populacao[inicio].dias[4]];
        const diasDoFinal = [populacao[fim].dias[0], populacao[fim].dias[2], populacao[fim].dias[4]];
        populacao[inicio].dias[0] = diasDoFinal[0];
        populacao[inicio].dias[2] = diasDoFinal[1];
        populacao[inicio].dias[4] = diasDoFinal[2];
        
        populacao[fim].dias[0] = diasDoInicial[0];
        populacao[fim].dias[2] = diasDoInicial[1];
        populacao[fim].dias[4] = diasDoInicial[2];
    }
    return populacao;
}

function calcularMutacoes(populacao, perc) {

    const materiaCabeNoIndividuo = function(individuo, materia) {
        let cabe = true;
        let qtdMateriasIndividuo = 0;
        individuo.dias.forEach(dia => {
            qtdMateriasIndividuo = dia.reduce((soma, materiaIndividuo) => {
                if (materiaIndividuo == materia) {
                    return soma++;
                }
                return soma;
            }, 0);
        });
        return (qtdMateriasIndividuo <= MATERIAS[materia]);
    }

    populacao.forEach(individuo => {
        if (Math.floor(Math.random() * 100) > 10) {
            return;
        }
        //se chegou aqui é pra fazer a mutação
        //mutação: arranco o dia R o individuo e substituo por um novo dia, com matérias que ainda cabem no indivíduo
        // isso pode causar a morte dele, pois se não couber matérias suficiente no dia, ele vai ficar com um dia com menos de 5 matérias..
        // e ta ok, será morto e substituído por novos indivíduos.
        const diaRandomico = Math.floor(Math.random() * individuo.dias.length);
        individuo.dias.splice(diaRandomico, 1);
        const novoDia = [];
        for (let materia in MATERIAS) {
            if (novoDia.length >= 5) {
                break;
            }
            if (materiaCabeNoIndividuo(individuo, materia)) {
                novoDia.push(materia);
            }
        }
        individuo.mutado = true;
        individuo.dias.push(novoDia);

    });
}

function verificarNotas(populacao) {
    for (let obj of populacao) {
        obj.nota = 5;
    }
}