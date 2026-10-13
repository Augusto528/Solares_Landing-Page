import { useEffect, useState } from "react";

/* ============================================================
   CONFIGURAÇÃO — edite aqui sem mexer no resto do código
   ============================================================ */

// Substitua pelos membros atuais. Para foto, coloque o arquivo em /public/membros/
// e informe o caminho em `foto` (ex.: "/membros/maria.jpg"). Sem foto, aparecem as iniciais.
type Membro = {
  nome: string;
  funcao: string;
  curso: string;
  foto?: string;
  linkedin?: string;
};

const MEMBROS: Membro[] = [
  { nome: "Nome do Membro", funcao: "Coordenador(a)", curso: "Engenharia Mecânica" },
  { nome: "Nome do Membro", funcao: "Acionamento", curso: "Engenharia Elétrica" },
  { nome: "Nome do Membro", funcao: "Estrutura", curso: "Engenharia Mecânica" },
  { nome: "Nome do Membro", funcao: "Telemetria", curso: "Engenharia de Computação" },
  { nome: "Nome do Membro", funcao: "Comunicação", curso: "Comunicação Social" },
  { nome: "Nome do Membro", funcao: "Solares Social", curso: "Arquitetura e Urbanismo" },
];

const CONTATO = {
  email: "contato@seudominio.com", // TODO: e-mail oficial
  instagram: "https://instagram.com/", // TODO: perfil oficial
  inscricao: "#", // TODO: link do formulário do processo seletivo
};

/* ============================================================
   DADOS DO PROJETO (fontes: UFES, Revista Universidade, ge/Globo)
   ============================================================ */

const NUMEROS = [
  { valor: "2015", rotulo: "Ano de origem" },
  { valor: "1º", rotulo: "Lugar geral no DSB 2023" },
  { valor: "1.330", rotulo: "Pontos em 2023" },
  { valor: "2", rotulo: "Títulos no Desafio Solar Brasil" },
];

const RESULTADOS = [
  { ano: "2017", lugar: "4º", texto: "Estreia competitiva em Angra dos Reis (RJ), com 17 estudantes na delegação.", destaque: false },
  { ano: "2018", lugar: "1º", texto: "Campeão da categoria Catamarã e prêmio de Melhor Oficina (Projeto Girassol).", destaque: true },
  { ano: "2020", lugar: "2º", texto: "Vice-campeão da categoria Catamarã.", destaque: false },
  { ano: "2022", lugar: "6º", texto: "Retorno da competição após a pausa da pandemia.", destaque: false },
  { ano: "2023", lugar: "1º", texto: "Vitória geral em Niterói (RJ), além das etapas Mach Race e Manobra.", destaque: true },
];

const FRENTES = [
  {
    icone: "⛵",
    titulo: "Catamarã Poente",
    texto:
      "Embarcação movida a energia solar fotovoltaica, construída para competir no Desafio Solar Brasil. Envolve acionamento, segurança, armazenamento de energia, telemetria, estrutura e hidrodinâmica.",
  },
  {
    icone: "🌻",
    titulo: "Solares Social",
    texto:
      "Visitas e oficinas em escolas, com apresentações interativas que ensinam energia solar a crianças. Inclui o Projeto Girassol.",
  },
  {
    icone: "🎓",
    titulo: "Solares Ensina",
    texto:
      "Workshops, palestras e minicursos para aproximar a comunidade universitária e o público externo do conhecimento sobre energias renováveis.",
  },
  {
    icone: "🔋",
    titulo: "Estação Solares",
    texto:
      "Espaço de convivência com geração fotovoltaica fora da rede, pensado para carregar celulares, tablets e notebooks com energia limpa.",
  },
  {
    icone: "🚤",
    titulo: "Poentinho",
    texto:
      "Protótipo em miniatura do catamarã, do casco em fibra de vidro ao controle por celular, usado para aprendizado e testes.",
  },
  {
    icone: "💡",
    titulo: "Pesquisa SOLAR-VLC",
    texto:
      "Pesquisa em comunicação por luz visível na embarcação, usando LEDs como transmissores e painéis fotovoltaicos como receptores.",
  },
];

