export type Lang = "en" | "pt" | "fr";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "fr", label: "FR" },
];

export const translations = {
  // Header / Nav
  "nav.services": { en: "Services", pt: "Serviços", fr: "Services" },
  "nav.process": { en: "Process", pt: "Processo", fr: "Processus" },
  "nav.portfolio": { en: "Portfolio", pt: "Portefólio", fr: "Portfolio" },
  "nav.about": { en: "About", pt: "Sobre", fr: "À propos" },
  "nav.partners": { en: "Partners", pt: "Parceiros", fr: "Partenaires" },
  "nav.book": { en: "Book Consultation", pt: "Marcar Consulta", fr: "Réserver une consultation" },

  // Footer
  "footer.tagline": {
    en: "Architecture engineered for tomorrow. Licensed California architect. Lisbon · California · International.",
    pt: "Arquitetura concebida para o futuro. Arquiteto licenciado na Califórnia. Lisboa · Califórnia · Internacional.",
    fr: "Architecture conçue pour demain. Architecte agréé en Californie. Lisbonne · Californie · International.",
  },
  "footer.services": { en: "Services", pt: "Serviços", fr: "Services" },
  "footer.studio": { en: "Studio", pt: "Estúdio", fr: "Studio" },
  "footer.contact": { en: "Contact", pt: "Contacto", fr: "Contact" },
  "footer.dashboard": { en: "Studio Dashboard", pt: "Painel do Estúdio", fr: "Tableau de bord" },
  "footer.requestConsult": { en: "Request Consultation →", pt: "Pedir Consulta →", fr: "Demander une consultation →" },
  "footer.rights": {
    en: "Pedro & Luz · Licensed California Architect · All Rights Reserved",
    pt: "Pedro & Luz · Arquiteto Licenciado na Califórnia · Todos os Direitos Reservados",
    fr: "Pedro & Luz · Architecte Agréé en Californie · Tous Droits Réservés",
  },
  "footer.locations": {
    en: "Lisbon · California · International",
    pt: "Lisboa · Califórnia · Internacional",
    fr: "Lisbonne · Californie · International",
  },

  // Common CTAs
  "cta.exploreWork": { en: "Explore Our Work", pt: "Ver os Nossos Projetos", fr: "Découvrir nos projets" },
  "cta.seeProcess": { en: "See The Process →", pt: "Ver o Processo →", fr: "Voir le processus →" },
  "cta.allServices": { en: "All services →", pt: "Todos os serviços →", fr: "Tous les services →" },
  "cta.exploreService": { en: "Explore Service", pt: "Ver Serviço", fr: "Voir le service" },
  "cta.viewCaseStudy": { en: "View Case Study", pt: "Ver Estudo de Caso", fr: "Voir le projet" },
  "cta.readPartners": { en: "Read about our partnerships →", pt: "Sobre as nossas parcerias →", fr: "À propos de nos partenariats →" },
  "cta.requestConsultation": { en: "Request Consultation", pt: "Pedir Consulta", fr: "Demander une consultation" },

  // Home — hero
  "home.hero.eyebrow": {
    en: "Licensed California Architect · Lisbon · International",
    pt: "Arquiteto Licenciado na Califórnia · Lisboa · Internacional",
    fr: "Architecte Agréé en Californie · Lisbonne · International",
  },
  "home.hero.title": {
    en: "Architecture Built\nfor the Way\nYou Live.",
    pt: "Arquitetura Feita\npara a Forma\ncomo Vive.",
    fr: "Une architecture\nfaite pour votre\nfaçon de vivre.",
  },
  "home.hero.subtitle": {
    en: "From concept to construction — precision-engineered design for residential, commercial, and transformation projects.",
    pt: "Do conceito à construção — design rigoroso para projetos residenciais, comerciais e de transformação.",
    fr: "De la conception à la construction — un design rigoureux pour des projets résidentiels, commerciaux et de transformation.",
  },

  // Home — sections
  "home.stats.years": { en: "Years Practice", pt: "Anos de Prática", fr: "Années d'expérience" },
  "home.stats.projects": { en: "Projects Delivered", pt: "Projetos Entregues", fr: "Projets livrés" },
  "home.stats.lines": { en: "Service Lines", pt: "Áreas de Serviço", fr: "Domaines de service" },
  "home.stats.markets": { en: "Markets Served", pt: "Mercados Servidos", fr: "Marchés desservis" },

  "home.services.eyebrow": { en: "What We Do", pt: "O Que Fazemos", fr: "Ce que nous faisons" },
  "home.services.title": {
    en: "Four disciplines.\nOne studio.",
    pt: "Quatro disciplinas.\nUm estúdio.",
    fr: "Quatre disciplines.\nUn studio.",
  },

  "home.process.eyebrow": { en: "The Process", pt: "O Processo", fr: "Le processus" },
  "home.process.title": {
    en: "Seven steps.\nZero guesswork.",
    pt: "Sete passos.\nZero suposições.",
    fr: "Sept étapes.\nAucune approximation.",
  },

  "home.featured.eyebrow": { en: "Featured Project", pt: "Projeto em Destaque", fr: "Projet phare" },
  "home.featured.type": { en: "Type", pt: "Tipo", fr: "Type" },
  "home.featured.location": { en: "Location", pt: "Localização", fr: "Lieu" },
  "home.featured.year": { en: "Year", pt: "Ano", fr: "Année" },

  "home.partner.eyebrow": { en: "Strategic Partnership", pt: "Parceria Estratégica", fr: "Partenariat stratégique" },
  "home.partner.title": {
    en: "Global expertise.\nLocal precision.",
    pt: "Experiência global.\nPrecisão local.",
    fr: "Expertise globale.\nPrécision locale.",
  },
  "home.partner.label": { en: "Strategic Partner", pt: "Parceiro Estratégico", fr: "Partenaire stratégique" },
  "home.partner.body": {
    en: "Founded by Michael Rotondi — SCI-Arc co-founder and one of America's most influential architectural minds. Our collaboration bridges American innovation with European precision, delivering projects that transcend borders.",
    pt: "Fundada por Michael Rotondi — cofundador do SCI-Arc e uma das mentes arquitetónicas mais influentes dos EUA. A nossa colaboração liga a inovação americana à precisão europeia, entregando projetos que transcendem fronteiras.",
    fr: "Fondé par Michael Rotondi — cofondateur du SCI-Arc et l'un des esprits architecturaux les plus influents des États-Unis. Notre collaboration lie l'innovation américaine à la précision européenne pour des projets qui transcendent les frontières.",
  },

  "home.team.eyebrow": { en: "The Team", pt: "A Equipa", fr: "L'équipe" },
  "home.team.title": {
    en: "Architects. Operators. Builders.",
    pt: "Arquitetos. Operadores. Construtores.",
    fr: "Architectes. Opérateurs. Bâtisseurs.",
  },

  "home.tech.eyebrow": { en: "Studio Intelligence", pt: "Inteligência do Estúdio", fr: "Intelligence du studio" },
  "home.tech.title": {
    en: "We don't just design.\nWe compute.",
    pt: "Não só desenhamos.\nCalculamos.",
    fr: "Nous ne dessinons pas.\nNous calculons.",
  },
  "home.tech.aiTitle": { en: "AI-Accelerated Design", pt: "Design Acelerado por IA", fr: "Conception accélérée par IA" },
  "home.tech.aiBody": {
    en: "Generative tools that produce 10× more concept variations in the time it used to take to sketch three. Your brief becomes 50 explorations overnight.",
    pt: "Ferramentas generativas que produzem 10× mais variações de conceito no tempo que antes dava para esboçar três. O seu briefing torna-se 50 explorações numa só noite.",
    fr: "Des outils génératifs qui produisent 10× plus de variantes en moins de temps qu'il n'en fallait pour en esquisser trois. Votre brief devient 50 explorations en une nuit.",
  },
  "home.tech.cyclesTitle": { en: "Compressed Cycles", pt: "Ciclos Comprimidos", fr: "Cycles compressés" },
  "home.tech.cyclesBody": {
    en: "Real-time material procurement, automated supplier quote aggregation, and workforce scheduling that eliminate the coordination tax.",
    pt: "Aquisição de materiais em tempo real, agregação automática de cotações e gestão de equipas que eliminam o custo de coordenação.",
    fr: "Approvisionnement en temps réel, agrégation automatisée des devis fournisseurs, et planification des équipes qui éliminent les frictions de coordination.",
  },
  "home.tech.liveTitle": { en: "Live Project Intelligence", pt: "Inteligência de Projeto em Tempo Real", fr: "Suivi de projet en direct" },
  "home.tech.liveBody": {
    en: "Clients get a dedicated dashboard showing progress, milestone completion, budget tracking, and document access — 24/7, no calls needed.",
    pt: "Os clientes acedem a um painel dedicado com progresso, marcos, acompanhamento de orçamento e documentos — 24/7, sem precisar de telefonemas.",
    fr: "Les clients disposent d'un tableau de bord dédié : progression, jalons, suivi budgétaire et documents — 24/7, sans appels.",
  },

  "home.cta.eyebrow": { en: "Begin", pt: "Começar", fr: "Commencer" },
  "home.cta.title": {
    en: "Tell us about your project.",
    pt: "Conte-nos sobre o seu projeto.",
    fr: "Parlez-nous de votre projet.",
  },
  "home.cta.body": {
    en: "Initial consultations are complimentary. We respond within one business day.",
    pt: "As consultas iniciais são gratuitas. Respondemos no prazo de um dia útil.",
    fr: "Les consultations initiales sont gratuites. Nous répondons sous un jour ouvré.",
  },

  // Process steps (titles + descriptions)
  "process.s1.t": { en: "Initial Consultation", pt: "Consulta Inicial", fr: "Consultation initiale" },
  "process.s1.d": {
    en: "Understand your vision, budget, and requirements.",
    pt: "Compreender a sua visão, orçamento e requisitos.",
    fr: "Comprendre votre vision, votre budget et vos exigences.",
  },
  "process.s2.t": { en: "Site Analysis", pt: "Análise do Local", fr: "Analyse du site" },
  "process.s2.d": {
    en: "Topography, orientation, views, and constraints.",
    pt: "Topografia, orientação, vistas e condicionantes.",
    fr: "Topographie, orientation, vues et contraintes.",
  },
  "process.s3.t": { en: "Design Development", pt: "Desenvolvimento do Design", fr: "Développement du design" },
  "process.s3.d": {
    en: "Collaborative sketching until you love the direction.",
    pt: "Esboços colaborativos até adorar a direção.",
    fr: "Esquisses collaboratives jusqu'à ce que la direction vous plaise.",
  },
  "process.s4.t": { en: "Construction Documents", pt: "Documentos de Construção", fr: "Documents d'exécution" },
  "process.s4.d": {
    en: "Detailed specs: materials, finishes, dimensions.",
    pt: "Especificações detalhadas: materiais, acabamentos, dimensões.",
    fr: "Spécifications détaillées : matériaux, finitions, dimensions.",
  },
  "process.s5.t": { en: "Contractor Selection", pt: "Seleção de Empreiteiro", fr: "Sélection de l'entrepreneur" },
  "process.s5.d": {
    en: "Curated shortlist or your own — we advise either way.",
    pt: "Lista curada ou a sua — aconselhamos em qualquer caso.",
    fr: "Liste restreinte ou la vôtre — nous conseillons dans les deux cas.",
  },
  "process.s6.t": { en: "Construction Admin", pt: "Acompanhamento de Obra", fr: "Suivi de chantier" },
  "process.s6.d": {
    en: "On-site oversight, schedule adherence, budget control.",
    pt: "Supervisão em obra, cumprimento de prazos, controlo orçamental.",
    fr: "Supervision sur site, respect du calendrier, contrôle du budget.",
  },
  "process.s7.t": { en: "Project Completion", pt: "Conclusão do Projeto", fr: "Livraison du projet" },
  "process.s7.d": {
    en: "Final inspection, punch list, handover with pride.",
    pt: "Inspeção final, lista de retoques, entrega com orgulho.",
    fr: "Inspection finale, liste des reprises, remise des clés.",
  },
  "process.aiBadge": { en: "AI-Assisted", pt: "Assistido por IA", fr: "Assisté par IA" },

  // Services list (shared)
  "svc.newhome.t": { en: "New Home Build", pt: "Construção Nova", fr: "Construction neuve" },
  "svc.newhome.d": {
    en: "Ground-up residential design tuned to site, climate, and life.",
    pt: "Habitação de raiz pensada para o local, clima e vida.",
    fr: "Habitation neuve pensée pour le site, le climat et la vie.",
  },
  "svc.remodel.t": { en: "Remodeling", pt: "Remodelação", fr: "Rénovation" },
  "svc.remodel.d": {
    en: "Transformations that honor the bones and rewrite the experience.",
    pt: "Transformações que respeitam a estrutura e reescrevem a experiência.",
    fr: "Des transformations qui respectent la structure et réinventent l'expérience.",
  },
  "svc.addition.t": { en: "Home Additions", pt: "Ampliações", fr: "Extensions" },
  "svc.addition.d": {
    en: "New volumes that read as one with the original structure.",
    pt: "Novos volumes que se leem como um todo com a estrutura original.",
    fr: "De nouveaux volumes en parfaite continuité avec l'existant.",
  },
  "svc.commercial.t": { en: "Commercial", pt: "Comercial", fr: "Commercial" },
  "svc.commercial.d": {
    en: "Restaurants, retail and workplaces designed to be lived in.",
    pt: "Restaurantes, retalho e escritórios pensados para se viverem.",
    fr: "Restaurants, commerces et espaces de travail conçus pour être vécus.",
  },

  // Services overview page
  "services.hero.title": {
    en: "Four disciplines. One studio.",
    pt: "Quatro disciplinas. Um estúdio.",
    fr: "Quatre disciplines. Un studio.",
  },
  "services.hero.subtitle": {
    en: "From ground-up homes to commercial fit-outs — we work where design demands precision.",
    pt: "De casas de raiz a interiores comerciais — trabalhamos onde o design exige precisão.",
    fr: "Des maisons neuves aux aménagements commerciaux — nous intervenons là où le design exige de la précision.",
  },

  // Portfolio
  "portfolio.hero.title": { en: "Selected work.", pt: "Projetos selecionados.", fr: "Projets sélectionnés." },
  "portfolio.hero.subtitle": {
    en: "A small set of representative projects across residential, commercial, and adaptive work.",
    pt: "Um conjunto reduzido de projetos representativos: residencial, comercial e reabilitação.",
    fr: "Une sélection de projets représentatifs : résidentiel, commercial et réhabilitation.",
  },
  "portfolio.filter.all": { en: "All", pt: "Todos", fr: "Tous" },
  "portfolio.filter.residential": { en: "Residential", pt: "Residencial", fr: "Résidentiel" },
  "portfolio.filter.commercial": { en: "Commercial", pt: "Comercial", fr: "Commercial" },
  "portfolio.filter.addition": { en: "Addition", pt: "Ampliação", fr: "Extension" },
  "portfolio.filter.remodel": { en: "Remodel", pt: "Remodelação", fr: "Rénovation" },

  // Process page
  "processPage.hero.title": {
    en: "Seven steps. Zero guesswork.",
    pt: "Sete passos. Zero suposições.",
    fr: "Sept étapes. Aucune approximation.",
  },
  "processPage.hero.subtitle": {
    en: "A methodical pipeline from first conversation to handover. AI accelerates where it adds clarity — never where it dilutes craft.",
    pt: "Um processo metódico, da primeira conversa à entrega. A IA acelera onde traz clareza — nunca onde dilui o ofício.",
    fr: "Un processus méthodique, de la première conversation à la livraison. L'IA accélère là où elle apporte de la clarté — jamais là où elle dilue le métier.",
  },

  // Partners page
  "partnersPage.hero.title": {
    en: "Global expertise. Local precision.",
    pt: "Experiência global. Precisão local.",
    fr: "Expertise globale. Précision locale.",
  },
  "partnersPage.hero.subtitle": {
    en: "Strategic partnerships extend our reach across continents while keeping every project tightly held by our studio.",
    pt: "Parcerias estratégicas alargam o nosso alcance entre continentes, mantendo cada projeto firmemente conduzido pelo estúdio.",
    fr: "Des partenariats stratégiques étendent notre portée à travers les continents tout en gardant chaque projet fermement piloté par le studio.",
  },
  "partnersPage.network.eyebrow": { en: "Studio Network", pt: "Rede do Estúdio", fr: "Réseau du studio" },
  "partnersPage.network.title": {
    en: "A small network of studios we trust on every continent we work.",
    pt: "Uma pequena rede de estúdios em quem confiamos em cada continente onde trabalhamos.",
    fr: "Un petit réseau de studios de confiance sur chaque continent où nous travaillons.",
  },
  "partnersPage.network.body": {
    en: "We collaborate with structural engineers, landscape architects, lighting consultants, and contractors across Europe and the Americas. Partner studios are added carefully — we'd rather work with fewer people, longer.",
    pt: "Colaboramos com engenheiros estruturais, arquitetos paisagistas, consultores de iluminação e empreiteiros na Europa e nas Américas. Os estúdios parceiros são adicionados com cuidado — preferimos trabalhar com menos pessoas, durante mais tempo.",
    fr: "Nous collaborons avec des ingénieurs structure, paysagistes, concepteurs lumière et entrepreneurs en Europe et dans les Amériques. Les studios partenaires sont ajoutés avec soin — nous préférons travailler avec moins de personnes, plus longtemps.",
  },
  "partnersPage.visit": { en: "Visit RoTo Architects →", pt: "Visitar RoTo Architects →", fr: "Visiter RoTo Architects →" },

  // About page
  "about.hero.title": {
    en: "Three partners. Two continents.",
    pt: "Três sócios. Dois continentes.",
    fr: "Trois associés. Deux continents.",
  },
  "about.hero.subtitle": {
    en: "An international architecture and construction studio with offices in Lisbon and California — built around design, technology, and delivery.",
    pt: "Um estúdio internacional de arquitetura e construção com escritórios em Lisboa e na Califórnia — construído em torno do design, tecnologia e entrega.",
    fr: "Un studio international d'architecture et de construction avec des bureaux à Lisbonne et en Californie — fondé sur le design, la technologie et la livraison.",
  },
  "about.philosophy.eyebrow": { en: "Philosophy", pt: "Filosofia", fr: "Philosophie" },
  "about.philosophy.title": {
    en: "Precision is a form of respect.",
    pt: "A precisão é uma forma de respeito.",
    fr: "La précision est une forme de respect.",
  },
  "about.philosophy.p1": {
    en: "We believe architecture is a service before it is an art form. The client is not a brief; the site is not an obstacle. Both deserve careful, honest work — and the best buildings come from taking that seriously over years.",
    pt: "Acreditamos que a arquitetura é um serviço antes de ser uma forma de arte. O cliente não é um briefing; o terreno não é um obstáculo. Ambos merecem trabalho cuidado e honesto — e os melhores edifícios nascem de levar isso a sério durante anos.",
    fr: "Nous croyons que l'architecture est un service avant d'être un art. Le client n'est pas un brief ; le site n'est pas un obstacle. Tous deux méritent un travail soigné et honnête — les meilleurs bâtiments naissent quand on prend cela au sérieux sur la durée.",
  },
  "about.philosophy.p2": {
    en: "We use AI and computational tools because they expand the option space and compress the cost of asking \"what if\". They do not replace judgement. Every line is still drawn by an architect with a license and a conscience.",
    pt: "Usamos IA e ferramentas computacionais porque alargam o leque de opções e reduzem o custo de perguntar \"e se?\". Não substituem o julgamento. Cada traço é desenhado por um arquiteto com licença e consciência.",
    fr: "Nous utilisons l'IA et les outils computationnels parce qu'ils élargissent le champ des possibles et réduisent le coût du « et si ? ». Ils ne remplacent pas le jugement. Chaque trait est tracé par un architecte agréé et consciencieux.",
  },
  "about.philosophy.p3": {
    en: "We work between Europe and America because good clients exist in both, and because crossing borders keeps the practice honest about what is universal and what is local.",
    pt: "Trabalhamos entre a Europa e a América porque há bons clientes em ambos os lados, e porque atravessar fronteiras mantém a prática honesta sobre o que é universal e o que é local.",
    fr: "Nous travaillons entre l'Europe et l'Amérique parce qu'il existe de bons clients des deux côtés, et parce que traverser les frontières garde la pratique honnête sur ce qui est universel et ce qui est local.",
  },
  "about.team.eyebrow": { en: "The Partners", pt: "Os Sócios", fr: "Les associés" },
  "about.team.title": { en: "Who we are", pt: "Quem somos", fr: "Qui nous sommes" },

  // Contact page
  "contact.hero.eyebrow": { en: "Begin", pt: "Começar", fr: "Commencer" },
  "contact.hero.title": {
    en: "Tell us about your project.",
    pt: "Conte-nos sobre o seu projeto.",
    fr: "Parlez-nous de votre projet.",
  },
  "contact.studio": { en: "Studio", pt: "Estúdio", fr: "Studio" },
  "contact.body": {
    en: "Initial consultations are complimentary. We respond within one business day. For active project inquiries, attach a brief or share a few reference images — it helps us prepare.",
    pt: "As consultas iniciais são gratuitas. Respondemos no prazo de um dia útil. Para projetos em curso, anexe um briefing ou partilhe algumas imagens de referência — ajuda-nos a preparar.",
    fr: "Les consultations initiales sont gratuites. Nous répondons sous un jour ouvré. Pour des projets en cours, joignez un brief ou partagez quelques images de référence — cela nous aide à préparer.",
  },
  "contact.email": { en: "Email", pt: "Email", fr: "Email" },
  "contact.locations": { en: "Locations", pt: "Localizações", fr: "Lieux" },
  "contact.field.name": { en: "Name", pt: "Nome", fr: "Nom" },
  "contact.field.email": { en: "Email", pt: "Email", fr: "Email" },
  "contact.field.phone": { en: "Phone", pt: "Telefone", fr: "Téléphone" },
  "contact.field.service": { en: "Service", pt: "Serviço", fr: "Service" },
  "contact.field.budget": { en: "Budget Range", pt: "Orçamento", fr: "Budget" },
  "contact.field.brief": { en: "Project Brief", pt: "Descrição do Projeto", fr: "Description du projet" },
  "contact.field.briefPlaceholder": {
    en: "Tell us about the site, the program, the timing, and what success looks like.",
    pt: "Conte-nos sobre o local, o programa, os prazos e o que significa sucesso.",
    fr: "Parlez-nous du site, du programme, du calendrier et de ce qui définit la réussite.",
  },
  "contact.select": { en: "Select…", pt: "Selecionar…", fr: "Sélectionner…" },
  "contact.success.eyebrow": { en: "Received", pt: "Recebido", fr: "Reçu" },
  "contact.success.title": { en: "Thank you.", pt: "Obrigado.", fr: "Merci." },
  "contact.success.body": {
    en: "Your inquiry has been logged. A partner will reach out within one business day.",
    pt: "O seu pedido foi registado. Um sócio entrará em contacto no prazo de um dia útil.",
    fr: "Votre demande a été enregistrée. Un associé vous contactera sous un jour ouvré.",
  },
  "contact.toast.success": {
    en: "Message received. We'll be in touch within one business day.",
    pt: "Mensagem recebida. Entraremos em contacto no prazo de um dia útil.",
    fr: "Message reçu. Nous reviendrons vers vous sous un jour ouvré.",
  },
} as const;

export type TranslationKey = keyof typeof translations;
