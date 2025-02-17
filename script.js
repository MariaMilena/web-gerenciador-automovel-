document.addEventListener('DOMContentLoaded', () => {
    const criarVeiculoBtn = document.getElementById('criarVeiculoBtn');
    const modal = document.getElementById('modalTipoVeiculo');
    const closeBtn = document.querySelector('.close');
    const selecionarCarroBtn = document.getElementById('selecionarCarro');
    const selecionarMotoBtn = document.getElementById('selecionarMoto');

    // Abrir o modal ao clicar em "Criar Veículo"
    criarVeiculoBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Fechar o modal ao clicar no "X"
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar o modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Redirecionar para a tela de cadastro de carro
    selecionarCarroBtn.addEventListener('click', () => {
        window.location.href = 'cadastro.html?tipo=carro';
    });

    // Redirecionar para a tela de cadastro de moto
    selecionarMotoBtn.addEventListener('click', () => {
        window.location.href = 'cadastro.html?tipo=moto';
    });

    // Função para carregar os veículos (mantida da versão anterior)
    async function carregarVeiculos() {
        try {
            const response = await fetch('http://localhost:8080/api/veiculo');
            const veiculos = await response.json();
            console.log('Dados carregados:', veiculos);
            const veiculosTable = document.getElementById('veiculosTable').getElementsByTagName('tbody')[0];
            veiculosTable.innerHTML = '';

            veiculos.forEach(veiculo => {
                const row = veiculosTable.insertRow();
                row.insertCell().textContent = veiculo.modelo;
                row.insertCell().textContent = veiculo.fabricante;
                row.insertCell().textContent = veiculo.ano;
                row.insertCell().textContent = `R$ ${veiculo.preco.toFixed(2)}`;

                // Célula de ações
                const acoesCell = row.insertCell();

                // Botão de Editar
                const editarBtn = document.createElement('button');
                editarBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
                editarBtn.className = 'editar';
                editarBtn.onclick = () => editarVeiculo(veiculo);
                acoesCell.appendChild(editarBtn);

                // Botão de Detalhes
                const detalhesBtn = document.createElement('button');
                detalhesBtn.innerHTML = '<i class="fas fa-info-circle"></i> Detalhes';
                detalhesBtn.className = 'detalhes';
                detalhesBtn.onclick = () => verDetalhes(veiculo);
                acoesCell.appendChild(detalhesBtn);

                // Botão de Excluir
                const excluirBtn = document.createElement('button');
                excluirBtn.innerHTML = '<i class="fas fa-trash"></i> Excluir';
                excluirBtn.className = 'excluir';
                excluirBtn.onclick = () => excluirVeiculo(veiculo.id);
                acoesCell.appendChild(excluirBtn);
            });
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
        }
    }

    // Função para editar um veículo
    function editarVeiculo(veiculo) {
        window.location.href = `cadastro.html?id=${veiculo.id}`; // Redireciona para a tela de cadastro com o ID
    }

    // Função para ver detalhes de um veículo
    function verDetalhes(veiculo) {
        alert(`Detalhes do Veículo:\n\nModelo: ${veiculo.modelo}\nFabricante: ${veiculo.fabricante}\nAno: ${veiculo.ano}\nPreço: R$ ${veiculo.preco.toFixed(2)}`);
    }

    // Função para excluir um veículo
    async function excluirVeiculo(id) {
        try {
            const response = await fetch(`http://localhost:8080/api/veiculo/${id}`, {
                method: 'DELETE'
            });
    
            if (response.ok) {
                alert('Veículo excluído com sucesso!');
                carregarVeiculos(); // Recarrega a lista após excluir
            } else {
                const errorData = await response.json();
                alert(`Erro ao excluir veículo: ${errorData.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
            alert('Erro ao excluir veículo. Verifique o console para mais detalhes.');
        }
    }
    // Carregar os veículos ao carregar a página
    carregarVeiculos();
});