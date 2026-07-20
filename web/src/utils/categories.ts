export type CategoryType = "all" | "frontend" | "backend" | "mobile" | "devops" | "services" | "software" | "testing" | "others";

export const CATEGORIES: { value: CategoryType; label: string }[] = [
  { value: "all", label: "All Icons" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend & DB" },
  { value: "mobile", label: "Mobile" },
  { value: "devops", label: "DevOps & Cloud" },
  { value: "services", label: "Services & Platforms" },
  { value: "software", label: "Software & Tools" },
  { value: "testing", label: "Testing & Lints" },
  { value: "others", label: "Others" }
];

export function getIconCategory(label: string): CategoryType {
  const name = label.toLowerCase().replace(/[\s\.\-\_/]/g, "");

  const frontendKeywords = [
    "react", "html", "css", "vue", "svelte", "tailwind", "tailwindcss", "shadcn", "shadcnui",
    "nextintl", "nuqs", "bootstrap", "bulma", "daisyui", "materialui", "materialize",
    "semanticui", "nextui", "heroui", "alpinejs", "antdesign", "chakraui", "gatsby",
    "nextjs", "redux", "zustand", "tanstack", "swiper", "tiptap", "radix", "lucide",
    "chartjs", "highcharts", "framermotion", "angular", "solidjs", "sass", "less",
    "jquery", "styledcomponents", "lit", "stencil", "webcomponents", "frontmatter",
    "blazor", "nuxt", "postcss", "iconify", "phosphoricons"
  ];

  const backendKeywords = [
    "node", "nodejs", "nest", "nestjs", "express", "expressjs", "python", "go", "golang",
    "rust", "java", "kotlin", "scala", "c#", "c++", "c", "postgresql", "mysql", "prisma",
    "prismaorm", "sqlite", "oracle", "mariadb", "mongodb", "mongoose", "dynamodb",
    "cassandra", "neo4j", "redis", "django", "flask", "fastapi", "fastify", "adonis",
    "laravel", "symfony", "php", "ruby", "rails", "springboot", "csharp", "cpp",
    "graphql", "axios", "uploadthing", "jwt", "auth", "doctrine", "sequelize", "bullmq",
    "cakephp", "delphi", "elixir", "phoenix", "haskell", "perl", "r", "solidity", "web3",
    "rabbitmq", "kafka", "nginx", "apache", "dotnet", "zod", "scalar", "slimphp",
    "sqlserver", "krakenjs", "typescript", "javascript", "lua", "dart"
  ];

  const mobileKeywords = [
    "flutter", "reactnative", "swift", "objectivec", "xamarin", "cordova", "ionic", "expo",
    "android", "ios", "apple", "androidstudio"
  ];

  const devopsKeywords = [
    "git", "github", "githubactions", "docker", "kubernetes", "aws", "azure", "googlecloud",
    "vercel", "netlify", "cloudflare", "heroku", "pnpm", "npm", "yarn", "bun", "turborepo",
    "webpack", "vite", "babel", "gradle", "gulp", "bitbucket", "gitlab", "actions", "husky",
    "conventionalcommits", "semanticrelease", "gitbash", "gitkraken", "bash", "powershell",
    "linux", "windows", "ubuntu", "debian", "centos", "fedora", "redhat", "archlinux", "macos"
  ];

  const testingKeywords = [
    "jest", "vitest", "playwright", "cypress", "eslint", "prettier", "biome", "sonarqube",
    "mocha", "chai", "testinglibrary", "storybook"
  ];

  const servicesKeywords = [
    "stripe", "paypal", "resend", "clerk", "firebase", "supabase", "appwrite", "directus",
    "strapi", "sanity", "chatgpt", "claude", "gemini", "googledrive", "googleplay", "googlemaps",
    "google", "gmail", "applestore", "discord", "slack", "zoom", "clickup", "notion", "trello",
    "jira", "mailchimp", "spotify", "airbnb", "epic", "binance", "coinbase", "coingecko",
    "coinmarketcap", "cryptocom", "deviantart", "artstation", "ledger", "walletconnect",
    "metamask", "phantom", "solana", "cardano", "ethereum", "bitcoin", "doge", "tether",
    "ripple", "polkadot", "chainlink", "uniswap", "aave", "compound", "maker", "sushi",
    "pancakeswap", "dydx", "opensea", "rarible", "superrare", "niftygateway", "looksrare",
    "magiceden", "shopify", "tallyso", "telegram", "whatsapp", "messenger", "instagram",
    "twitter", "tiktok", "linkedin", "facebook", "pinterest", "youtube", "cloudinary",
    "codepen", "hotjar", "copilot", "openai", "midjourney", "perplexity", "nextauth", "meets",
    "dropbox", "wordpress", "snapchat", "trezor", "trustwallet", "usdt", "matic", "shibainu",
    "poocoin"
  ];

  const softwareKeywords = [
    "figma", "photoshop", "illustrator", "adobecreativecloud", "acrobatreader", "indesign",
    "premiere", "aftereffects", "mediaencoder", "dimension", "aero", "blender", "zbrush",
    "aseprite", "gimp", "krita", "inkscape", "maya", "3dxmax", "substance", "autocad",
    "vscode", "cursor", "chrome", "firefox", "safari", "brave", "opera", "vivaldi", "edge",
    "beekeeper", "dribbble", "behance", "canva", "office", "word", "excel", "powerpoint",
    "teams", "outlook", "skype", "visualstudio", "webstorm", "phpstorm", "pycharm", "notepad++",
    "obs", "sketch", "xd", "creativecloud", "lightroom", "microsoft", "powerbi", "insomnia",
    "postman", "powerbi", "kibana", "logstash", "unity", "unreal", "godot", "dreamweaver",
    "animate", "bridge"
  ];

  if (frontendKeywords.includes(name)) return "frontend";
  if (backendKeywords.includes(name)) return "backend";
  if (mobileKeywords.includes(name)) return "mobile";
  if (devopsKeywords.includes(name)) return "devops";
  if (testingKeywords.includes(name)) return "testing";
  if (servicesKeywords.includes(name)) return "services";
  if (softwareKeywords.includes(name)) return "software";

  if (name.includes("react") && !name.includes("reactnative")) return "frontend";
  if (name.includes("angular")) return "frontend";
  if (name.includes("vue")) return "frontend";
  if (name.includes("svelte")) return "frontend";
  if (name.includes("tailwind")) return "frontend";
  
  if (name.includes("google") && !name.includes("googlecloud")) return "services";
  if (name.includes("adobe")) return "software";
  if (name.includes("git") && !name.includes("github") && !name.includes("gitlab") && !name.includes("gitbash") && !name.includes("gitkraken")) return "devops";

  return "others";
}