const FONTES = [
  { rotulo: "UFES — Equipe Solares fica em 4º lugar (2017)", url: "https://www.ufes.br/node/4028" },
  {
    rotulo: "Revista Universidade — Potência Solar (2018)",
    url: "https://blog.ufes.br/revistauniversidade/2018/12/13/potencia-solar-projeto-de-extensao-e-destaque-em-pesquisas-para-o-uso-de-energia-limpa/",
  },
  { rotulo: "CT/UFES — Vitória no DSB 2023", url: "https://ct.ufes.br/node/862" },
  { rotulo: "CT/UFES — Projeto Solares", url: "https://ct.ufes.br/projeto-solares" },
];

/* ============================================================
   ESTILOS (paleta: azul-mar profundo, ciano do mar, âmbar solar, laranja do poente)
   ============================================================ */

const CSS = `
:root{
  --mar-900:#06182f;
  --mar-800:#0b2545;
  --mar-700:#10386b;
  --mar-500:#13a4c8;
  --mar-200:#bfeaf5;
  --sol:#ffb400;
  --sol-claro:#ffd45e;
  --poente:#ff7a1a;
  --areia:#fff8e8;
  --texto:#10233f;
  --suave:#4b5d78;
  --raio:18px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--texto);background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.container{width:min(1120px,92%);margin-inline:auto}
h1,h2,h3{line-height:1.15;letter-spacing:-0.02em}

/* Navbar */
.nav{position:fixed;inset:0 0 auto 0;z-index:50;transition:background .3s,box-shadow .3s}
.nav.scrolled{background:rgba(6,24,47,.92);backdrop-filter:blur(10px);box-shadow:0 4px 24px rgba(0,0,0,.25)}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:68px}
.logo{display:flex;align-items:center;gap:10px;color:#fff;font-weight:800;font-size:1.25rem}
.logo-sol{width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 35% 35%,var(--sol-claro),var(--sol) 55%,var(--poente));box-shadow:0 0 16px 2px rgba(255,180,0,.7)}
.links{display:flex;gap:26px;align-items:center}
.links a{color:#e6f3fa;font-weight:500;font-size:.95rem;opacity:.9}
.links a:hover{color:var(--sol-claro);opacity:1}
.btn{display:inline-block;padding:13px 26px;border-radius:999px;font-weight:700;transition:transform .2s,box-shadow .2s;cursor:pointer;border:0;font-size:1rem}
.btn:hover{transform:translateY(-2px)}
.btn-sol{background:linear-gradient(135deg,var(--sol),var(--poente));color:var(--mar-900);box-shadow:0 8px 24px rgba(255,122,26,.35)}
.btn-borda{border:2px solid rgba(255,255,255,.6);color:#fff;background:transparent}
.btn-borda:hover{background:rgba(255,255,255,.12)}
.menu-btn{display:none;background:none;border:0;color:#fff;font-size:1.7rem;cursor:pointer}

/* Hero */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;color:#fff;overflow:hidden;
  background:linear-gradient(180deg,var(--mar-900) 0%,var(--mar-800) 45%,#1b4f86 70%,#e8833a 92%,var(--sol) 100%)}
.hero .sol-disco{position:absolute;right:8%;bottom:14%;width:min(34vw,340px);aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle at 40% 40%,#fff3c4,var(--sol) 45%,var(--poente) 100%);
  box-shadow:0 0 120px 40px rgba(255,160,40,.55);animation:pulsa 6s ease-in-out infinite}
@keyframes pulsa{50%{transform:scale(1.05);box-shadow:0 0 150px 55px rgba(255,160,40,.65)}}
.hero-in{position:relative;z-index:2;padding:130px 0 150px;max-width:660px}
.selo{display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);font-size:.85rem;font-weight:600;color:var(--sol-claro);margin-bottom:22px}
.hero h1{font-size:clamp(2.4rem,6vw,4.4rem);font-weight:800}
.hero h1 span{background:linear-gradient(90deg,var(--sol-claro),var(--poente));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{margin:22px 0 34px;font-size:1.15rem;color:#d7e9f5;max-width:540px}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap}
.ondas{position:absolute;bottom:-1px;left:0;width:100%;line-height:0;z-index:3}
.ondas svg{display:block;width:100%;height:90px}

/* Seções */
section{padding:96px 0}
.eyebrow{color:var(--mar-500);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:.82rem}
.titulo{font-size:clamp(1.8rem,4vw,2.7rem);font-weight:800;margin:10px 0 16px;color:var(--mar-800)}
.lead{color:var(--suave);font-size:1.1rem;max-width:700px}
.centro{text-align:center}.centro .lead{margin-inline:auto}

/* Sobre */
.sobre{display:grid;grid-template-columns:1.1fr .9fr;gap:56px;align-items:center}
.sobre p+p{margin-top:14px;color:var(--suave)}
.cartao-sol{background:linear-gradient(145deg,var(--mar-800),var(--mar-700));color:#fff;border-radius:var(--raio);padding:34px;position:relative;overflow:hidden}
.cartao-sol::after{content:"";position:absolute;right:-60px;top:-60px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,var(--sol),transparent 70%);opacity:.5}
.cartao-sol h3{font-size:1.2rem;margin-bottom:10px;color:var(--sol-claro)}
.cartao-sol ul{list-style:none;margin-top:14px}
.cartao-sol li{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.12);color:#dcecf7}
.cartao-sol li:last-child{border:0}

/* Números */
.numeros{background:var(--areia);padding:64px 0}
.grid-num{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;text-align:center}
.num strong{display:block;font-size:clamp(2rem,5vw,3.2rem);font-weight:800;background:linear-gradient(135deg,var(--poente),var(--sol));-webkit-background-clip:text;background-clip:text;color:transparent}
.num span{color:var(--suave);font-weight:500}

/* Resultados */
.resultados{background:linear-gradient(180deg,var(--mar-900),var(--mar-800));color:#fff}
.resultados .titulo{color:#fff}.resultados .lead{color:#b9d3e6}
.linha{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-top:48px}
.res{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:var(--raio);padding:24px 18px;text-align:center;transition:transform .25s}
.res:hover{transform:translateY(-6px)}
.res.destaque{background:linear-gradient(160deg,rgba(255,180,0,.22),rgba(255,122,26,.12));border-color:rgba(255,180,0,.55)}
.res .ano{font-size:.9rem;color:var(--mar-200);font-weight:600}
.res .lugar{font-size:3rem;font-weight:800;color:var(--sol-claro);line-height:1.1;margin:6px 0}
.res p{font-size:.9rem;color:#cfe2f0}

/* Frentes */
.grid-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
.card{border-radius:var(--raio);padding:30px;background:#fff;border:1px solid #e3ecf4;box-shadow:0 6px 24px rgba(11,37,69,.06);transition:transform .25s,box-shadow .25s}
.card:hover{transform:translateY(-6px);box-shadow:0 16px 36px rgba(11,37,69,.13)}
.card .ic{width:54px;height:54px;border-radius:14px;display:grid;place-items:center;font-size:1.6rem;background:linear-gradient(135deg,var(--mar-200),#fff1c9);margin-bottom:16px}
.card h3{font-size:1.2rem;color:var(--mar-800);margin-bottom:8px}
.card p{color:var(--suave);font-size:.97rem}

/* Membros */
.membros{background:var(--areia)}
.grid-mem{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:24px;margin-top:48px}
.mem{background:#fff;border-radius:var(--raio);padding:30px 22px;text-align:center;box-shadow:0 6px 24px rgba(11,37,69,.08);transition:transform .25s}
.mem:hover{transform:translateY(-6px)}
.avatar{width:104px;height:104px;border-radius:50%;margin:0 auto 16px;display:grid;place-items:center;font-size:2rem;font-weight:800;color:#fff;
  background:linear-gradient(135deg,var(--mar-500),var(--mar-700));border:4px solid var(--sol);overflow:hidden}
.avatar img{width:100%;height:100%;object-fit:cover}
.mem h3{font-size:1.05rem;color:var(--mar-800)}
.mem .funcao{display:inline-block;margin:8px 0 4px;padding:3px 12px;border-radius:999px;background:#fff1c9;color:#9a5a00;font-weight:700;font-size:.8rem}
.mem .curso{color:var(--suave);font-size:.88rem}
.mem a.in{display:inline-block;margin-top:10px;color:var(--mar-500);font-weight:600;font-size:.85rem}

/* CTA */
.cta{background:linear-gradient(135deg,var(--mar-800),var(--mar-700) 55%,#c8641a);color:#fff;border-radius:28px;padding:64px 40px;text-align:center;position:relative;overflow:hidden}
.cta::before{content:"";position:absolute;left:50%;top:-140px;transform:translateX(-50%);width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,60,.55),transparent 70%)}
.cta>*{position:relative}
.cta h2{font-size:clamp(1.8rem,4vw,2.6rem);margin-bottom:12px}
.cta p{color:#dcecf7;max-width:560px;margin:0 auto 28px}

/* Rodapé */
footer{background:var(--mar-900);color:#a9c1d6;padding:56px 0 28px}
.foot{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px}
footer h4{color:#fff;margin-bottom:12px}
footer li{list-style:none;margin:6px 0;font-size:.92rem}
footer a:hover{color:var(--sol-claro)}
.copy{margin-top:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);font-size:.85rem;text-align:center}

@media(max-width:900px){
  .sobre,.foot{grid-template-columns:1fr}
  .grid-num{grid-template-columns:repeat(2,1fr)}
  .linha{grid-template-columns:repeat(2,1fr)}
  .grid-cards{grid-template-columns:1fr 1fr}
  .hero .sol-disco{opacity:.45;right:-8%}
}
@media(max-width:640px){
  section{padding:68px 0}
  .menu-btn{display:block}
  .links{position:absolute;top:68px;left:0;right:0;flex-direction:column;background:var(--mar-900);padding:20px;gap:16px;display:none}
  .links.aberto{display:flex}
  .grid-cards{grid-template-columns:1fr}
  .linha{grid-template-columns:1fr}
}
`;

