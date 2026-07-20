const fs = require('fs');
const path = require('path');

const darkDir = path.join(__dirname, 'Dark');
const readmePath = path.join(__dirname, 'README.md');
const readmePtPath = path.join(__dirname, 'README.pt-BR.md');

// 1. Get and sort icons
if (!fs.existsSync(darkDir)) {
    console.error("Error: 'Dark' directory not found.");
    process.exit(1);
}

const files = fs.readdirSync(darkDir).filter(f => f.endsWith('.svg'));
const icons = files.map(filename => {
    const label = filename.replace('.svg', '');
    return [filename, label];
});

// Sort case-insensitively by label
icons.sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: 'accent', numeric: true }));

console.log(`Scanning icons... Found ${icons.length} icons in 'Dark' directory.`);

// 2. Generate the Markdown Table
let tableMarkdown = "| Icons (Dark/Light) | Label | Icons (Dark/Light) | Label |\n";
tableMarkdown += "| :---: | :---: | :---: | :---: |\n";

for (let i = 0; i < icons.length; i += 2) {
    const rowIcons = icons.slice(i, i + 2);
    let rowStr = "| ";
    for (let idx = 0; idx < rowIcons.length; idx++) {
        const [filename, label] = rowIcons[idx];
        const urlFn = encodeURIComponent(filename).replace(/%20/g, "%20");
        
        rowStr += `<img src="https://github.com/gui-bus/TechIcons/blob/main/Dark/${urlFn}" width="80"> <img src="https://github.com/gui-bus/TechIcons/blob/main/Light/${urlFn}" width="80"> | <p align="center">${label}</p> |`;
        if (idx === 0 && rowIcons.length === 2) {
            rowStr += " ";
        }
    }
    if (rowIcons.length === 1) {
        rowStr += " | |";
    }
    tableMarkdown += rowStr + "\n";
}

// 3. Define English Content
const englishContent = `<div align="center">
  <img src="https://github.com/gui-bus/TechIcons/blob/main/techicons_logo.svg" alt="TechIcons Logo" width="300" />
</div>

<h1 align="center">Welcome to TechIcons!</h1>

<p align="center">
  <strong><a href="README.pt-BR.md">🇧🇷 Leia em Português</a></strong>
</p>

<p align="center">
  A premium, curated collection of 290+ high-quality technology icons tailored for your GitHub profiles, READMEs, and projects. 
  Each icon is carefully designed to support both light and dark themes seamlessly.
</p>

<p align="center">
  Need an icon that isn't here? Open an <a href="https://github.com/gui-bus/TechIcons/issues">Issue</a> to request a new one. I'm always open to growing the collection! 😊
</p>

<div align="center">
  <h2>Navigation Shortcuts</h2>

  ***[Available Icons](#available-icons)*** :bookmark_tabs: | ***[How to Use](#how-to-use)*** :gear: | ***[Alignment](#alignment)*** :triangular_ruler: | ***[Links](#linking-icons)*** :link: | ***[Customizing Sizes](#customizing-sizes)*** :straight_ruler:
</div>

---

<h1 id="how-to-use" align="center">How to Use</h1>

1. Find the desired icon in the list below.
2. Copy the icon's exact name.
3. Add the following HTML snippet to your README or markdown file, selecting your preferred theme (\`Dark\` or \`Light\`):

\`\`\`html
<img alt="[Icon]" height="[Height]" width="[Width]" src="https://github.com/gui-bus/TechIcons/blob/main/[Theme]/[Icon].svg">
\`\`\`

### Example

\`\`\`html
<img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Typescript.svg">
<img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Light/React.svg">
\`\`\`

<div align="center">
  <img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Typescript.svg">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="TailwindCSS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/TailwindCSS.svg">
  <img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Light/Typescript.svg">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Light/React.svg">
  <img alt="TailwindCSS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Light/TailwindCSS.svg">
</div>

---

<h1 id="alignment" align="center">Alignment</h1>

To center your icons, wrap the images in a \`div\` tag with \`align="center"\`:

\`\`\`html
<div align="center">
  <img alt="[Icon]" height="[Height]" width="[Width]" src="https://github.com/gui-bus/TechIcons/blob/main/[Theme]/[Icon].svg">
</div>
\`\`\`

<div align="center">
  <img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Typescript.svg">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="TailwindCSS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/TailwindCSS.svg">
</div>

---

<h1 id="linking-icons" align="center">Linking Icons</h1>

You can make your icons clickable by wrapping them in an anchor (\`a\`) tag:

\`\`\`html
<div align="center">
  <a href="[Your Link]">
    <img alt="[Icon]" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/[Theme]/[Icon].svg"> 
  </a>
</div>
\`\`\`

<div align="center">
  <a href="https://instagram.com">
    <img alt="Instagram" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Instagram.svg"> 
  </a>
  <a href="https://linkedin.com">
    <img alt="LinkedIn" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Linkedin.svg"> 
  </a>
  <a href="mailto:example@gmail.com">
    <img alt="Gmail" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Gmail.svg"> 
  </a>
</div>

---

<h1 id="customizing-sizes" align="center">Customizing Sizes</h1>

Easily customize the sizes by adjusting the \`height\` and \`width\` attributes on the \`<img>\` tags:

<div align="center">
  <img alt="React" height="30" width="30" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="React" height="45" width="45" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="React" height="75" width="75" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
</div>

---

<div align="center">
  <h1 id="available-icons">Available Icons</h1>
</div>

${tableMarkdown}
`;

