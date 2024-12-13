// Função para formatar a data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Função para formatar o odômetro
function formatarOdometro(valor) {
    return valor ? `${valor} km` : '';
}

// Função para salvar no armazenamento local
function salvarDados() {
    localStorage.setItem('dadosVeiculos', JSON.stringify(veiculos));
}

// Função para carregar do armazenamento local
function carregarDados() {
    const dados = localStorage.getItem('dadosVeiculos');
    if (dados) {
        veiculos = JSON.parse(dados);
        atualizarTabela();
    }
}

// Função para verificar status dos acessórios
function verificarAcessorios() {
    return {
        triangulo: document.getElementById('trianguloOk').checked,
        macaco: document.getElementById('macacoOk').checked,
        chaveRodas: document.getElementById('chaveRodasOk').checked,
        estepe: document.getElementById('estepeOk').checked
    };
}

// Função para verificar status do kit desatolagem
function verificarKitDesatolagem() {
    return {
        macacoHi: document.getElementById('macacoHiOk').checked,
        pranchas: document.getElementById('pranchasOk').checked,
        bolsaDesat: document.getElementById('bolsaDesatOk').checked
    };
}

// Função para verificar missão
function verificarMissao() {
    const missaoSim = document.querySelector('input[name="missao"]:checked');
    return missaoSim ? missaoSim.value : null;
}

// Função para atualizar a tabela
function atualizarTabela() {
    const corpoTabela = document.querySelector('#tabelaVeiculos tbody');
    corpoTabela.innerHTML = ''; // Limpa a tabela antes de atualizar

    veiculos.forEach((veiculo, indice) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${veiculo.placa}</td>
            <td>${veiculo.id}</td>
            <td>${veiculo.tipo}</td>
            <td>${formatarData(veiculo.recebimento)}</td>
            <td>${veiculo.documentoOk ? 'OK' : 'Pendente'}</td>
            <td>${Object.values(veiculo.acessorios).filter(v => v).length}/4</td>
            <td>${Object.values(veiculo.kitDesatolagem).filter(v => v).length}/3</td>
            <td>${veiculo.missao}</td>
            <td>${veiculo.localizacao}/${veiculo.estado}</td>
            <td>${veiculo.observacoes}</td>
            <td>${formatarOdometro(veiculo.odometro)}</td>
            <td>
                <button onclick="editarVeiculo(${indice})" class="botao-acao">Editar</button>
                <button onclick="excluirVeiculo(${indice})" class="botao-acao botao-excluir">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

// Função para editar veículo
function editarVeiculo(indice) {
    indiceEditando = indice;
    const veiculo = veiculos[indice];

    document.getElementById('placa').value = veiculo.placa;
    document.getElementById('id').value = veiculo.id;
    document.getElementById('tipo').value = veiculo.tipo;
    document.getElementById('recebimento').value = veiculo.recebimento;
    document.getElementById('documentoOk').checked = veiculo.documentoOk;
    document.getElementById('trianguloOk').checked = veiculo.acessorios.triangulo;
    document.getElementById('macacoOk').checked = veiculo.acessorios.macaco;
    document.getElementById('chaveRodasOk').checked = veiculo.acessorios.chaveRodas;
    document.getElementById('estepeOk').checked = veiculo.acessorios.estepe;
    document.getElementById('macacoHiOk').checked = veiculo.kitDesatolagem.macacoHi;
    document.getElementById('pranchasOk').checked = veiculo.kitDesatolagem.pranchas;
    document.getElementById('bolsaDesatOk').checked = veiculo.kitDesatolagem.bolsaDesat;
    document.getElementById('observacoes').value = veiculo.observacoes;
    document.getElementById('odometro').value = veiculo.odometro;
    document.getElementById('localiza').value = veiculo.localizacao;
    document.getElementById('estado').value = veiculo.estado;

    const missao = veiculo.missao;
    if (missao) {
        document.querySelector(`input[name="missao"][value="${missao}"]`).checked = true;
    }
}

// Função para excluir veículo
function excluirVeiculo(indice) {
    const veiculo = veiculos[indice];
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        veiculos.splice(indice, 1);
        salvarDados();
        atualizarTabela();
        alert(`Veículo ${veiculo.placa} excluído`);
    }
}

// Função de cadastro e edição
let veiculos = [];
let indiceEditando = -1;

// Evento de envio do formulário
document.getElementById('formularioVeiculo').addEventListener('submit', function(e) {
    e.preventDefault();

    const veiculo = {
        placa: document.getElementById('placa').value,
        id: document.getElementById('id').value,
        tipo: document.getElementById('tipo').value,
        recebimento: document.getElementById('recebimento').value,
        documentoOk: document.getElementById('documentoOk').checked,
        acessorios: verificarAcessorios(),
        kitDesatolagem: verificarKitDesatolagem(),
        observacoes: document.getElementById('observacoes').value,
        odometro: document.getElementById('odometro').value,
        localizacao: document.getElementById('localiza').value,
        estado: document.getElementById('estado').value,
        missao: verificarMissao()
    };

    if (indiceEditando === -1) {
        veiculos.push(veiculo); // Adiciona novo veículo
        alert(`Veículo ${veiculo.placa} cadastrado`);
    } else {
        veiculos[indiceEditando] = veiculo; // Atualiza veículo existente
        indiceEditando = -1; // Reseta o índice de edição
        alert(`Veículo ${veiculo.placa} editado`);
    }

    salvarDados();
    atualizarTabela();
    this.reset(); // Limpa o formulário
});

// Carregar dados ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
});
