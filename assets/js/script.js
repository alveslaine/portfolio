// Selecionar a Seção about
const about = document.querySelector('#about')

// Selecionar a Seção projects
const swiperWrapper = document.querySelector('.swiper-wrapper')

// Formulário
const formulario = document.querySelector('#formulario')
 
// Expressão Regular de validação do e-mail
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

// Função para construir a seção about
async function getAboutGithub(){
    try{
        const resposta = await fetch('https://api.github.com/users/alveslaine')

        const perfil = await resposta.json()

        //console.log(perfil)

        about.innerHTML = ''
        about.innerHTML = `

         <!-- Imagem da Seção About -->
            <figure class="about-image">
                <img src="./assets/img/perfil.jpeg" alt="${perfil.name}">
            </figure>

            <!-- Conteúdo da Seção About -->
            <article class="about-content">
                <h2>Sobre mim</h2>
                <p>Formada em Análise e Desenvolvimento de Sistemas pela UNIP e cursando o Bootcamp de Desenvolvedor
                    Full Stack Java da Generation Brasil.</p>
                <p>Sou desenvolvedora Full Stack Jr. com foco em Java e Spring Boot, e venho desenvolvendo projetos
                    utilizando Java, MySQL, JavaScript, HTML, CSS, React, Node.js, Git e GitHub.</p>
                <p>Tenho interesse em desenvolvimento de software e busco minha primeira oportunidade na área de
                    Engenharia de Software para aplicar meus conhecimentos, aprender com novos desafios e evoluir
                    profissionalmente.</p>
                <p>Minha experiência anterior na área administrativa contribuiu para desenvolver habilidades como
                    organização, atenção aos detalhes, análise de informações e trabalho em equipe, que hoje fazem parte
                    da minha atuação na tecnologia.</p>

                <!-- Links (GitHub + Currículo) e Dados do GitHub -->
                <div class="about-buttons-data">

                    <!-- Links -->
                    <div class="buttons-container">
                        <a href="${perfil.html_url}" target="_blank" class="botao">GitHub</a>
                        <a href="https://drive.google.com/file/d/1_ny12MYSg3KbANpeh_DgCdxgeJloEKN5/view?usp=sharing"
                            target="_blank" class="botao-outline">Currículo</a>
                    </div>

                    <!-- Dados - Repositório Github -->
                    <div class="data-container">

                        <!-- Número de Seguidores -->
                        <div class="data-item">
                            <span class="data-number">${perfil.followers}</span>
                            <span class="data-label">Seguidores</span>
                        </div>

                        <!-- Número de Repositórios Públicos -->
                        <div class="data-item">
                            <span class="data-number">${perfil.public_repos}</span>
                            <span class="data-label">Repositórios</span>
                        </div>
                    </div>
                </div>
            </article> `

    }catch(error){
        console.error("Erro ao buscar dados no GitHub!", error)
    }
}

