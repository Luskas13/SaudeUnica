
// ========================================
// ELEMENTOS DO HTML
// ========================================

const paginas = document.querySelectorAll(".pagina");

const cartilha = document.getElementById("cartilha");

const paginaAtual = document.getElementById("pagina-atual");

const totalPaginas = document.getElementById("total-paginas");

const barraProgresso = document.getElementById("barra-progresso");

const btnDiminuirZoom = document.getElementById("diminuir-zoom");

const btnAumentarZoom = document.getElementById("aumentar-zoom");

const btnResetarZoom = document.getElementById("resetar-zoom");

const btnTelaCheia = document.getElementById("tela-cheia");

const btnVoltarTopo = document.getElementById("voltar-topo");


// ========================================
// CONFIGURAÇÕES
// ========================================

let zoom = 100;

const zoomMinimo = 75;

const zoomMaximo = 200;

const passoZoom = 25;

totalPaginas.textContent = paginas.length;


// ========================================
// IDENTIFICAR A PÁGINA ATUAL
// ========================================

function atualizarPaginaAtual() {

    const centroTela = window.innerHeight / 2;

    let menorDistancia = Infinity;

    let paginaVisivel = 1;

    paginas.forEach((pagina, indice) => {

        const posicao = pagina.getBoundingClientRect();

        const centroPagina =
            posicao.top + posicao.height / 2;

        const distancia = Math.abs(
            centroPagina - centroTela
        );

        if (distancia < menorDistancia) {

            menorDistancia = distancia;

            paginaVisivel = indice + 1;

        }

    });

    paginaAtual.textContent =
        String(paginaVisivel).padStart(2, "0");

}


// ========================================
// BARRA DE PROGRESSO DA LEITURA
// ========================================

function atualizarProgresso() {

    const scrollAtual = window.scrollY;

    const alturaTotal =
        document.documentElement.scrollHeight
        - window.innerHeight;

    const porcentagem = alturaTotal > 0
        ? (scrollAtual / alturaTotal) * 100
        : 0;

    barraProgresso.style.width =
        `${Math.max(0, Math.min(100, porcentagem))}%`;

}


// ========================================
// BOTÃO VOLTAR AO TOPO
// ========================================

function atualizarBotaoTopo() {

    btnVoltarTopo.classList.toggle(
        "visivel",
        window.scrollY > 500
    );

}

btnVoltarTopo.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches ? "instant" : "smooth"
    });

});


// ========================================
// ATUALIZAÇÃO DURANTE A ROLAGEM
// ========================================

function atualizarLeitura() {

    atualizarPaginaAtual();

    atualizarProgresso();

    atualizarBotaoTopo();

}

let atualizacaoPendente = false;

function solicitarAtualizacao() {

    if (atualizacaoPendente) {
        return;
    }

    atualizacaoPendente = true;

    requestAnimationFrame(() => {

        atualizarLeitura();

        atualizacaoPendente = false;

    });

}

window.addEventListener(
    "scroll",
    solicitarAtualizacao,
    { passive: true }
);

window.addEventListener(
    "resize",
    solicitarAtualizacao
);


// ========================================
// CONTROLE DE ZOOM
// ========================================

function atualizarZoom() {

    // Identifica a página que está sendo lida.

    const indiceAtual =
        Number(paginaAtual.textContent) - 1;

    const paginaReferencia = paginas[indiceAtual];

    const posicaoAnterior =
        paginaReferencia.getBoundingClientRect();

    const proporcao =
        (window.innerHeight / 2 - posicaoAnterior.top)
        / Math.max(1, posicaoAnterior.height);

    // Aplica o novo zoom.

    cartilha.style.setProperty(
        "--zoom",
        zoom / 100
    );

    btnResetarZoom.textContent = `${zoom}%`;

    btnDiminuirZoom.disabled = zoom <= zoomMinimo;

    btnAumentarZoom.disabled = zoom >= zoomMaximo;

    // Mantém aproximadamente o mesmo ponto da leitura.

    const novaPosicao =
        paginaReferencia.getBoundingClientRect();

    const novoScroll =
        window.scrollY
        + novaPosicao.top
        + novaPosicao.height * proporcao
        - window.innerHeight / 2;

    window.scrollTo({
        top: Math.max(0, novoScroll),
        behavior: "instant"
    });

    solicitarAtualizacao();

}


// ========================================
// AUMENTAR ZOOM
// ========================================

btnAumentarZoom.addEventListener("click", () => {

    if (zoom < zoomMaximo) {

        zoom += passoZoom;

        atualizarZoom();

    }

});


// ========================================
// DIMINUIR ZOOM
// ========================================

btnDiminuirZoom.addEventListener("click", () => {

    if (zoom > zoomMinimo) {

        zoom -= passoZoom;

        atualizarZoom();

    }

});


// ========================================
// RESTAURAR ZOOM
// ========================================

btnResetarZoom.addEventListener("click", () => {

    zoom = 100;

    atualizarZoom();

});


// ========================================
// MODO TELA CHEIA
// ========================================

