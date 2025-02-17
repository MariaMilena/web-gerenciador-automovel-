document.addEventListener('DOMContentLoaded', () => {
    const veiculoForm = document.getElementById('veiculoForm');
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get('tipo'); // Tipo de veículo (carro ou moto)
    const veiculoId = params.get('id'); // ID do veículo (se estiver editando)

    // Mostrar campos específicos conforme o tipo de veículo
    if (tipo === 'carro') {
        document.getElementById('carroFields').style.display = 'block';
    } else if (tipo === 'moto') {
        document.getElementById('motoFields').style.display = 'block';
    }

    // Se houver um ID, carregar os dados do veículo para edição
    if (veiculoId) {
        carregarDadosVeiculo(veiculoId);
    }

    // Função para carregar os dados do veículo
    async function carregarDadosVeiculo(id) {
        try {
            const response = await fetch(`http://localhost:8080/api/veiculo/${id}`);
            if (!response.ok) {
                throw new Error('Veículo não encontrado');
            }
            const veiculo = await response.json();

            // Preencher os campos comuns
            document.getElementById('modelo').value = veiculo.modelo;
            document.getElementById('fabricante').value = veiculo.fabricante;
            document.getElementById('ano').value = veiculo.ano;
            document.getElementById('preco').value = veiculo.preco;

            // Preencher campos específicos para carros
            if (veiculo.tipo === 'carro') {
                document.getElementById('quantidade_portas').value = veiculo.quantidadePortas;
                document.getElementById('tipo_combustivel').value = veiculo.tipoCombustivel;
            }

            // Preencher campos específicos para motos
            if (veiculo.tipo === 'moto') {
                document.getElementById('cilindrada').value = veiculo.cilindrada;
            }

            // Alterar o texto do botão para "Atualizar"
            const submitBtn = veiculoForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Atualizar';
        } catch (error) {
            console.error('Erro ao carregar veículo:', error);
            alert('Erro ao carregar veículo. Verifique o console para mais detalhes.');
        }
    }

    // Função para salvar ou atualizar um veículo
    veiculoForm.onsubmit = async (e) => {
        e.preventDefault();

        // Coletar os dados do formulário
        const veiculo = {
            tipo: tipo,
            modelo: document.getElementById('modelo').value,
            fabricante: document.getElementById('fabricante').value,
            ano: parseInt(document.getElementById('ano').value),
            preco: parseFloat(document.getElementById('preco').value),
        };

        // Adicionar campos específicos para carros
        if (tipo === 'carro') {
            veiculo.quantidadePortas = parseInt(document.getElementById('quantidade_portas').value);
            veiculo.tipoCombustivel = document.getElementById('tipo_combustivel').value;
        }

        // Adicionar campos específicos para motos
        if (tipo === 'moto') {
            veiculo.cilindrada = parseInt(document.getElementById('cilindrada').value);
        }

        try {
            let response;
            if (veiculoId) {
                // Se houver um ID, é uma atualização (PUT)
                response = await fetch(`http://localhost:8080/api/veiculo/${veiculoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(veiculo)
                });
            } else {
                // Caso contrário, é uma criação (POST)
                response = await fetch('http://localhost:8080/api/veiculo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(veiculo)
                });
            }

            if (response.ok) {
                alert(veiculoId ? 'Veículo atualizado com sucesso!' : 'Veículo criado com sucesso!');
                window.location.href = 'index.html'; // Redirecionar para a tela principal
            } else {
                const errorData = await response.json();
                alert(`Erro: ${errorData.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao salvar veículo:', error);
            alert('Erro ao salvar veículo. Verifique o console para mais detalhes.');
        }
    };
});