/* ============================================================
   COMPONENTES
   ============================================================ */

function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function Navbar() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fechar = () => setAberto(false);

  return (
    <header className={`nav ${rolou ? "scrolled" : ""}`}>
      <div className="container nav-in">
        <a href="#inicio" className="logo">
          <span className="logo-sol" /> Solares
        </a>
        <button className="menu-btn" aria-label="Abrir menu" onClick={() => setAberto(!aberto)}>
          {aberto ? "✕" : "☰"}
        </button>
        <nav className={`links ${aberto ? "aberto" : ""}`}>
          <a href="#sobre" onClick={fechar}>Sobre</a>
          <a href="#resultados" onClick={fechar}>Resultados</a>
          <a href="#frentes" onClick={fechar}>Projetos</a>
          <a href="#membros" onClick={fechar}>Membros</a>
          <a href="#participe" className="btn btn-sol" onClick={fechar}>Participe</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero" style={{ padding: 0 }}>
      <div className="sol-disco" />
      <div className="container">
        <div className="hero-in">
          <span className="selo">Projeto de extensão · UFES · Centro Tecnológico</span>
          <h1>
            Energia do sol, <span>movendo estudantes</span> e o mar.
          </h1>
          <p>
            Desde 2015, estudantes de diversas áreas projetam, constroem e testam tecnologias
            movidas a energia solar, e levam esse conhecimento para a sociedade.
          </p>
          <div className="hero-btns">
            <a href="#participe" className="btn btn-sol">Quero participar</a>
            <a href="#resultados" className="btn btn-borda">Ver conquistas</a>
          </div>
        </div>
      </div>
      <div className="ondas">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
          <path fill="#fff" d="M0,50 C240,100 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90 Z" />
        </svg>
      </div>
    </section>
  );
}

