export type Lang = "en" | "pt" | "fr" | "ru";

export const LANGUAGES: { code: Lang; label: string; full: string }[] = [
  { code: "en", label: "EN", full: "English" },
  { code: "pt", label: "PT", full: "Português" },
  { code: "fr", label: "FR", full: "Français" },
  { code: "ru", label: "RU", full: "Русский" },
];

export const translations = {
  // Header / Nav
  "nav.services": { en: "Services", pt: "Serviços", fr: "Services", ru: "Услуги" },
  "nav.process": { en: "Process", pt: "Processo", fr: "Processus", ru: "Процесс" },
  "nav.portfolio": { en: "Portfolio", pt: "Portefólio", fr: "Portfolio", ru: "Портфолио" },
  "nav.about": { en: "About", pt: "Sobre", fr: "À propos", ru: "О нас" },
  "nav.partners": { en: "Partners", pt: "Parceiros", fr: "Partenaires", ru: "Партнёры" },
  "nav.book": { en: "Book Consultation", pt: "Marcar Consulta", fr: "Réserver une consultation", ru: "Записаться на консультацию" },

  // Footer
  "footer.tagline": {
    en: "Architecture engineered for tomorrow. Licensed California architect. Lisbon · California · International.",
    pt: "Arquitetura concebida para o futuro. Arquiteto licenciado na Califórnia. Lisboa · Califórnia · Internacional.",
    fr: "Architecture conçue pour demain. Architecte agréé en Californie. Lisbonne · Californie · International.",
    ru: "Архитектура для завтрашнего дня. Лицензированный архитектор Калифорнии. Лиссабон · Калифорния · Мир.",
  },
  "footer.services": { en: "Services", pt: "Serviços", fr: "Services", ru: "Услуги" },
  "footer.studio": { en: "Studio", pt: "Estúdio", fr: "Studio", ru: "Студия" },
  "footer.contact": { en: "Contact", pt: "Contacto", fr: "Contact", ru: "Контакты" },
  "footer.dashboard": { en: "Studio Dashboard", pt: "Painel do Estúdio", fr: "Tableau de bord", ru: "Панель студии" },
  "footer.requestConsult": { en: "Request Consultation →", pt: "Pedir Consulta →", fr: "Demander une consultation →", ru: "Запросить консультацию →" },
  "footer.rights": {
    en: "Pedra & Luz · Licensed California Architect · All Rights Reserved",
    pt: "Pedra & Luz · Arquiteto Licenciado na Califórnia · Todos os Direitos Reservados",
    fr: "Pedra & Luz · Architecte Agréé en Californie · Tous Droits Réservés",
    ru: "Pedra & Luz · Лицензированный архитектор Калифорнии · Все права защищены",
  },
  "footer.locations": {
    en: "Lisbon · California · International",
    pt: "Lisboa · Califórnia · Internacional",
    fr: "Lisbonne · Californie · International",
    ru: "Лиссабон · Калифорния · Мир",
  },

  // Common CTAs
  "cta.exploreWork": { en: "Explore Our Work", pt: "Ver os Nossos Projetos", fr: "Découvrir nos projets", ru: "Наши проекты" },
  "cta.seeProcess": { en: "See The Process →", pt: "Ver o Processo →", fr: "Voir le processus →", ru: "Узнать процесс →" },
  "cta.allServices": { en: "All services →", pt: "Todos os serviços →", fr: "Tous les services →", ru: "Все услуги →" },
  "cta.exploreService": { en: "Explore Service", pt: "Ver Serviço", fr: "Voir le service", ru: "Подробнее" },
  "cta.viewCaseStudy": { en: "View Case Study", pt: "Ver Estudo de Caso", fr: "Voir le projet", ru: "Смотреть проект" },
  "cta.readPartners": { en: "Read about our partnerships →", pt: "Sobre as nossas parcerias →", fr: "À propos de nos partenariats →", ru: "О наших партнёрствах →" },
  "cta.requestConsultation": { en: "Request Consultation", pt: "Pedir Consulta", fr: "Demander une consultation", ru: "Запросить консультацию" },

  // Home — hero
  "home.hero.eyebrow": {
    en: "Licensed California Architect · Lisbon · International",
    pt: "Arquiteto Licenciado na Califórnia · Lisboa · Internacional",
    fr: "Architecte Agréé en Californie · Lisbonne · International",
    ru: "Лицензированный архитектор Калифорнии · Лиссабон · Мир",
  },
  "home.hero.title": {
    en: "Architecture Built\nfor the Way\nYou Live.",
    pt: "Arquitetura Feita\npara a Forma\ncomo Vive.",
    fr: "Une architecture\nfaite pour votre\nfaçon de vivre.",
    ru: "Архитектура, построенная\nдля того, как вы живёте.",
  },
  "home.hero.subtitle": {
    en: "From concept to construction — precision-engineered design for residential, commercial, and transformation projects.",
    pt: "Do conceito à construção — design rigoroso para projetos residenciais, comerciais e de transformação.",
    fr: "De la conception à la construction — un design rigoureux pour des projets résidentiels, commerciaux et de transformation.",
    ru: "От концепции до строительства — точный, инженерный подход к жилым, коммерческим и трансформационным проектам.",
  },

  // Home — sections
  "home.stats.years": { en: "Years Practice", pt: "Anos de Prática", fr: "Années d'expérience", ru: "Годы практики" },
  "home.stats.projects": { en: "Projects Delivered", pt: "Projetos Entregues", fr: "Projets livrés", ru: "Проекты выполнены" },
  "home.stats.lines": { en: "Service Lines", pt: "Áreas de Serviço", fr: "Domaines de service", ru: "Линии услуг" },
  "home.stats.markets": { en: "Markets Served", pt: "Mercados Servidos", fr: "Marchés desservis", ru: "Рынки обслуживаемые" },

  "home.services.eyebrow": { en: "What We Do", pt: "O Que Fazemos", fr: "Ce que nous faisons", ru: "Что мы делаем" },
  "home.services.title": {
    en: "Four disciplines.\nOne studio.",
    pt: "Quatro disciplinas.\nUm estúdio.",
    fr: "Quatre disciplines.\nUn studio.",
    ru: "Четыре дисциплины.\nОдин студий.",
  },

  "home.process.eyebrow": { en: "The Process", pt: "O Processo", fr: "Le processus", ru: "Процесс" },
  "home.process.title": {
    en: "Seven steps.\nZero guesswork.",
    pt: "Sete passos.\nZero suposições.",
    fr: "Sept étapes.\nAucune approximation.",
    ru: "Семь шагов.\nНоль догадок.",
  },

  "home.featured.eyebrow": { en: "Featured Project", pt: "Projeto em Destaque", fr: "Projet phare", ru: "Проект в фокусе" },
  "home.featured.type": { en: "Type", pt: "Tipo", fr: "Type", ru: "Тип" },
  "home.featured.location": { en: "Location", pt: "Localização", fr: "Lieu", ru: "Местоположение" },
  "home.featured.year": { en: "Year", pt: "Ano", fr: "Année", ru: "Год" },

  "home.partner.eyebrow": { en: "Strategic Partnership", pt: "Parceria Estratégica", fr: "Partenariat stratégique", ru: "Стратегическое партнерство" },
  "home.partner.title": {
    en: "Global expertise.\nLocal precision.",
    pt: "Experiência global.\nPrecisão local.",
    fr: "Expertise globale.\nPrécision locale.",
    ru: "Глобальные знания.\nЛокальная точность.",
  },
  "home.partner.label": { en: "Strategic Partner", pt: "Parceiro Estratégico", fr: "Partenaire stratégique", ru: "Стратегический партнёр" },
  "home.partner.body": {
    en: "Founded by Michael Rotondi — SCI-Arc co-founder and one of America's most influential architectural minds. Our collaboration bridges American innovation with European precision, delivering projects that transcend borders.",
    pt: "Fundada por Michael Rotondi — cofundador do SCI-Arc e uma das mentes arquitetónicas mais influentes dos EUA. A nossa colaboração liga a inovação americana à precisão europeia, entregando projetos que transcendem fronteiras.",
    fr: "Fondé par Michael Rotondi — cofondateur du SCI-Arc et l'un des esprits architecturaux les plus influents des États-Unis. Notre collaboration lie l'innovation américaine à la précision européenne pour des projets qui transcendent les frontières.",
    ru: "Основана Майклом Ротонди — соучредителем SCI-Arc и одним из самых влиятельных архитектурных умов США. Наша коллаборация соединяет американскую инновацию с европейской точностью, предлагая проекты, которые выходят за пределы границ.",
  },

  "home.team.eyebrow": { en: "The Team", pt: "A Equipa", fr: "L'équipe", ru: "Команда" },
  "home.team.title": {
    en: "Architects. Operators. Builders.",
    pt: "Arquitetos. Operadores. Construtores.",
    fr: "Architectes. Opérateurs. Bâtisseurs.",
    ru: "Архитекторы. Операторы. Строители.",
  },

  "home.tech.eyebrow": { en: "Studio Intelligence", pt: "Inteligência do Estúdio", fr: "Intelligence du studio", ru: "Интеллект студии" },
  "home.tech.title": {
    en: "We don't just design.\nWe compute.",
    pt: "Não só desenhamos.\nCalculamos.",
    fr: "Nous ne dessinons pas.\nNous calculons.",
    ru: "Мы не просто проектируем.\nМы вычисляем.",
  },
  "home.tech.aiTitle": { en: "AI-Accelerated Design", pt: "Design Acelerado por IA", fr: "Conception accélérée par IA", ru: "AI-ускоренный дизайн" },
  "home.tech.aiBody": {
    en: "Generative tools that produce 10× more concept variations in the time it used to take to sketch three. Your brief becomes 50 explorations overnight.",
    pt: "Ferramentas generativas que produzem 10× mais variações de conceito no tempo que antes dava para esboçar três. O seu briefing torna-se 50 explorações numa só noite.",
    fr: "Des outils génératifs qui produisent 10× plus de variantes en moins de temps qu'il n'en fallait pour en esquisser trois. Votre brief devient 50 explorations en une nuit.",
    ru: "Генеративные инструменты, которые создают 10 раз больше вариантов концепции за то время, что раньше уходило на рисование трёх. Ваше задание превращается в 50 экспериментов за одну ночь.",
  },
  "home.tech.cyclesTitle": { en: "Compressed Cycles", pt: "Ciclos Comprimidos", fr: "Cycles compressés", ru: "Сжатые циклы" },
  "home.tech.cyclesBody": {
    en: "Real-time material procurement, automated supplier quote aggregation, and workforce scheduling that eliminate the coordination tax.",
    pt: "Aquisição de materiais em tempo real, agregação automática de cotações e gestão de equipas que eliminam o custo de coordenação.",
    fr: "Approvisionnement en temps réel, agrégation automatisée des devis fournisseurs, et planification des équipes qui éliminent les frictions de coordination.",
    ru: "Реальное время закупка материалов, автоматическая агрегация предложений поставщиков и планирование рабочей силы, что устраняет налог на координацию.",
  },
  "home.tech.liveTitle": { en: "Live Project Intelligence", pt: "Inteligência de Projeto em Tempo Real", fr: "Suivi de projet en direct", ru: "Интеллектуальное управление проектом" },
  "home.tech.liveBody": {
    en: "Clients get a dedicated dashboard showing progress, milestone completion, budget tracking, and document access — 24/7, no calls needed.",
    pt: "Os clientes acedem a um painel dedicado com progresso, marcos, acompanhamento de orçamento e documentos — 24/7, sem precisar de telefonemas.",
    fr: "Les clients disposent d'un tableau de bord dédié : progression, jalons, suivi budgétaire et documents — 24/7, sans appels.",
    ru: "Клиенты получают отдельный дашборд, показывающий прогресс, выполнение этапов, бюджет и доступ к документам — 24/7, без звонков.",
  },

  "home.cta.eyebrow": { en: "Begin", pt: "Começar", fr: "Commencer", ru: "Начать" },
  "home.cta.title": {
    en: "Tell us about your project.",
    pt: "Conte-nos sobre o seu projeto.",
    fr: "Parlez-nous de votre projet.",
    ru: "Расскажите нам о вашем проекте.",
  },
  "home.cta.body": {
    en: "Initial consultations are complimentary. We respond within one business day.",
    pt: "As consultas iniciais são gratuitas. Respondemos no prazo de um dia útil.",
    fr: "Les consultations initiales sont gratuites. Nous répondons sous un jour ouvré.",
    ru: "Первичные консультации бесплатны. Мы отвечаем в течение одного рабочего дня.",
  },

  // Process steps (titles + descriptions)
  "process.s1.t": { en: "Initial Consultation", pt: "Consulta Inicial", fr: "Consultation initiale", ru: "Первичная консультация" },
  "process.s1.d": {
    en: "Understand your vision, budget, and requirements.",
    pt: "Compreender a sua visão, orçamento e requisitos.",
    fr: "Comprendre votre vision, votre budget et vos exigences.",
    ru: "Понять вашу цель, бюджет и требования.",
  },
  "process.s2.t": { en: "Site Analysis", pt: "Análise do Local", fr: "Analyse du site", ru: "Анализ местности" },
  "process.s2.d": {
    en: "Topography, orientation, views, and constraints.",
    pt: "Topografia, orientação, vistas e condicionantes.",
    fr: "Topographie, orientation, vues et contraintes.",
    ru: "Топография, ориентация, виды и ограничения.",
  },
  "process.s3.t": { en: "Design Development", pt: "Desenvolvimento do Design", fr: "Développement du design", ru: "Разработка дизайна" },
  "process.s3.d": {
    en: "Collaborative sketching until you love the direction.",
    pt: "Esboços colaborativos até adorar a direção.",
    fr: "Esquisses collaboratives jusqu'à ce que la direction vous plaise.",
    ru: "Коллаборативное рисование до того, пока вы не любите направление.",
  },
  "process.s4.t": { en: "Construction Documents", pt: "Documentos de Construção", fr: "Documents d'exécution", ru: "Документы строительства" },
  "process.s4.d": {
    en: "Detailed specs: materials, finishes, dimensions.",
    pt: "Especificações detalhadas: materiais, acabamentos, dimensões.",
    fr: "Spécifications détaillées : matériaux, finitions, dimensions.",
    ru: "Подробные спецификации: материалы, отделка, размеры.",
  },
  "process.s5.t": { en: "Contractor Selection", pt: "Seleção de Empreiteiro", fr: "Sélection de l'entrepreneur", ru: "Выбор подрядчика" },
  "process.s5.d": {
    en: "Curated shortlist or your own — we advise either way.",
    pt: "Lista curada ou a sua — aconselhamos em qualquer caso.",
    fr: "Liste restreinte ou la vôtre — nous conseillons dans les deux cas.",
    ru: "Компетентный список или ваш — мы советуем в любом случае.",
  },
  "process.s6.t": { en: "Construction Admin", pt: "Acompanhamento de Obra", fr: "Suivi de chantier", ru: "Управление строительством" },
  "process.s6.d": {
    en: "On-site oversight, schedule adherence, budget control.",
    pt: "Supervisão em obra, cumprimento de prazos, controlo orçamental.",
    fr: "Supervision sur site, respect du calendrier, contrôle du budget.",
    ru: "Наблюдение на месте, соблюдение графика, бюджетный контроль.",
  },
  "process.s7.t": { en: "Project Completion", pt: "Conclusão do Projeto", fr: "Livraison du projet", ru: "Завершение проекта" },
  "process.s7.d": {
    en: "Final inspection, punch list, handover with pride.",
    pt: "Inspeção final, lista de retoques, entrega com orgulho.",
    fr: "Inspection finale, liste des reprises, remise des clés.",
    ru: "Финальная проверка, список исправлений, передача с гордостью.",
  },
  "process.aiBadge": { en: "AI-Assisted", pt: "Assistido por IA", fr: "Assisté par IA", ru: "Помощь ИИ" },

  // Services list (shared)
  "svc.newhome.t": { en: "New Home Build", pt: "Construção Nova", fr: "Construction neuve", ru: "Новая домашняя постройка" },
  "svc.newhome.d": {
    en: "Ground-up residential design tuned to site, climate, and life.",
    pt: "Habitação de raiz pensada para o local, clima e vida.",
    fr: "Habitation neuve pensée pour le site, le climat et la vie.",
    ru: "Проектирование жилого дома, адаптированное под местность, климат и жизнь.",
  },
  "svc.remodel.t": { en: "Remodeling", pt: "Remodelação", fr: "Rénovation", ru: "Ремонт" },
  "svc.remodel.d": {
    en: "Transformations that honor the bones and rewrite the experience.",
    pt: "Transformações que respeitam a estrutura e reescrevem a experiência.",
    fr: "Des transformations qui respectent la structure et réinventent l'expérience.",
    ru: "Трансформации, которые уважают основы и переписывают опыт.",
  },
  "svc.addition.t": { en: "Home Additions", pt: "Ampliações", fr: "Extensions", ru: "Дополнения к дому" },
  "svc.addition.d": {
    en: "New volumes that read as one with the original structure.",
    pt: "Novos volumes que se leem como um todo com a estrutura original.",
    fr: "De nouveaux volumes en parfaite continuité avec l'existant.",
    ru: "Новые объемы, которые читаются как единое целое с оригинальной конструкцией.",
  },
  "svc.commercial.t": { en: "Commercial", pt: "Comercial", fr: "Commercial", ru: "Коммерческий" },
  "svc.commercial.d": {
    en: "Restaurants, retail and workplaces designed to be lived in.",
    pt: "Restaurantes, retalho e escritórios pensados para se viverem.",
    fr: "Restaurants, commerces et espaces de travail conçus pour être vécus.",
    ru: "Рестораны, розничные магазины и рабочие пространства, спроектированные для проживания.",
  },

  // Services overview page
  "services.hero.title": {
    en: "Four disciplines. One studio.",
    pt: "Quatro disciplinas. Um estúdio.",
    fr: "Quatre disciplines. Un studio.",
    ru: "Четыре дисциплины. Один студий.",
  },
  "services.hero.subtitle": {
    en: "From ground-up homes to commercial fit-outs — we work where design demands precision.",
    pt: "De casas de raiz a interiores comerciais — trabalhamos onde o design exige precisão.",
    fr: "Des maisons neuves aux aménagements commerciaux — nous intervenons là où le design exige de la précision.",
    ru: "От новых домов до коммерческих интерьеров — мы работаем там, где дизайн требует точности.",
  },

  // Portfolio
  "portfolio.hero.title": { en: "Selected work.", pt: "Projetos selecionados.", fr: "Projets sélectionnés.", ru: "Выбранные работы." },
  "portfolio.hero.subtitle": {
    en: "A small set of representative projects across residential, commercial, and adaptive work.",
    pt: "Um conjunto reduzido de projetos representativos: residencial, comercial e reabilitação.",
    fr: "Une sélection de projets représentatifs : résidentiel, commercial et réhabilitation.",
    ru: "Малый набор представительных проектов в жилом, коммерческом и адаптивном строительстве.",
  },
  "portfolio.filter.all": { en: "All", pt: "Todos", fr: "Tous", ru: "Все" },
  "portfolio.filter.residential": { en: "Residential", pt: "Residencial", fr: "Résidentiel", ru: "Жилой" },
  "portfolio.filter.commercial": { en: "Commercial", pt: "Comercial", fr: "Commercial", ru: "Коммерческий" },
  "portfolio.filter.addition": { en: "Addition", pt: "Ampliação", fr: "Extension", ru: "Дополнение" },
  "portfolio.filter.remodel": { en: "Remodel", pt: "Remodelação", fr: "Rénovation", ru: "Ремонт" },

  // Process page
  "processPage.hero.title": {
    en: "Seven steps. Zero guesswork.",
    pt: "Sete passos. Zero suposições.",
    fr: "Sept étapes. Aucune approximation.",
    ru: "Семь шагов. Ноль догадок.",
  },
  "processPage.hero.subtitle": {
    en: "A methodical pipeline from first conversation to handover. AI accelerates where it adds clarity — never where it dilutes craft.",
    pt: "Um processo metódico, da primeira conversa à entrega. A IA acelera onde traz clareza — nunca onde dilui o ofício.",
    fr: "Un processus méthodique, de la première conversation à la livraison. L'IA accélère là où elle apporte de la clarté — jamais là où elle dilue le métier.",
    ru: "Методичный процесс от первой встречи до передачи. ИИ ускоряет там, где приносит ясность — никогда там, где размывает мастерство.",
  },

  // Partners page
  "partnersPage.hero.title": {
    en: "Global expertise. Local precision.",
    pt: "Experiência global. Precisão local.",
    fr: "Expertise globale. Précision locale.",
    ru: "Глобальные знания. Локальная точность.",
  },
  "partnersPage.hero.subtitle": {
    en: "Strategic partnerships extend our reach across continents while keeping every project tightly held by our studio.",
    pt: "Parcerias estratégicas alargam o nosso alcance entre continentes, mantendo cada projeto firmemente conduzido pelo estúdio.",
    fr: "Des partenariats stratégiques étendent notre portée à travers les continents tout en gardant chaque projet fermement piloté par le studio.",
    ru: "Стратегические партнерства расширяют нашу географию, сохраняя каждый проект под контролем студии.",
  },
  "partnersPage.network.eyebrow": { en: "Studio Network", pt: "Rede do Estúdio", fr: "Réseau du studio", ru: "Сеть студий" },
  "partnersPage.network.title": {
    en: "A small network of studios we trust on every continent we work.",
    pt: "Uma pequena rede de estúdios em quem confiamos em cada continente onde trabalhamos.",
    fr: "Un petit réseau de studios de confiance sur chaque continent où nous travaillons.",
    ru: "Малая сеть студий, в которых мы доверяем на каждом континенте, где работаем.",
  },
  "partnersPage.network.body": {
    en: "We collaborate with structural engineers, landscape architects, lighting consultants, and contractors across Europe and the Americas. Partner studios are added carefully — we'd rather work with fewer people, longer.",
    pt: "Colaboramos com engenheiros estruturais, arquitetos paisagistas, consultores de iluminação e empreiteiros na Europa e nas Américas. Os estúdios parceiros são adicionados com cuidado — preferimos trabalhar com menos pessoas, durante mais tempo.",
    fr: "Nous collaborons avec des ingénieurs structure, paysagistes, concepteurs lumière et entrepreneurs en Europe et dans les Amériques. Les studios partenaires sont ajoutés avec soin — nous préférons travailler avec moins de personnes, plus longtemps.",
    ru: "Мы сотрудничаем с инженерами-строителями, ландшафтными архитекторами, консультантами по освещению и подрядчиками по всей Европе и Америке. Партнерские студии добавляются с осторожностью — мы предпочитаем работать с меньшим количеством людей, дольше.",
  },
  "partnersPage.visit": { en: "Visit RoTo Architects →", pt: "Visitar RoTo Architects →", fr: "Visiter RoTo Architects →", ru: "Посетить RoTo Architects →" },

  // About page
  "about.hero.title": {
    en: "Three partners. Two continents.",
    pt: "Três sócios. Dois continentes.",
    fr: "Trois associés. Deux continents.",
    ru: "Три партнёра. Два континента.",
  },
  "about.hero.subtitle": {
    en: "An international architecture and construction studio with offices in Lisbon and California — built around design, technology, and delivery.",
    pt: "Um estúdio internacional de arquitetura e construção com escritórios em Lisboa e na Califórnia — construído em torno do design, tecnologia e entrega.",
    fr: "Un studio international d'architecture et de construction avec des bureaux à Lisbonne et en Californie — fondé sur le design, la technologie et la livraison.",
    ru: "Международный архитектурно-строительный студий с офисами в Лиссабоне и Калифорнии — построен вокруг дизайна, технологий и доставки.",
  },
  "about.philosophy.eyebrow": { en: "Philosophy", pt: "Filosofia", fr: "Philosophie", ru: "Философия" },
  "about.philosophy.title": {
    en: "Precision is a form of respect.",
    pt: "A precisão é uma forma de respeito.",
    fr: "La précision est une forme de respect.",
    ru: "Точность — это форма уважения.",
  },
  "about.philosophy.p1": {
    en: "We believe architecture is a service before it is an art form. The client is not a brief; the site is not an obstacle. Both deserve careful, honest work — and the best buildings come from taking that seriously over years.",
    pt: "Acreditamos que a arquitetura é um serviço antes de ser uma forma de arte. O cliente não é um briefing; o terreno não é um obstáculo. Ambos merecem trabalho cuidado e honesto — e os melhores edifícios nascem de levar isso a sério durante anos.",
    fr: "Nous croyons que l'architecture est un service avant d'être un art. Le client n'est pas un brief ; le site n'est pas un obstacle. Tous deux méritent un travail soigné et honnête — les meilleurs bâtiments naissent quand on prend cela au sérieux sur la durée.",
    ru: "Мы считаем, что архитектура — это услуга до того, как она становится искусством. Клиент — не задание; территория — не препятствие. Оба заслуживают тщательной, честной работы — и лучшие здания рождаются, когда это берётся серьёзно на протяжении лет.",
  },
  "about.philosophy.p2": {
    en: "We use AI and computational tools because they expand the option space and compress the cost of asking \"what if\". They do not replace judgement. Every line is still drawn by an architect with a license and a conscience.",
    pt: "Usamos IA e ferramentas computacionais porque alargam o leque de opções e reduzem o custo de perguntar \"e se?\". Não substituem o julgamento. Cada traço é desenhado por um arquiteto com licença e consciência.",
    fr: "Nous utilisons l'IA et les outils computationnels parce qu'ils élargissent le champ des possibles et réduisent le coût du « et si ? ». Ils ne remplacent pas le jugement. Chaque trait est tracé par un architecte agréé et consciencieux.",
    ru: "Мы используем ИИ и вычислительные инструменты, потому что они расширяют пространство возможностей и сокращают стоимость вопроса «а что если?». Они не заменяют суждение. Каждая линия всё ещё рисуется архитектором с лицензией и совестью.",
  },
  "about.philosophy.p3": {
    en: "We work between Europe and America because good clients exist in both, and because crossing borders keeps the practice honest about what is universal and what is local.",
    pt: "Trabalhamos entre a Europa e a América porque há bons clientes em ambos os lados, e porque atravessar fronteiras mantém a prática honesta sobre o que é universal e o que é local.",
    fr: "Nous travaillons entre l'Europe et l'Amérique parce qu'il existe de bons clients des deux côtés, et parce que traverser les frontières garde la pratique honnête sur ce qui est universel et ce qui est local.",
    ru: "Мы работаем между Европой и Америкой, потому что хороших клиентов есть в обоих регионах, и потому что пересечение границ сохраняет практику честной относительно того, что универсально и что местно.",
  },
  "about.team.eyebrow": { en: "The Partners", pt: "Os Sócios", fr: "Les associés", ru: "Партнёры" },
  "about.team.title": { en: "Who we are", pt: "Quem somos", fr: "Qui nous sommes", ru: "Кто мы" },

  // Contact page
  "contact.hero.eyebrow": { en: "Begin", pt: "Começar", fr: "Commencer", ru: "Начать" },
  "contact.hero.title": {
    en: "Tell us about your project.",
    pt: "Conte-nos sobre o seu projeto.",
    fr: "Parlez-nous de votre projet.",
    ru: "Расскажите нам о вашем проекте.",
  },
  "contact.studio": { en: "Studio", pt: "Estúdio", fr: "Studio", ru: "Студия" },
  "contact.body": {
    en: "Initial consultations are complimentary. We respond within one business day. For active project inquiries, attach a brief or share a few reference images — it helps us prepare.",
    pt: "As consultas iniciais são gratuitas. Respondemos no prazo de um dia útil. Para projetos em curso, anexe um briefing ou partilhe algumas imagens de referência — ajuda-nos a preparar.",
    fr: "Les consultations initiales sont gratuites. Nous répondons sous un jour ouvré. Pour des projets en cours, joignez un brief ou partagez quelques images de référence — cela nous aide à préparer.",
    ru: "Первичные консультации бесплатны. Мы отвечаем в течение одного рабочего дня. Для активных проектных запросов, прикрепите задание или поделитесь несколькими образцами — это поможет нам подготовиться.",
  },
  "contact.email": { en: "Email", pt: "Email", fr: "Email", ru: "Email" },
  "contact.locations": { en: "Locations", pt: "Localizações", fr: "Lieux", ru: "Места" },
  "contact.field.name": { en: "Name", pt: "Nome", fr: "Nom", ru: "Имя" },
  "contact.field.email": { en: "Email", pt: "Email", fr: "Email", ru: "Email" },
  "contact.field.phone": { en: "Phone", pt: "Telefone", fr: "Téléphone", ru: "Телефон" },
  "contact.field.service": { en: "Service", pt: "Serviço", fr: "Service", ru: "Услуга" },
  "contact.field.budget": { en: "Budget Range", pt: "Orçamento", fr: "Budget", ru: "Диапазон бюджета" },
  "contact.field.brief": { en: "Project Brief", pt: "Descrição do Projeto", fr: "Description du projet", ru: "Проектное задание" },
  "contact.field.briefPlaceholder": {
    en: "Tell us about the site, the program, the timing, and what success looks like.",
    pt: "Conte-nos sobre o local, o programa, os prazos e o que significa sucesso.",
    fr: "Parlez-nous du site, du programme, du calendrier et de ce qui définit la réussite.",
    ru: "Расскажите нам о месте, программе, сроках и том, что считается успехом.",
  },
  "contact.select": { en: "Select…", pt: "Selecionar…", fr: "Sélectionner…", ru: "Выбрать…" },
  "contact.success.eyebrow": { en: "Received", pt: "Recebido", fr: "Reçu", ru: "Получено" },
  "contact.success.title": { en: "Thank you.", pt: "Obrigado.", fr: "Merci.", ru: "Спасибо." },
  "contact.success.body": {
    en: "Your inquiry has been logged. A partner will reach out within one business day.",
    pt: "O seu pedido foi registado. Um sócio entrará em contacto no prazo de um dia útil.",
    fr: "Votre demande a été enregistrée. Un associé vous contactera sous un jour ouvré.",
    ru: "Ваш запрос был зафиксирован. Партнёр свяжется с вами в течение одного рабочего дня.",
  },
  "contact.toast.success": {
    en: "Message received. We'll be in touch within one business day.",
    pt: "Mensagem recebida. Entraremos em contacto no prazo de um dia útil.",
    fr: "Message reçu. Nous reviendrons vers vous sous un jour ouvré.",
    ru: "Сообщение получено. Мы свяжемся с вами в течение одного рабочего дня.",
  },
} as const;

export type TranslationKey = keyof typeof translations;
