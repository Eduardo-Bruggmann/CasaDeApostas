let saldo = 10000;
const resultadoDiv = document.getElementById('resultado');

document.getElementById('saldo').innerText = `R$ ${saldo.toLocaleString('pt-BR')}`;

fetch('times.json')
    .then(response => response.json())
    .then(data => {
        const categoriaSelect = document.getElementById('categoria');
        data.categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.nome;
            option.textContent = categoria.nome;
            categoriaSelect.appendChild(option);
        });

        categoriaSelect.addEventListener('change', () => {
            const categoriaSelecionada = data.categorias.find(cat => cat.nome === categoriaSelect.value);
            const time1Select = document.getElementById('time1');
            const time2Select = document.getElementById('time2');
            const timeApostaSelect = document.getElementById('timeAposta');

            time1Select.innerHTML = '<option value="" disabled selected>Selecione o Time 1</option>';
            time2Select.innerHTML = '<option value="" disabled selected>Selecione o Time 2</option>';
            timeApostaSelect.innerHTML = '<option value="" disabled selected>Selecione o Time da Aposta</option>';

            categoriaSelecionada.times.forEach(time => {
                const option1 = document.createElement('option');
                option1.value = time;
                option1.textContent = time;
                time1Select.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = time;
                option2.textContent = time;
                time2Select.appendChild(option2);
            });

            time1Select.disabled = false;
            time2Select.disabled = false;

            // Habilita o select de apostas após selecionar os times
            time1Select.addEventListener('change', habilitarAposta);
            time2Select.addEventListener('change', habilitarAposta);

            function habilitarAposta() {
                if (time1Select.value && time2Select.value && time1Select.value !== time2Select.value) {
                    const timesDisponiveis = [time1Select.value, time2Select.value];
                    timeApostaSelect.innerHTML = `<option value="" disabled selected>Selecione o Time da Aposta</option>`;
                    timesDisponiveis.forEach(time => {
                        const option = document.createElement('option');
                        option.value = time;
                        option.textContent = time;
                        timeApostaSelect.appendChild(option);
                    });
                    timeApostaSelect.disabled = false;
                } else if (time1Select.value === time2Select.value) {
                    resultadoDiv.innerHTML = 'Os times devem ser diferentes!';
                }
            }
        });
    });

document.getElementById('apostar').addEventListener('click', () => {
    const valorAposta = parseFloat(document.getElementById('valorAposta').value);
    const time1 = document.getElementById('time1').value;
    const time2 = document.getElementById('time2').value;
    const timeAposta = document.getElementById('timeAposta').value;

    resultadoDiv.innerHTML = '';  // Limpar o resultado anterior

    if (!time1 || !time2 || time1 === time2) {
        resultadoDiv.innerHTML = 'Escolha dois times diferentes para jogar!';
        return;
    }

    if (!timeAposta) {
        resultadoDiv.innerHTML = 'Escolha o time em que deseja apostar!';
        return;
    }

    if (isNaN(valorAposta) || valorAposta <= 0) {
        resultadoDiv.innerHTML = 'Informe um valor de aposta válido!';
        return;
    }

    if (valorAposta > saldo) {
        resultadoDiv.innerHTML = 'Saldo insuficiente para realizar essa aposta!';
        return;
    }

    // Gerando placar aleatório para cada time (entre 0 e 3)
    const placarTime1 = Math.floor(Math.random() * 4);
    const placarTime2 = Math.floor(Math.random() * 4);
    const placar = `${placarTime1} x ${placarTime2}`;

    // Verifica empate
    if (placarTime1 === placarTime2) {
        resultadoDiv.innerHTML = `Empate! O placar foi ${placar}. Seu dinheiro foi devolvido.`;
    } else {
        const vencedor = placarTime1 > placarTime2 ? time1 : time2;

        if (vencedor === timeAposta) {
            saldo += valorAposta * 3.5;
            resultadoDiv.innerHTML = `Você ganhou! O vencedor foi ${vencedor} por ${placar}.`;
        } else {
            saldo -= valorAposta;
            resultadoDiv.innerHTML = `Você perdeu! O vencedor foi ${vencedor} por ${placar}.`;
        }
    }

    document.getElementById('saldo').innerText = `R$ ${saldo.toLocaleString('pt-BR')}`;
});