function Sobre() {
  return (
    <section id="sobre">
      <div className="container sobre">
        <div>
          <span className="eyebrow">Quem somos</span>
          <h2 className="titulo">Um projeto de extensão interdisciplinar</h2>
          <p className="lead">
            O Solares é desenvolvido no Centro Tecnológico da Universidade Federal do Espírito
            Santo para explorar aplicações da energia solar e compartilhar conhecimento sobre
            energias renováveis.
          </p>
          <p>
            A equipe reúne estudantes voluntários de Engenharias, Arquitetura e Urbanismo e
            Comunicação Social, que aprendem na prática: da concepção à construção, dos testes à
            melhoria contínua.
          </p>
          <p>
            Nossa iniciativa mais conhecida é o catamarã <strong>Poente</strong>, que compete no
            Desafio Solar Brasil, rali de embarcações movidas a energia solar fotovoltaica.
          </p>
        </div>
        <aside className="cartao-sol">
          <h3>Nossa missão</h3>
          <p>Explorar aplicações para a energia solar e contribuir para o desenvolvimento dos integrantes e da sociedade.</p>
          <ul>
            <li>☀️ Popularizar a energia limpa</li>
            <li>🛠️ Aprender fazendo, com projetos reais</li>
            <li>🤝 Divulgar e incentivar fontes renováveis</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

function Numeros() {
  return (
    <div className="numeros">
      <div className="container grid-num">
        {NUMEROS.map((n) => (
          <div className="num" key={n.rotulo}>
            <strong>{n.valor}</strong>
            <span>{n.rotulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Resultados() {
  return (
    <section id="resultados" className="resultados">
      <div className="container">
        <div className="centro">
          <span className="eyebrow" style={{ color: "var(--sol-claro)" }}>Trajetória do Poente</span>
          <h2 className="titulo">Conquistas no Desafio Solar Brasil</h2>
          <p className="lead">Uma progressão construída edição após edição.</p>
        </div>
        <div className="linha">
          {RESULTADOS.map((r) => (
            <div key={r.ano} className={`res ${r.destaque ? "destaque" : ""}`}>
              <div className="ano">{r.ano}</div>
              <div className="lugar">{r.lugar}</div>
              <p>{r.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Frentes() {
  return (
    <section id="frentes">
      <div className="container">
        <div className="centro">
          <span className="eyebrow">O que fazemos</span>
          <h2 className="titulo">Frentes de atuação</h2>
          <p className="lead">Tecnologia, educação e comunidade andando juntas.</p>
        </div>
        <div className="grid-cards">
          {FRENTES.map((f) => (
            <article className="card" key={f.titulo}>
              <div className="ic">{f.icone}</div>
              <h3>{f.titulo}</h3>
              <p>{f.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Membros() {
  return (
    <section id="membros" className="membros">
      <div className="container">
        <div className="centro">
          <span className="eyebrow">Nossa equipe</span>
          <h2 className="titulo">Membros atuais</h2>
          <p className="lead">
            Estudantes que dedicam seu tempo, de forma voluntária, a fazer o Solares navegar.
          </p>
        </div>
        <div className="grid-mem">
          {MEMBROS.map((m, i) => (
            <div className="mem" key={i}>
              <div className="avatar">
                {m.foto ? <img src={m.foto} alt={m.nome} /> : iniciais(m.nome)}
              </div>
              <h3>{m.nome}</h3>
              <span className="funcao">{m.funcao}</span>
              <div className="curso">{m.curso}</div>
              {m.linkedin && (
                <a className="in" href={m.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Participe() {
  return (
    <section id="participe">
      <div className="container">
        <div className="cta">
          <h2>Venha fazer parte do Solares</h2>
          <p>
            Não importa o curso: se você quer aprender na prática e ajudar a espalhar energia
            limpa, há um lugar para você na equipe.
          </p>
          <a href={CONTATO.inscricao} className="btn btn-sol">Acompanhe o processo seletivo</a>
        </div>
      </div>
    </section>
  );
}

function Rodape() {
  return (
    <footer>
      <div className="container">
        <div className="foot">
          <div>
            <a href="#inicio" className="logo" style={{ marginBottom: 12 }}>
              <span className="logo-sol" /> Solares
            </a>
            <p style={{ fontSize: ".92rem", maxWidth: 340 }}>
              Projeto de extensão do Centro Tecnológico da Universidade Federal do Espírito Santo.
            </p>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a></li>
              <li><a href={CONTATO.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></li>
            </ul>
          </div>
          <div>
            <h4>Na imprensa e na UFES</h4>
            <ul>
              {FONTES.map((f) => (
                <li key={f.url}>
                  <a href={f.url} target="_blank" rel="noreferrer">{f.rotulo} ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="copy">© {new Date().getFullYear()} Projeto Solares · UFES. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <main>
        <Hero />
        <Sobre />
        <Numeros />
        <Resultados />
        <Frentes />
        <Membros />
        <Participe />
      </main>
      <Rodape />
    </>
  );
}