btnTelaCheia.addEventListener("click", async () => {

    try {

        if (!document.fullscreenElement) {

            await document.documentElement
                .requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (erro) {

        console.error(
            "Erro ao ativar tela cheia:",
            erro
        );

        alert(
            "O navegador não permitiu o modo tela cheia."
        );

    }

});

document.addEventListener("fullscreenchange", () => {

    btnTelaCheia.title = document.fullscreenElement
        ? "Sair da tela cheia"
        : "Tela cheia";

    solicitarAtualizacao();

});


// ========================================
// INICIALIZAÇÃO
// ========================================

btnDiminuirZoom.disabled = zoom <= zoomMinimo;

btnAumentarZoom.disabled = zoom >= zoomMaximo;

if (!document.fullscreenEnabled) {

    btnTelaCheia.hidden = true;

}

window.addEventListener(
    "load",
    atualizarLeitura
);

atualizarLeitura();


// ========================================
// ACESSIBILIDADE - NARRAÇÃO DAS PÁGINAS
// ========================================

const audiosDaCartilha = [];


// ========================================
// ÍCONES DOS BOTÕES
// ========================================

const iconeOuvir = `
    <svg viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">

        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5">
        </polygon>

        <path d="M15.5 8.5a5 5 0 0 1 0 7">
        </path>

        <path d="M19 5a10 10 0 0 1 0 14">
        </path>

    </svg>
`;

const iconePausar = `
    <svg viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true">

        <rect x="6" y="4" width="4" height="16" rx="1">
        </rect>

        <rect x="14" y="4" width="4" height="16" rx="1">
        </rect>

    </svg>
`;


// ========================================
// CRIAR OS BOTÕES AUTOMATICAMENTE
// ========================================

document.querySelectorAll(".pagina").forEach((pagina, indice) => {

    const numero = String(indice + 1).padStart(2, "0");

    // Criar o elemento de áudio.

    const audio = document.createElement("audio");

    audio.src = `audios/pagina-${numero}.mp3`;

    audio.preload = "none";


    // Criar a barra de áudio.

    const barraAudio = document.createElement("div");

    barraAudio.className = "barra-audio";


    // Identificação da página.

    const identificacao = document.createElement("span");

    identificacao.className = "numero-pagina-audio";

    identificacao.textContent = `Página ${numero}`;


    // Criar o botão.

    const botao = document.createElement("button");

    botao.type = "button";

    botao.className = "botao-audio";

    botao.innerHTML = `
        ${iconeOuvir}
        <span>Ouvir página</span>
    `;

    botao.setAttribute(
        "aria-label",
        `Ouvir narração da página ${numero}`
    );


    // Criar mensagem de status.

    const status = document.createElement("div");

    status.className = "status-audio";

    status.setAttribute("role", "status");


    // Inserir elementos na página.

    barraAudio.appendChild(identificacao);

    barraAudio.appendChild(botao);

    barraAudio.appendChild(status);

    pagina.prepend(barraAudio);

    pagina.appendChild(audio);


    // Armazenar os elementos.

    audiosDaCartilha.push({
        audio,
        botao,
        numero
    });


    // ========================================
    // REPRODUZIR OU PAUSAR O ÁUDIO
    // ========================================

    botao.addEventListener("click", async () => {

        status.textContent = "";

        // Caso esteja tocando, pausar.

        if (!audio.paused) {

            audio.pause();

            return;

        }


        // Pausar os áudios das outras páginas.

        audiosDaCartilha.forEach(item => {

            if (item.audio !== audio) {

                item.audio.pause();

            }

        });


        // Reiniciar caso tenha chegado ao final.

        if (audio.ended) {

            audio.currentTime = 0;

        }


        // Reproduzir o áudio selecionado.

        try {

            await audio.play();

        } catch (erro) {

            if (erro.name === "AbortError") {

                return;

            }

            status.textContent =
                `Não foi possível reproduzir o áudio da página ${numero}.`;

            console.error(
                "Erro ao reproduzir áudio:",
                erro
            );

        }

    });


    // ========================================
    // QUANDO O ÁUDIO COMEÇAR
    // ========================================

    audio.addEventListener("playing", () => {

        botao.classList.add("reproduzindo");

        botao.innerHTML = `
            ${iconePausar}
            <span>Pausar áudio</span>
        `;

        botao.setAttribute(
            "aria-label",
            `Pausar narração da página ${numero}`
        );

    });


    // ========================================
    // QUANDO O ÁUDIO FOR PAUSADO
    // ========================================

    audio.addEventListener("pause", () => {

        botao.classList.remove("reproduzindo");

        botao.innerHTML = `
            ${iconeOuvir}
            <span>Continuar áudio</span>
        `;

        botao.setAttribute(
            "aria-label",
            `Continuar narração da página ${numero}`
        );

    });


    // ========================================
    // QUANDO O ÁUDIO TERMINAR
    // ========================================

    audio.addEventListener("ended", () => {

        audio.currentTime = 0;

        botao.classList.remove("reproduzindo");

        botao.innerHTML = `
            ${iconeOuvir}
            <span>Ouvir novamente</span>
        `;

        botao.setAttribute(
            "aria-label",
            `Ouvir novamente a página ${numero}`
        );

    });

});
