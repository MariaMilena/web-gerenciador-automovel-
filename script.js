document.addEventListener('DOMContentLoaded', () => {
    const veiculosTable = document.getElementById('veiculosTable').getElementsByTagName('tbody')[0];

    // Função para carregar os veículos
    async function carregarVeiculos() {
        try {
            const response = await fetch('http://localhost:8080/api/veiculo');
            const veiculos = await response.json();
            console.log('Dados carregados:', veiculos);
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
        alert(`Detalhes do Veículo:\n\nID: ${veiculo.id}\nModelo: ${veiculo.modelo}\nFabricante: ${veiculo.fabricante}\nAno: ${veiculo.ano}\nPreço: R$ ${veiculo.preco.toFixed(2)}`);
    }

    // Função para excluir um veículo
    async function excluirVeiculo(id) {
        try {
            await fetch(`http://localhost:8080/api/veiculo/${id}`, {
                method: 'DELETE'
            });
            carregarVeiculos(); // Recarrega a lista após excluir
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
        }
    }

    // Carregar os veículos ao carregar a página
    carregarVeiculos();
});