// Função para construção do carrossel com o Swiper
async function getProjectsGithub(){
    try{
        const resposta = await fetch('https://api.github.com/users/alveslaine/repos?sort=update&per_page=9')

        const repositorios = await resposta.json()

        swiperWrapper.innerHTML = ''
        // Ícones das linguagens
		const linguagens = {
			'JavaScript': 'javascript',
			'TypeScript': 'typescript',
			'Python': 'python',
			'Java': 'java',
			'HTML': 'html',
			'CSS': 'css',
			'PHP': 'php',
			'C#': 'csharp',
			'Go': 'go',
			'Kotlin': 'kotlin',
			'Swift': 'swift',
			'C': 'c',
			'C++': 'c_plus',
			'GitHub': 'github',
		}

        // Prints (capas) dos projetos - chave = nome EXATO do repositório no GitHub
        // Para projetos sem print ainda, ele cai no ícone da linguagem automaticamente
        const capas = {
            'portfolio': './assets/img/capas/portfolio.png',
            // 'nome-do-repo': './assets/img/capas/nome-do-arquivo.png',
        }

        // Monta os cards esperando a busca das linguagens de cada repositório
        // (precisa ser Promise.all + map porque cada repo faz sua própria requisição)
        const cardsHtml = await Promise.all(repositorios.map(async repositorio => {

            // Seleciona o nome da linguagem padrão do repositório 
            const linguagem = repositorio.language || 'GitHub'

            // Seleciona o ícone da linguagem padrão
            const icone = linguagens[linguagem] ?? linguagens['GitHub']

            //Construi o link do ícone
            const urlIcone = `./assets/icons/languages/${icone}.svg`

            // Verifica se existe print cadastrado para este repositório
            const capa = capas[repositorio.name]

            // Busca todas as linguagens usadas no repositório (não só a predominante)
            let listaLinguagens = []
            try {
                const respostaIdiomas = await fetch(repositorio.languages_url)
                const idiomas = await respostaIdiomas.json()
                listaLinguagens = Object.keys(idiomas) // já vem ordenado por quantidade de código (maior pra menor)
            } catch (erro) {
                console.error(`Erro ao buscar linguagens de ${repositorio.name}`, erro)
            }

            // Formata o Nome do Repositório
			const nomeFormatado = repositorio.name
				.replace(/[-_]/g, ' ') // Substitui hifens e underlines por espaços em branco
				.replace(/[^a-zA-Z0-9\s]/g, '') // Remove Caracteres especiais
                .replace(/\s+t[a-z0-9]+$/i, '') // Remove a identificação de turma
				.toUpperCase() // Converte a string em letras maiúsculas
        
            // Função para truncar o texto
            // Se a descrição possuir mais de 100 carcateres
            // seleciona os primeiros 97 e acrescenta '...' no final
            // Senão retorna o mesmo texto
			const truncar = (texto, limite) => texto.length > limite
                ? texto.substring(0, limite) + '...'
                : texto
        
            const descricao = repositorio.description 
                ? truncar(repositorio.description, 100) 
                : 'Projeto desenvolvido no GitHub'
        
            // Tags: prioridade pros topics manuais do repo; senão, todas as linguagens usadas
            const tags = repositorio.topics?.length > 0
                ? repositorio.topics.slice(0, 4).map(topic => `<span class="tag">${topic}</span>`).join('')
                : listaLinguagens.length > 0
                    ? listaLinguagens.slice(0, 4).map(lang => `<span class="tag">${lang}</span>`).join('')
                    : `<span class="tag">${linguagem}</span>`;

            const botaoDeploy = repositorio.homepage 
                ? `<a href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">Deploy</a>` 
                : ''

            // Botões de ação
            const botoesAcao = `
            <div class="project-buttons">
            <a href="${repositorio.html_url}" target="_blank" class="botao botao-sm">GitHub</a>
            ${botaoDeploy}
            </div>`;

            // Constrói o Card
            // Se existir print cadastrado, mostra a capa do projeto + badge da linguagem
            // Senão, mantém o comportamento antigo (só o ícone centralizado)
            const conteudoImagem = capa
                ? `<img src="${capa}" alt="Print da tela inicial do projeto ${nomeFormatado}" class="project-cover">
                   <img src="${urlIcone}" alt="${linguagem}" class="project-badge">`
                : `<img src="${urlIcone}" alt="Ícone - ${linguagem} - Linguagem principal do projeto" class="project-icon-only">`

            return `
            <div class="swiper-slide">
                <article class="project-card">
                    <div class="project-image">
                        ${conteudoImagem}
                    </div>
                    <div class="project-content">
                        <h3>${nomeFormatado}</h3>
                        <p>${descricao}</p>
                        <div class="project-tags">
                            ${tags}
                        </div>
                        ${botoesAcao}
                    </div>
                </article>
            </div>
            `
        }))

        swiperWrapper.innerHTML = cardsHtml.join('')

    }catch(error){
        console.error("Erro ao buscar os dados dos projetos no GitHub", error)
    }
}

function iniciarSwiper() {
	new Swiper('.projects-swiper', {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 24,
		centeredSlides: false,
		loop: true,
		watchOverflow: true,
 
		breakpoints: {
			0: {
				slidesPerView: 1,
				slidesPerGroup: 1,
				spaceBetween: 40,
				centeredSlides: false,
			},
			769: {
				slidesPerView: 2,
				slidesPerGroup: 2,
				spaceBetween: 40,
				centeredSlides: false,
			},
			1025: {
				slidesPerView: 3,
				slidesPerGroup: 3,
				spaceBetween: 54,
				centeredSlides: false,
			},
		},
 
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
 
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			dynamicBullets: true,
		},
 
		autoplay: {
			delay: 5000,
			pauseOnMouseEnter: true,
			disableOnInteraction: false,
		},
 
		grabCursor: true,
		slidesOffsetBefore: 0,
		slidesOffsetAfter: 0,
	})
}

formulario.addEventListener('submit', function (event) {
	event.preventDefault()
 
	document
		.querySelectorAll('form span')
		.forEach((span) => (span.innerHTML = ''))
 
	let isValid = true
 
	const nome = document.querySelector('#nome')
	const erroNome = document.querySelector('#erro-nome')
 
	if (nome.value.trim().length < 3) {
		erroNome.innerHTML = 'O nome deve ter no mínimo 3 caracteres'
		if (isValid) nome.focus()
		isValid = false
	}
 
	const email = document.querySelector('#email')
	const erroEmail = document.querySelector('#erro-email')
 
	if (!email.value.trim().match(emailRegex)) {
		erroEmail.innerHTML = 'Digite um endereço de e-mail válido'
		if (isValid) email.focus()
		isValid = false
	}
 
	const assunto = document.querySelector('#assunto')
	const erroAssunto = document.querySelector('#erro-assunto')
 
	if (assunto.value.trim().length < 5) {
		erroAssunto.innerHTML =
			'O assunto deve ter no mínimo 5 caracteres'
		if (isValid) assunto.focus()
		isValid = false
	}
 
	const mensagem = document.querySelector('#mensagem')
	const erroMensagem = document.querySelector('#erro-mensagem')
 
	if (mensagem.value.trim().length === 0) {
		erroMensagem.innerHTML = 'A mensagem não pode ser vazia'
		if (isValid) mensagem.focus()
		isValid = false
	}
 
	if (isValid) {
		const submitButton = formulario.querySelector(
			'button[type="submit"]',
		)
		submitButton.disabled = true
		submitButton.textContent = 'Enviando...'
 
		formulario.submit()
	}
})

getAboutGithub();
getProjectsGithub().then(() => {
    iniciarSwiper();
});