// 4. Define Portuguese Content
const portugueseContent = `<div align="center">
  <img src="https://github.com/gui-bus/TechIcons/blob/main/techicons_logo.svg" alt="Logo TechIcons" width="300" />
</div>

<h1 align="center">Bem-vindo ao TechIcons!</h1>

<p align="center">
  <strong><a href="README.md">🇺🇸 Leia em Inglês</a></strong>
</p>

<p align="center">
  Uma coleção premium com mais de 290 ícones de tecnologia em alta qualidade, ideal para perfis de GitHub, READMEs e projetos. 
  Cada ícone foi cuidadosamente desenhado para suportar os temas claro (Light) e escuro (Dark) de forma integrada.
</p>

<p align="center">
  Precisa de um ícone que ainda não está aqui? Sinta-se à vontade para abrir uma <a href="https://github.com/gui-bus/TechIcons/issues">Issue</a> solicitando o ícone desejado. Estou sempre aberto a aumentar a coleção! 😊
</p>

<div align="center">
  <h2>Atalhos de Navegação</h2>

  ***[Ícones Disponíveis](#ícones-disponíveis)*** :bookmark_tabs: | ***[Como Usar](#como-usar)*** :gear: | ***[Alinhamento](#alinhamento)*** :triangular_ruler: | ***[Links](#inserindo-links)*** :link: | ***[Tamanhos](#personalizando-o-tamanho)*** :straight_ruler:
</div>

---

<h1 id="como-usar" align="center">Como Usar</h1>

1. Escolha o ícone desejado na lista abaixo.
2. Copie o nome exato do ícone.
3. No seu arquivo markdown ou documento, use a seguinte sintaxe para exibir o ícone selecionado, escolhendo seu tema preferido (\`Dark\` ou \`Light\`):

\`\`\`html
<img alt="[Icon]" height="[Height]" width="[Width]" src="https://github.com/gui-bus/TechIcons/blob/main/[Theme]/[Icon].svg">
\`\`\`

### Exemplo

\`\`\`html
<img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Typescript.svg">
<img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Light/React.svg">
\`\`\`

<div align="center">
  <img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Typescript.svg">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="TailwindCSS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/TailwindCSS.svg">
  <img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Light/Typescript.svg">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Light/React.svg">
  <img alt="TailwindCSS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Light/TailwindCSS.svg">
</div>

---

<h1 id="alinhamento" align="center">Alinhamento</h1>

Para centralizar seus ícones, envolva as tags \`<img>\` em uma \`div\` com \`align="center"\`:

\`\`\`html
<div align="center">
  <img alt="[Icon]" height="[Height]" width="[Width]" src="https://github.com/gui-bus/TechIcons/blob/main/[Theme]/[Icon].svg">
</div>
\`\`\`

<div align="center">
  <img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Typescript.svg">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="TailwindCSS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/TailwindCSS.svg">
</div>

---

<h1 id="inserindo-links" align="center">Inserindo Links</h1>

Você pode transformar seus ícones em links clicáveis envolvendo-os em uma tag de link (\`a\`):

\`\`\`html
<div align="center">
  <a href="[Seu Link]">
    <img alt="[Icon]" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/[Theme]/[Icon].svg"> 
  </a>
</div>
\`\`\`

<div align="center">
  <a href="https://instagram.com">
    <img alt="Instagram" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Instagram.svg"> 
  </a>
  <a href="https://linkedin.com">
    <img alt="LinkedIn" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Linkedin.svg"> 
  </a>
  <a href="mailto:exemplo@gmail.com">
    <img alt="Gmail" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Gmail.svg"> 
  </a>
</div>

---

<h1 id="personalizando-o-tamanho" align="center">Personalizando o Tamanho</h1>

Personalize facilmente a dimensão dos ícones alterando os atributos \`height\` e \`width\` nas tags \`<img>\`:

<div align="center">
  <img alt="React" height="30" width="30" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="React" height="45" width="45" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="React" height="75" width="75" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
</div>

---

<div align="center">
  <h1 id="ícones-disponíveis">Ícones Disponíveis</h1>
</div>

${tableMarkdown}
`;

// Write files
fs.writeFileSync(readmePath, englishContent, 'utf8');
fs.writeFileSync(readmePtPath, portugueseContent, 'utf8');

console.log("Success! Both README files have been regenerated and sorted alphabetically.");
