// ─── DIAGNOSTIC ──────────────────────────────────────────────────────────────
export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'q1',
    question: "Comment se passe la communication avec ton/ta conjoint(e) en ce moment ?",
    questionEN: "How is communication with your spouse going right now?",
    options: [
      { texte: "On se parle normalement, quelques tensions parfois", texteEN: "We talk normally, some tension sometimes", points: 1 },
      { texte: "Les conversations sont souvent tendues ou évitées", texteEN: "Conversations are often tense or avoided", points: 2 },
      { texte: "On ne se parle presque plus, ou seulement pour les nécessités", texteEN: "We barely talk anymore, or only for necessities", points: 3 },
    ],
  },
  {
    id: 'q2',
    question: "Comment décris-tu l'ambiance générale à la maison ?",
    questionEN: "How would you describe the general atmosphere at home?",
    options: [
      { texte: "Globalement bonne, avec des hauts et des bas", texteEN: "Generally good, with ups and downs", points: 1 },
      { texte: "Froide ou tendue la plupart du temps", texteEN: "Cold or tense most of the time", points: 2 },
      { texte: "Très lourde, conflits fréquents ou silence total", texteEN: "Very heavy, frequent conflicts or total silence", points: 3 },
    ],
  },
  {
    id: 'q3',
    question: "Quelle est la fréquence des disputes ou des tensions sérieuses ?",
    questionEN: "How often do serious arguments or tensions occur?",
    options: [
      { texte: "Rarement, et on se réconcilie assez vite", texteEN: "Rarely, and we reconcile fairly quickly", points: 1 },
      { texte: "Plusieurs fois par semaine", texteEN: "Several times a week", points: 2 },
      { texte: "Presque quotidiennement ou conflits non résolus depuis longtemps", texteEN: "Almost daily or unresolved conflicts for a long time", points: 3 },
    ],
  },
  {
    id: 'q4',
    question: "Comment est l'intimité (émotionnelle et physique) entre vous ?",
    questionEN: "How is the intimacy (emotional and physical) between you?",
    options: [
      { texte: "Présente, même si moins intense qu'avant", texteEN: "Present, even if less intense than before", points: 1 },
      { texte: "Rare, on s'est éloignés l'un de l'autre", texteEN: "Rare, we have grown apart", points: 2 },
      { texte: "Quasi absente, on vit presque comme des étrangers", texteEN: "Almost absent, we live almost like strangers", points: 3 },
    ],
  },
  {
    id: 'q5',
    question: "Est-ce que vous priez ensemble ou partagez des moments spirituels ?",
    questionEN: "Do you pray together or share spiritual moments?",
    options: [
      { texte: "Oui, parfois ou régulièrement", texteEN: "Yes, sometimes or regularly", points: 1 },
      { texte: "Très rarement, la spiritualité commune a disparu", texteEN: "Very rarely, the shared spirituality has disappeared", points: 2 },
      { texte: "Non, et le sujet est source de tension", texteEN: "No, and the subject is a source of tension", points: 3 },
    ],
  },
  {
    id: 'q6',
    question: "As-tu pensé à la séparation ou ton/ta conjoint(e) en a-t-il/elle parlé ?",
    questionEN: "Have you thought about separation or has your spouse brought it up?",
    options: [
      { texte: "Non, jamais sérieusement", texteEN: "No, never seriously", points: 1 },
      { texte: "Oui, j'y pense parfois dans les moments difficiles", texteEN: "Yes, I sometimes think about it in difficult moments", points: 2 },
      { texte: "Oui, le sujet a été abordé sérieusement entre nous", texteEN: "Yes, the subject has been seriously discussed between us", points: 3 },
    ],
  },
];

// Calcul du niveau
export const calculerNiveau = (totalPoints) => {
  if (totalPoints <= 9) return 'leger';
  if (totalPoints <= 14) return 'modere';
  return 'grave';
};

export const NIVEAUX = {
  leger: {
    label: 'Léger',
    labelEN: 'Light',
    emoji: '🟡',
    couleur: '#C9A84C',
    couleurLight: '#FBF5E6',
    titre: 'Quelques turbulences',
    titreEN: 'A few bumps in the road',
    description: 'Votre couple a des bases solides. Il y a des tensions, mais rien d\'irréparable. Ce plan va renforcer votre lien et résoudre les petites frictions avant qu\'elles ne s\'installent.',
    descriptionEN: 'Your couple has solid foundations. There are tensions, but nothing irreparable. This plan will strengthen your bond and resolve small frictions before they settle in.',
    encouragement: 'MashaAllah, vous avez la sagesse de travailler sur votre couple avant que les choses ne s\'aggravent. C\'est le signe d\'un amour mature.',
    encouragementEN: 'MashaAllah, you have the wisdom to work on your relationship before things worsen. This is the sign of a mature love.',
  },
  modere: {
    label: 'Modéré',
    labelEN: 'Moderate',
    emoji: '🟠',
    couleur: '#E8843A',
    couleurLight: '#FEF0E7',
    titre: 'Distance émotionnelle',
    titreEN: 'Emotional distance',
    description: 'Vous vous êtes éloignés l\'un de l\'autre. La communication est difficile et l\'intimité s\'est réduite. Ce plan de 40 jours va reconstruire les ponts jour après jour.',
    descriptionEN: 'You have drifted apart. Communication is difficult and intimacy has diminished. This 40-day plan will rebuild bridges day by day.',
    encouragement: 'Il faut du courage pour reconnaître que son couple traverse une période difficile. Ce premier pas est déjà une victoire. Allah aime ceux qui font des efforts.',
    encouragementEN: 'It takes courage to recognize that your relationship is going through a difficult period. This first step is already a victory. Allah loves those who make efforts.',
  },
  grave: {
    label: 'Grave',
    labelEN: 'Serious',
    emoji: '🔴',
    couleur: '#C0392B',
    couleurLight: '#FDEDEC',
    titre: 'Crise profonde',
    titreEN: 'Deep crisis',
    description: 'Votre couple traverse une crise sérieuse. Ce plan intensif de 40 jours demande un engagement total. Il est aussi fortement conseillé de consulter un imam ou un conseiller conjugal en parallèle.',
    descriptionEN: 'Your relationship is going through a serious crisis. This intensive 40-day plan requires total commitment. It is also strongly advised to consult an imam or marriage counselor in parallel.',
    encouragement: 'Même les épreuves les plus lourdes peuvent être surmontées avec sincérité, patience et l\'aide d\'Allah. "Après la difficulté vient la facilité." (Coran 94:5)',
    encouragementEN: 'Even the heaviest trials can be overcome with sincerity, patience and Allah\'s help. "After difficulty comes ease." (Quran 94:5)',
  },
};

// ─── PLANS 40 JOURS ──────────────────────────────────────────────────────────
// Structure : { jour, titreH, actionH, titreF, actionF, verset, psycho,
//               titreHEN, actionHEN, titreFEN, actionFEN, versetEN, psychoEN }

const genererPlan = (niveau) => {
  const plans = {
    leger: [
      // SEMAINE 1 — Revenir aux bases
      {
        jour: 1,
        titreH: "Le premier pas", actionH: "Ce soir, dis à ta femme une chose sincère que tu apprécies chez elle. Pas un compliment habituel — quelque chose de précis.",
        titreF: "Le sourire qui change tout", actionF: "Accueille-le ce soir avec un vrai sourire et une parole douce. Remarque l'effet que ça produit.",
        verset: "Et Il a mis entre vous de l'affection et de la bienveillance. (Coran 30:21)", psycho: "Les expressions de gratitude activent l'ocytocine — l'hormone du lien affectif.",
        titreHEN: "The first step", actionHEN: "Tonight, tell your wife one sincere thing you appreciate about her. Not a usual compliment — something specific.",
        titreFEN: "The smile that changes everything", actionFEN: "Welcome him tonight with a real smile and a gentle word. Notice the effect it produces.",
        versetEN: "And He placed between you affection and mercy. (Quran 30:21)", psychoEN: "Expressions of gratitude activate oxytocin — the bonding hormone.",
      },
      {
        jour: 2,
        titreH: "Écoute active", actionH: "Ce soir, pose ton téléphone, regarde-la dans les yeux et écoute-la parler pendant 10 minutes sans l'interrompre ni préparer ta réponse.",
        titreF: "Parle de toi", actionF: "Partage avec lui un rêve ou une préoccupation que tu gardes pour toi. Ouvre une porte.",
        verset: "Vivez avec elles de façon convenable. (Coran 4:19)", psycho: "Créer un espace de confiance — en écoutant vraiment ou en s'ouvrant sincèrement — est la compétence n°1 des couples épanouis.",
        titreHEN: "Active listening", actionHEN: "Tonight, put your phone down, look her in the eyes and listen to her speak for 10 minutes without interrupting or preparing your answer.",
        titreFEN: "Talk about yourself", actionFEN: "Share with him a dream or concern you've been keeping to yourself. Open a door.",
        versetEN: "Live with them in kindness. (Quran 4:19)", psychoEN: "Creating a space of trust — by truly listening or by opening up sincerely — is the #1 skill of fulfilled couples.",
      },
      {
        jour: 3,
        titreH: "Un petit geste", actionH: "Prépare-lui quelque chose qu'elle aime sans raison particulière. Une surprise, même minime, dit 'tu comptes pour moi'.",
        titreF: "La gratitude exprimée", actionF: "Remercie-le pour quelque chose de concret qu'il fait pour le foyer et que tu tiens pour acquis.",
        verset: "Offrez-vous des cadeaux, vous vous aimerez davantage. (Al-Adab Al-Mufrad)", psycho: "Les petits gestes intentionnels maintiennent la flamme mieux que les grands évènements rares.",
        titreHEN: "A small gesture", actionHEN: "Prepare something she loves for no particular reason. A surprise, even a small one, says 'you matter to me'.",
        titreFEN: "Expressed gratitude", actionFEN: "Thank him for something concrete he does for the home that you take for granted.",
        versetEN: "Give each other gifts and you will love each other more. (Al-Adab Al-Mufrad)", psychoEN: "Small intentional gestures maintain the flame better than rare grand events.",
      },
      {
        jour: 4,
        titreH: "Prière commune", actionH: "Propose-lui de faire 2 rakats ensemble ce soir. Sans pression — avec douceur.",
        titreF: "Dua pour lui", actionF: "Fais dua spécifiquement pour ton mari aujourd'hui. Invoque Allah pour sa réussite et sa guidance.",
        verset: "Notre Seigneur, accorde-nous de nos épouses la joie des yeux. (Coran 25:74)", psycho: "Le partage de rituels spirituels crée une intimité émotionnelle profonde et durable.",
        titreHEN: "Prayer together", actionHEN: "Suggest doing 2 rakats together tonight. Without pressure — with gentleness.",
        titreFEN: "Dua for him", actionFEN: "Make dua specifically for your husband today. Invoke Allah for his success and guidance.",
        versetEN: "Our Lord, grant us from our spouses the joy of our eyes. (Quran 25:74)", psychoEN: "Sharing spiritual rituals creates deep and lasting emotional intimacy.",
      },
      {
        jour: 5,
        titreH: "Aide à la maison", actionH: "Aide spontanément à une tâche ménagère aujourd'hui. Sans qu'on te le demande. Le Prophète ﷺ le faisait.",
        titreF: "Le compliment sincère", actionF: "Dis-lui une qualité que tu admires vraiment chez lui. Sois précise et sincère.",
        verset: "Le meilleur d'entre vous est le meilleur envers sa famille. (Tirmidhi)", psycho: "Reconnaître l'autre — par un service spontané ou un compliment précis — déclenche la gratitude et brise les routines négatives.",
        titreHEN: "Help at home", actionHEN: "Spontaneously help with a household task today. Without being asked. The Prophet ﷺ did this.",
        titreFEN: "The sincere compliment", actionFEN: "Tell him a quality you truly admire in him. Be precise and sincere.",
        versetEN: "The best of you is the best to his family. (Tirmidhi)", psychoEN: "Recognizing the other — through a spontaneous service or a precise compliment — triggers gratitude and breaks negative routines.",
      },
      {
        jour: 6,
        titreH: "Souvenir heureux", actionH: "Rappelle-lui un souvenir heureux de votre couple. 'Tu te souviens quand...' Faites-en revivre un ensemble.",
        titreF: "Soin de soi", actionF: "Prends soin de ton apparence aujourd'hui — pour toi et pour lui. Une femme épanouie rayonne.",
        verset: "Il est une parure pour vous et vous êtes une parure pour lui. (Coran 2:187)", psycho: "Réinjecter du positif dans le couple — par un souvenir heureux ou par le soin qu'on porte à soi — réactive les circuits affectifs et renforce le sentiment d'appartenance.",
        titreHEN: "Happy memory", actionHEN: "Remind her of a happy memory from your couple. 'Do you remember when...' Relive one together.",
        titreFEN: "Self-care", actionFEN: "Take care of your appearance today — for yourself and for him. A fulfilled woman radiates.",
        versetEN: "He is a garment for you and you are a garment for him. (Quran 2:187)", psychoEN: "Reinjecting positivity into the couple — through a happy memory or through self-care — reactivates affective circuits and strengthens the sense of belonging.",
      },
      {
        jour: 7,
        titreH: "Bilan de semaine", actionH: "Ce soir, dis-lui : 'J'ai envie qu'on aille mieux ensemble. Qu'est-ce que je pourrais faire de plus pour toi ?'",
        titreF: "Bilan de semaine", actionF: "Ce soir, dis-lui : 'J'ai envie qu'on soit plus proches. Qu'est-ce qui te ferait vraiment plaisir cette semaine ?'",
        verset: "Et leur consultation entre eux est mutuelle. (Coran 42:38)", psycho: "Demander directement ce dont l'autre a besoin est plus efficace que de deviner.",
        titreHEN: "Week review", actionHEN: "Tonight, say to her: 'I want us to do better together. What could I do more for you?'",
        titreFEN: "Week review", actionFEN: "Tonight, say to him: 'I want us to be closer. What would really make you happy this week?'",
        versetEN: "And their affairs are conducted by mutual consultation. (Quran 42:38)", psychoEN: "Directly asking what the other needs is more effective than guessing.",
      },

      // SEMAINE 2 — Approfondir la communication
      {
        jour: 8,
        titreH: "Sans reproche", actionH: "Aujourd'hui : zéro reproche, zéro critique. Exprime uniquement des besoins avec 'J'aurais besoin de...'",
        titreF: "Sans reproche", actionF: "Aujourd'hui : zéro reproche. Si quelque chose te dérange, transforme-le en demande douce.",
        verset: "Celui qui croit en Allah et au Jour dernier doit dire du bien ou se taire. (Sahih al-Bukhari 6138)", psycho: "Remplacer les critiques par des demandes réduit les réactions défensives de 70%.",
        titreHEN: "Without reproach", actionHEN: "Today: zero reproach, zero criticism. Express only needs with 'I would need...'",
        titreFEN: "Without reproach", actionFEN: "Today: zero reproach. If something bothers you, transform it into a gentle request.",
        versetEN: "Whoever believes in Allah and the Last Day, let him speak good or remain silent. (Sahih al-Bukhari 6138)", psychoEN: "Replacing criticism with requests reduces defensive reactions by 70%.",
      },
      {
        jour: 9,
        titreH: "Sortie en amoureux", actionH: "Organise une sortie simple pour vous deux ce week-end. Une promenade, un café. L'essentiel c'est d'être ensemble.",
        titreF: "Prépare quelque chose de spécial", actionF: "Cuisine un plat qu'il aime ou crée une ambiance particulière à la maison ce soir.",
        verset: "Offrez-vous des cadeaux, vous vous aimerez davantage. (Al-Adab Al-Mufrad)", psycho: "Les expériences partagées hors routine — une sortie ou un repas spécial préparé avec attention — réactivent la dopamine et créent de nouveaux souvenirs ensemble.",
        titreHEN: "A romantic outing", actionHEN: "Plan a simple outing for just the two of you this weekend. A walk, a coffee. Being together is what matters.",
        titreFEN: "Prepare something special", actionFEN: "Cook a dish he loves or create a special atmosphere at home tonight.",
        versetEN: "Give each other gifts and you will love each other more. (Al-Adab Al-Mufrad)", psychoEN: "Shared out-of-routine experiences — an outing or a special meal prepared with care — reactivate dopamine and create new shared memories.",
      },
      {
        jour: 10,
        titreH: "Ses rêves", actionH: "Demande-lui ce qu'elle rêve de faire dans 5 ans. Écoute vraiment. Ne juge pas.",
        titreF: "Ses rêves", actionF: "Demande-lui ce qu'il rêve d'accomplir. Sois son alliée, pas sa critique.",
        verset: "Consulte-les dans l'affaire, puis quand tu as décidé, place ta confiance en Allah. (Coran 3:159)", psycho: "S'intéresser aux projets de l'autre crée un sentiment d'être vu et compris.",
        titreHEN: "Her dreams", actionHEN: "Ask her what she dreams of doing in 5 years. Really listen. Don't judge.",
        titreFEN: "His dreams", actionFEN: "Ask him what he dreams of accomplishing. Be his ally, not his critic.",
        versetEN: "Consult them in the matter. And when you have decided, then rely upon Allah. (Quran 3:159)", psychoEN: "Showing interest in the other's plans creates a feeling of being seen and understood.",
      },
      {
        jour: 11,
        titreH: "Maîtrise ta colère", actionH: "Aujourd'hui, si une tension monte, quitte la pièce 5 minutes avant de répondre. Dis 'Aouthou billahi min al-shaytan'.",
        titreF: "Maîtrise ta colère", actionF: "Aujourd'hui, si tu ressens de l'irritation, fais une pause de 5 minutes avant de parler.",
        verset: "Le fort est celui qui se maîtrise dans la colère. (Bukhari)", psycho: "Un délai de 6 secondes suffit pour que le cortex préfrontal reprenne le contrôle sur l'amygdale.",
        titreHEN: "Control your anger", actionHEN: "Today, if tension rises, leave the room for 5 minutes before responding. Say 'Aouthou billahi min al-shaytan'.",
        titreFEN: "Control your anger", actionFEN: "Today, if you feel irritation, take a 5-minute break before speaking.",
        versetEN: "The strong is the one who controls himself in anger. (Bukhari)", psychoEN: "A 6-second delay is enough for the prefrontal cortex to regain control over the amygdala.",
      },
      {
        jour: 12,
        titreH: "Lettre d'amour", actionH: "Écris-lui un message ou une note de 5 lignes en lui disant ce que tu aimes chez elle. À la main si possible.",
        titreF: "Lettre d'amour", actionF: "Écris-lui un message sincère lui disant pourquoi tu es heureuse de l'avoir épousé.",
        verset: "Lorsqu'un homme aime son frère, qu'il l'informe qu'il l'aime. (Sunan Abi Dawud 5124)", psycho: "L'écriture ancre les émotions positives et oblige à les formuler clairement.",
        titreHEN: "Love letter", actionHEN: "Write her a message or a 5-line note telling her what you love about her. By hand if possible.",
        titreFEN: "Love letter", actionFEN: "Write him a sincere message telling him why you are happy to have married him.",
        versetEN: "When a man loves his brother, he should tell him that he loves him. (Sunan Abi Dawud 5124)", psychoEN: "Writing anchors positive emotions and forces them to be clearly formulated.",
      },
      {
        jour: 13,
        titreH: "Ses besoins non dits", actionH: "Demande-lui : 'Y a-t-il quelque chose que tu attends de moi et que je ne fais pas ?' Écoute sans te défendre.",
        titreF: "Ses besoins non dits", actionF: "Demande-lui : 'Est-ce qu'il y a quelque chose qui te manque dans notre relation ?' Accueille la réponse.",
        verset: "Et elles ont des droits équivalents à leurs obligations. (Coran 2:228)", psycho: "Ouvrir un espace pour les besoins non exprimés prévient les rancœurs qui s'accumulent en silence.",
        titreHEN: "Her unspoken needs", actionHEN: "Ask her: 'Is there something you expect from me that I'm not doing?' Listen without defending yourself.",
        titreFEN: "His unspoken needs", actionFEN: "Ask him: 'Is there something missing in our relationship?' Receive the answer.",
        versetEN: "And they have rights equivalent to their obligations. (Quran 2:228)", psychoEN: "Opening a space for unexpressed needs prevents resentments that accumulate in silence.",
      },
      {
        jour: 14,
        titreH: "Deux semaines — fête ça", actionH: "Félicite-toi et félicite-la. Vous avez fait 2 semaines. Dis-lui que tu es engagé à continuer.",
        titreF: "Deux semaines — fête ça", actionF: "Reconnais le chemin parcouru. Exprime ta joie d'avancer ensemble vers mieux.",
        verset: "Certes, Allah ne modifie pas l'état d'un peuple tant que ceux-ci ne changent pas ce qui est en eux-mêmes. (Coran 13:11)", psycho: "Célébrer les étapes intermédiaires renforce la motivation et crée des points d'ancrage positifs.",
        titreHEN: "Two weeks — celebrate it", actionHEN: "Congratulate yourself and congratulate her. You've done 2 weeks. Tell her you are committed to continuing.",
        titreFEN: "Two weeks — celebrate it", actionFEN: "Acknowledge the journey. Express your joy at moving forward together toward better.",
        versetEN: "Verily, Allah does not change the condition of a people until they change what is within themselves. (Quran 13:11)", psychoEN: "Celebrating intermediate milestones strengthens motivation and creates positive anchor points.",
      },

      // SEMAINE 3-4 : Consolider
      {
        jour: 15,
        titreH: "Toucher affectueux", actionH: "Tiens-lui la main, fais-lui un câlin prolongé aujourd'hui. Le toucher physique libère l'ocytocine.",
        titreF: "Présence physique", actionF: "Rapproche-toi physiquement de lui aujourd'hui — un toucher, un câlin, une présence.",
        verset: "Il est une parure pour vous et vous êtes une parure pour lui. (Coran 2:187)", psycho: "Le toucher physique affectueux réduit le cortisol (stress) et renforce le sentiment de sécurité.",
        titreHEN: "Affectionate touch", actionHEN: "Hold her hand, give her a long hug today. Physical touch releases oxytocin.",
        titreFEN: "Physical presence", actionFEN: "Draw physically closer to him today — a touch, a hug, a presence.",
        versetEN: "He is a garment for you and you are a garment for him. (Quran 2:187)", psychoEN: "Affectionate physical touch reduces cortisol (stress) and strengthens the sense of security.",
      },
      {
        jour: 16,
        titreH: "Dîner sans écrans", actionH: "Ce soir : téléphone dans la poche pendant tout le dîner. Parlez-vous vraiment.",
        titreF: "Dîner sans écrans", actionF: "Ce soir : aucun écran pendant le repas. Crée un espace de connexion réelle.",
        verset: "Et parmi Ses signes est qu'Il a créé pour vous des épouses afin que vous viviez en tranquillité. (Coran 30:21)", psycho: "Les couples qui dînent sans écrans rapportent une satisfaction conjugale 40% plus élevée.",
        titreHEN: "Dinner without screens", actionHEN: "Tonight: phone in pocket throughout dinner. Really talk to each other.",
        titreFEN: "Dinner without screens", actionFEN: "Tonight: no screens during the meal. Create a space for real connection.",
        versetEN: "And among His signs is that He created for you spouses so that you may find tranquility. (Quran 30:21)", psychoEN: "Couples who dine without screens report 40% higher marital satisfaction.",
      },
      {
        jour: 17,
        titreH: "Un compliment précis", actionH: "Dis-lui aujourd'hui un compliment précis qu'elle n'attend pas. Pas 'tu es belle' ou 'tu cuisines bien' — quelque chose comme 'j'aime ta façon de gérer telle chose'. Le détail change tout.",
        titreF: "Parle bien de lui", actionF: "Aujourd'hui, ne dis rien de négatif sur ton mari — ni devant lui, ni derrière lui.",
        verset: "Les croyants et les croyantes sont alliés les uns des autres. (Coran 9:71)", psycho: "Être valorisé(e) ou défendu(e) par son conjoint — par un compliment précis ou une parole bienveillante — crée un sentiment de sécurité et de loyauté profond.",
        titreHEN: "A precise compliment", actionHEN: "Today, give her a precise compliment she doesn't expect. Not 'you're beautiful' or 'you cook well' — something like 'I love how you handle this situation'. The detail makes all the difference.",
        titreFEN: "Speak well of him", actionFEN: "Today, say nothing negative about your husband — neither in front of him nor behind his back.",
        versetEN: "The believing men and women are allies of one another. (Quran 9:71)", psychoEN: "Being valued or defended by your spouse — through a precise compliment or a kind word — creates a deep sense of security and loyalty.",
      },
      {
        jour: 18,
        titreH: "Projet commun", actionH: "Proposez-lui un projet à construire ensemble (voyage, décoration, épargne). Quelque chose qui vous unit vers l'avenir.",
        titreF: "Vision commune", actionF: "Parlez d'un projet de couple ou de famille que vous pourriez construire ensemble.",
        verset: "Consulte-les dans l'affaire, puis quand tu as décidé, place ta confiance en Allah. (Coran 3:159)", psycho: "Avoir des projets communs oriente le couple vers l'avenir et renforce le sentiment d'équipe.",
        titreHEN: "A shared project", actionHEN: "Propose a project to build together (trip, decoration, savings). Something that unites you toward the future.",
        titreFEN: "Shared vision", actionFEN: "Talk about a couple or family project you could build together.",
        versetEN: "Consult them in the matter. And when you have decided, then rely upon Allah. (Quran 3:159)", psychoEN: "Having shared projects orients the couple toward the future and strengthens the team feeling.",
      },
      {
        jour: 19,
        titreH: "Pardon sincère", actionH: "Pense à quelque chose pour lequel tu n'as pas encore demandé pardon. Fais-le aujourd'hui, sincèrement.",
        titreF: "Pardon sincère", actionF: "Pense à une blessure que tu lui as causée. Demande-lui pardon avec sincérité aujourd'hui.",
        verset: "N'aimez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", psycho: "Demander pardon libère les deux personnes : celui qui demande et celui qui reçoit.",
        titreHEN: "Sincere forgiveness", actionHEN: "Think of something for which you have not yet asked forgiveness. Do it today, sincerely.",
        titreFEN: "Sincere forgiveness", actionFEN: "Think of a hurt you caused him. Ask his forgiveness with sincerity today.",
        versetEN: "Do you not love that Allah should forgive you? (Quran 24:22)", psychoEN: "Asking for forgiveness frees both people: the one who asks and the one who receives.",
      },
      {
        jour: 20,
        titreH: "Mi-parcours", actionH: "20 jours ! Prends 5 minutes pour noter 3 choses qui ont changé positivement depuis le début.",
        titreF: "Mi-parcours", actionF: "20 jours ! Note 3 améliorations que tu observes dans votre relation depuis le début.",
        verset: "Et certes, avec la difficulté il y a une facilité. (Coran 94:6)", psycho: "L'auto-observation des progrès ancre les changements et renforce la persévérance.",
        titreHEN: "Halfway point", actionHEN: "20 days! Take 5 minutes to note 3 things that have changed positively since the start.",
        titreFEN: "Halfway point", actionFEN: "20 days! Note 3 improvements you observe in your relationship since the start.",
        versetEN: "Indeed, with hardship comes ease. (Quran 94:6)", psychoEN: "Self-observation of progress anchors changes and strengthens perseverance.",
      },
      {
        jour: 21,
        titreH: "Sortie religieuse", actionH: "Va à la mosquée et fais dua pour ton couple. Ou lis ensemble une sourate ce soir.",
        titreF: "Invocation commune", actionF: "Fais dua avec ton mari ce soir. Même courte — 2 minutes ensemble tournés vers Allah.",
        verset: "Appelez votre Seigneur avec humilité et en secret. (Coran 7:55)", psycho: "La prière commune réduit le sentiment d'isolement dans le couple et crée une responsabilité partagée.",
        titreHEN: "Religious outing", actionHEN: "Go to the mosque and make dua for your couple. Or read a surah together tonight.",
        titreFEN: "Common invocation", actionFEN: "Make dua with your husband tonight. Even brief — 2 minutes together turned toward Allah.",
        versetEN: "And pray to Him with humility and in secret. (Quran 7:55)", psychoEN: "Common prayer reduces the feeling of isolation in the couple and creates shared responsibility.",
      },
      {
        jour: 22,
        titreH: "Surprise planifiée", actionH: "Planifie une surprise pour elle cette semaine. Simple mais pensée : son plat préféré, une sortie, une fleur.",
        titreF: "Attention particulière", actionF: "Fais quelque chose d'inattendu pour lui cette semaine qui lui montre que tu penses à lui.",
        verset: "Le Prophète ﷺ offrait des cadeaux à ses épouses pour nourrir l'amour. (Al-Adab Al-Mufrad)", psycho: "La nouveauté et l'inattendu dans une relation réactivent les circuits de la récompense dans le cerveau.",
        titreHEN: "Planned surprise", actionHEN: "Plan a surprise for her this week. Simple but thoughtful: her favorite dish, an outing, a flower.",
        titreFEN: "Special attention", actionFEN: "Do something unexpected for him this week that shows you're thinking of him.",
        versetEN: "The Prophet ﷺ gave gifts to his wives to nourish love. (Al-Adab Al-Mufrad)", psychoEN: "Novelty and the unexpected in a relationship reactivate the brain's reward circuits.",
      },
      {
        jour: 23,
        titreH: "Ses difficultés", actionH: "Demande-lui : 'Qu'est-ce qui est difficile pour toi en ce moment ?' Et écoute sans chercher à résoudre immédiatement.",
        titreF: "Soutien émotionnel", actionF: "Demande-lui comment il va vraiment. Sois là pour l'écouter sans jugement.",
        verset: "Et les croyants sont alliés les uns des autres. (Coran 9:71)", psycho: "Offrir de l'écoute empathique sans sauter aux solutions est ce dont la plupart des gens ont besoin.",
        titreHEN: "Her difficulties", actionHEN: "Ask her: 'What is difficult for you right now?' And listen without immediately trying to solve.",
        titreFEN: "Emotional support", actionFEN: "Ask him how he's really doing. Be there to listen without judgment.",
        versetEN: "And the believers are allies of one another. (Quran 9:71)", psychoEN: "Offering empathetic listening without jumping to solutions is what most people need.",
      },
      {
        jour: 24,
        titreH: "Ce qui a changé en moi", actionH: "Note ce qui a changé en toi depuis 3 semaines. Pas dans le couple — en toi. Une qualité plus présente, un réflexe qui s'est apaisé. Reconnais ton propre travail. Ex : 'Je m'énerve moins vite. J'écoute plus. C'est moi qui ai changé.'",
        titreF: "Douceur dans les mots", actionF: "Sois attentive à la douceur de tes mots aujourd'hui, surtout dans les moments ordinaires.",
        verset: "Et qui se garde de sa propre avarice... ceux-là sont ceux qui réussissent. (Coran 59:9)", psycho: "Reconnaître son propre changement — qu'il s'agisse d'un réflexe qui s'apaise ou d'une parole qui devient plus douce — ancre la transformation. Le cerveau enregistre ce qu'on nomme explicitement comme acquis.",
        titreHEN: "What has changed in me", actionHEN: "Note what has changed in you over the past 3 weeks. Not in the couple — in you. A quality more present, a reflex that has eased. Recognize your own work. Ex: 'I get angry less quickly. I listen more. I am the one who has changed.'",
        titreFEN: "Gentleness in words", actionFEN: "Be attentive to the gentleness of your words today, especially in ordinary moments.",
        versetEN: "And whoever is protected from the stinginess of their soul — those are the successful ones. (Quran 59:9)", psychoEN: "Recognizing your own change — whether it's a reflex that has eased or a word that has become gentler — anchors the transformation. The brain registers as acquired what is explicitly named.",
      },
      {
        jour: 25,
        titreH: "Valorise-la devant les autres", actionH: "Devant la famille ou des amis aujourd'hui, dis quelque chose de positif sur ta femme. Publiquement.",
        titreF: "Fierté publique", actionF: "Devant quelqu'un, dis quelque chose de bien sur ton mari. Montre que tu es fière de lui.",
        verset: "Le meilleur d'entre vous est le meilleur envers sa famille. (Tirmidhi)", psycho: "Être valorisé(e) publiquement par son conjoint est l'un des actes les plus impactants pour l'estime de soi.",
        titreHEN: "Value her in front of others", actionHEN: "In front of family or friends today, say something positive about your wife. Publicly.",
        titreFEN: "Public pride", actionFEN: "In front of someone, say something good about your husband. Show you're proud of him.",
        versetEN: "The best of you is the best to his family. (Tirmidhi)", psychoEN: "Being publicly valued by your spouse is one of the most impactful acts for self-esteem.",
      },
      {
        jour: 26,
        titreH: "Réinstaller un rituel", actionH: "Identifie un petit rituel qui a disparu dans votre couple (salam au réveil, mot du soir, thé partagé, sortie hebdomadaire...). Réinstalle-le aujourd'hui. Ex : Avant de partir le matin : 'Bismillah, à ce soir' avec un sourire. Comme avant.",
        titreF: "Foyer de sérénité", actionF: "Ce soir, prépare un environnement paisible. Le foyer doit être un refuge, pas une source de stress.",
        verset: "Afin que vous viviez en tranquillité auprès d'elles. (Coran 30:21)", psycho: "Les rituels du quotidien — petits gestes répétés — créent une mémoire affective stable. Ce sont eux qui maintiennent le sentiment de foyer, plus que les grands moments rares.",
        titreHEN: "Reinstating a ritual", actionHEN: "Identify a small ritual that has disappeared in your couple (greeting in the morning, evening words, shared tea, weekly outing...). Reinstate it today. Ex: Before leaving in the morning: 'Bismillah, see you tonight' with a smile. Like before.",
        titreFEN: "Home of serenity", actionFEN: "Tonight, prepare a peaceful environment. The home must be a refuge, not a source of stress.",
        versetEN: "That you may find tranquility in them. (Quran 30:21)", psychoEN: "Daily rituals — small repeated gestures — create a stable affective memory. They are what maintain the sense of home, more than rare grand moments.",
      },
      {
        jour: 27,
        titreH: "Bilan 4 semaines", actionH: "Qu'est-ce qui a vraiment changé depuis 4 semaines ? Note-le et partage-le avec elle.",
        titreF: "Bilan 4 semaines", actionF: "Qu'est-ce qui s'est amélioré depuis un mois ? Reconnais les efforts de l'autre.",
        verset: "Certes, avec la difficulté il y a une facilité. (Coran 94:5)", psycho: "La reconnaissance des progrès maintient la motivation sur les dernières étapes d'un programme.",
        titreHEN: "4-week review", actionHEN: "What has really changed over 4 weeks? Note it and share it with her.",
        titreFEN: "4-week review", actionFEN: "What has improved over a month? Acknowledge the other's efforts.",
        versetEN: "Verily, with difficulty comes ease. (Quran 94:5)", psychoEN: "Recognizing progress maintains motivation in the final stages of a program.",
      },
      {
        jour: 28,
        titreH: "Futur commun", actionH: "Parlez de où vous voulez être dans 5 ans : famille, dîn, finances, voyages. Rêvez ensemble.",
        titreF: "Futur commun", actionF: "Parlez de vos rêves communs. Construire une vision partagée soude le couple.",
        verset: "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux. (Coran 25:74)", psycho: "Les couples qui partagent une vision commune ont 2x plus de chances de rester ensemble.",
        titreHEN: "Common future", actionHEN: "Talk about where you want to be in 5 years: family, deen, finances, travel. Dream together.",
        titreFEN: "Common future", actionFEN: "Talk about your shared dreams. Building a shared vision bonds the couple.",
        versetEN: "Our Lord, grant us from our spouses and offspring the joy of our eyes. (Quran 25:74)", psychoEN: "Couples who share a common vision are 2x more likely to stay together.",
      },

      // SEMAINE 5-6 : Consolider et installer les habitudes
      {
        jour: 29,
        titreH: "Rituel du matin", actionH: "Établis un rituel de matin : avant de partir, embrasse-la et dis-lui une parole douce. Chaque matin.",
        titreF: "Rituel du matin", actionF: "Chaque matin, avant qu'il parte, dis-lui une parole douce ou fais un geste affectueux.",
        verset: "Et dites aux gens de bonnes paroles. (Coran 2:83)", psycho: "Les rituels réguliers créent des ancres émotionnelles qui stabilisent la relation dans le temps.",
        titreHEN: "Morning ritual", actionHEN: "Establish a morning ritual: before leaving, kiss her and say a gentle word. Every morning.",
        titreFEN: "Morning ritual", actionFEN: "Every morning, before he leaves, say a gentle word or make an affectionate gesture.",
        versetEN: "And speak to people good words. (Quran 2:83)", psychoEN: "Regular rituals create emotional anchors that stabilize the relationship over time.",
      },
      {
        jour: 30,
        titreH: "30 jours !", actionH: "30 jours de travail sur ton couple. Fête cela avec elle. Dis-lui que tu es fier d'avancer ensemble.",
        titreF: "30 jours !", actionF: "30 jours ! Exprime ta gratitude à Allah et à lui pour ce chemin parcouru ensemble.",
        verset: "Et Il a mis entre vous de l'affection et de la bienveillance. (Coran 30:21)", psycho: "Célébrer les jalons renforce l'engagement et transforme les efforts en identité de couple.",
        titreHEN: "30 days!", actionHEN: "30 days of working on your couple. Celebrate it with her. Tell her you're proud to move forward together.",
        titreFEN: "30 days!", actionFEN: "30 days! Express your gratitude to Allah and to him for this journey traveled together.",
        versetEN: "And He placed between you affection and mercy. (Quran 30:21)", psychoEN: "Celebrating milestones reinforces commitment and transforms efforts into couple identity.",
      },
      {
        jour: 31,
        titreH: "Générosité financière", actionH: "Fais quelque chose de généreux pour elle ou pour le foyer aujourd'hui. La dépense pour sa famille est une sadaqa.",
        titreF: "Reconnaissance financière", actionF: "Remercie-le pour ce qu'il apporte au foyer. La nafaqa est une ibada — reconnais-le.",
        verset: "Ce que tu dépenses pour ta famille est une sadaqa. (Bukhari)", psycho: "Donner avec générosité ou reconnaître la générosité de l'autre — la nafaqa est une ibada — désamorce les ressentiments liés à l'argent.",
        titreHEN: "Financial generosity", actionHEN: "Do something generous for her or for the home today. Spending on one's family is a sadaqa.",
        titreFEN: "Financial recognition", actionFEN: "Thank him for what he provides for the home. Nafaqa is an ibada — acknowledge it.",
        versetEN: "What you spend on your family is a sadaqa. (Bukhari)", psychoEN: "Giving generously or recognizing the other's generosity — nafaqa is an ibada — defuses resentments related to money.",
      },
      {
        jour: 32,
        titreH: "Gestion de la colère", actionH: "Réfléchis : dans quelles situations tu perds le plus facilement patience avec elle ? Prépare une stratégie.",
        titreF: "Gestion des émotions", actionF: "Identifie ce qui te fait 'sortir de toi' dans la relation. Prépare une réponse différente pour la prochaine fois.",
        verset: "Le fort est celui qui se maîtrise dans la colère. (Bukhari)", psycho: "Anticiper les situations déclenchantes et préparer une réponse alternative réduit les réactions automatiques.",
        titreHEN: "Anger management", actionHEN: "Reflect: in what situations do you lose patience with her most easily? Prepare a strategy.",
        titreFEN: "Emotional management", actionFEN: "Identify what makes you 'lose yourself' in the relationship. Prepare a different response for next time.",
        versetEN: "The strong is the one who controls himself in anger. (Bukhari)", psychoEN: "Anticipating triggering situations and preparing an alternative response reduces automatic reactions.",
      },
      {
        jour: 33,
        titreH: "Temps de qualité", actionH: "1 heure ensemble ce soir, sans objectif. Juste être là l'un pour l'autre.",
        titreF: "Temps de qualité", actionF: "Passe du temps avec lui ce soir sans agenda — juste votre présence mutuelle.",
        verset: "Afin que vous viviez en tranquillité auprès d'elles. (Coran 30:21)", psycho: "Le temps de qualité — sans tâches ni écrans — est le langage d'amour le plus universel.",
        titreHEN: "Quality time", actionHEN: "1 hour together tonight, without objective. Just being there for each other.",
        titreFEN: "Quality time", actionFEN: "Spend time with him tonight without an agenda — just your mutual presence.",
        versetEN: "That you may find tranquility in them. (Quran 30:21)", psychoEN: "Quality time — without tasks or screens — is the most universal love language.",
      },
      {
        jour: 34,
        titreH: "Apprends quelque chose de nouveau ensemble", actionH: "Proposez-vous d'apprendre quelque chose ensemble : une sourate, une recette, un sujet islamique.",
        titreF: "Apprendre ensemble", actionF: "Proposez d'apprendre quelque chose ensemble. La croissance commune soude le couple.",
        verset: "Dis : Seigneur, augmente mes connaissances. (Coran 20:114)", psycho: "Apprendre ensemble crée un sentiment de complicité et d'évolution partagée.",
        titreHEN: "Learn something new together", actionHEN: "Suggest learning something together: a surah, a recipe, an Islamic subject.",
        titreFEN: "Learn together", actionFEN: "Suggest learning something together. Growing together bonds the couple.",
        versetEN: "Say: My Lord, increase my knowledge. (Quran 20:114)", psychoEN: "Learning together creates a sense of complicity and shared growth.",
      },
      {
        jour: 35,
        titreH: "Excuse les défauts", actionH: "Pense à un défaut de ta femme qui t'agace. Aujourd'hui, accepte-le avec bienveillance. Personne n'est parfait.",
        titreF: "Acceptation", actionF: "Pense à un défaut de ton mari qui t'irrite. Accepte-le avec amour. C'est ça l'amour mature.",
        verset: "Si vous les avez en aversion, il se peut qu'Allah ait placé beaucoup de bien. (Coran 4:19)", psycho: "L'acceptation inconditionnelle des défauts de l'autre est le fondement de l'amour durable.",
        titreHEN: "Excuse the flaws", actionHEN: "Think of a flaw of your wife that annoys you. Today, accept it with benevolence. Nobody is perfect.",
        titreFEN: "Acceptance", actionFEN: "Think of a flaw of your husband that irritates you. Accept it with love. That's mature love.",
        versetEN: "If you dislike them, perhaps Allah has placed much good in them. (Quran 4:19)", psychoEN: "Unconditional acceptance of the other's flaws is the foundation of lasting love.",
      },
      {
        jour: 36,
        titreH: "Belle-famille : pose tes limites", actionH: "Réfléchis : est-ce que la belle-famille ou ta propre famille nuit à votre couple ? Si oui, parles-en à ta femme.",
        titreF: "Belle-famille", actionF: "Est-ce que les familles respectives créent des tensions ? Parles-en à ton mari avec douceur.",
        verset: "Et entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété, et ne vous entraidez pas dans le péché et la transgression. (Coran 5:2)", psycho: "Établir des frontières claires avec les familles est une condition nécessaire à l'épanouissement conjugal.",
        titreHEN: "In-laws: set your limits", actionHEN: "Reflect: is the in-law family or your own family harming your couple? If so, discuss it with your wife.",
        titreFEN: "In-laws", actionFEN: "Are the respective families creating tensions? Discuss it with your husband gently.",
        versetEN: "Help one another in righteousness and piety, but do not help one another in sin and transgression. (Quran 5:2)", psychoEN: "Establishing clear boundaries with families is a necessary condition for marital flourishing.",
      },
      {
        jour: 37,
        titreH: "Ton engagement", actionH: "Dis-lui clairement : 'Je veux que notre mariage soit le meilleur possible. Je m'y engage.' Les mots comptent.",
        titreF: "Ton engagement", actionF: "Dis-lui : 'Notre mariage compte énormément pour moi. Je veux qu'on soit heureux ensemble.'",
        verset: "Ils ont pris de vous une alliance solennelle. (Coran 4:21)", psycho: "Exprimer verbalement son engagement renforce la sécurité émotionnelle des deux partenaires.",
        titreHEN: "Your commitment", actionHEN: "Tell her clearly: 'I want our marriage to be the best possible. I commit to that.' Words matter.",
        titreFEN: "Your commitment", actionFEN: "Tell him: 'Our marriage matters enormously to me. I want us to be happy together.'",
        versetEN: "They have taken from you a solemn covenant. (Quran 4:21)", psychoEN: "Verbally expressing one's commitment strengthens the emotional security of both partners.",
      },
      {
        jour: 38,
        titreH: "Remercie Allah", actionH: "Fais du shukr pour ton mariage. Même imparfait, c'est une ni'ma. Remercie Allah devant elle.",
        titreF: "Remercie Allah", actionF: "Fais du shukr pour ton mariage. Dis à Allah : 'Merci pour ce foyer, même imparfait.'",
        verset: "Si vous êtes reconnaissants, J'augmenterai certes vos bienfaits. (Coran 14:7)", psycho: "La gratitude envers sa vie conjugale — même imparfaite — est prédicteur de bonheur à long terme.",
        titreHEN: "Thank Allah", actionHEN: "Give shukr for your marriage. Even imperfect, it is a ni'ma. Thank Allah in front of her.",
        titreFEN: "Thank Allah", actionFEN: "Give shukr for your marriage. Say to Allah: 'Thank you for this home, even imperfect.'",
        versetEN: "If you are grateful, I will surely increase your blessings. (Quran 14:7)", psychoEN: "Gratitude toward one's married life — even imperfect — is a predictor of long-term happiness.",
      },
      {
        jour: 39,
        titreH: "Les habitudes à garder", actionH: "Note 5 habitudes nées de ces 40 jours que tu veux garder dans ta vie. Partage-les avec elle.",
        titreF: "Les habitudes à garder", actionF: "Quelles nouvelles habitudes veux-tu ancrer durablement ? Partage ta liste avec lui.",
        verset: "Les actes les plus aimés d'Allah sont ceux faits régulièrement, même s'ils sont peu nombreux. (Bukhari)", psycho: "Les habitudes installées en 40 jours ont 60% de chances de persister si on les nomme et les valide.",
        titreHEN: "The habits to keep", actionHEN: "Note 5 habits born from these 40 days that you want to keep in your life. Share them with her.",
        titreFEN: "The habits to keep", actionFEN: "Which new habits do you want to anchor durably? Share your list with him.",
        versetEN: "The most beloved deeds to Allah are those done regularly, even if they are few. (Bukhari)", psychoEN: "Habits installed in 40 days have a 60% chance of persisting if named and validated.",
      },
      {
        jour: 40,
        titreH: "40 jours — Félicitations !", actionH: "Tu as tenu 40 jours. MashaAllah. Ce soir, fais dua avec ta femme et demandez à Allah de consolider votre foyer.",
        titreF: "40 jours — Félicitations !", actionF: "40 jours de travail et d'amour. Ce soir, priez ensemble et demandez à Allah de bénir votre union.",
        verset: "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux, et fais de nous un guide pour les pieux. (Coran 25:74)", psycho: "Vous avez prouvé que vous pouviez changer. Ce n'est pas la fin — c'est le début de votre nouveau couple.",
        titreHEN: "40 days — Congratulations!", actionHEN: "You held 40 days. MashaAllah. Tonight, make dua with your wife and ask Allah to consolidate your home.",
        titreFEN: "40 days — Congratulations!", actionFEN: "40 days of work and love. Tonight, pray together and ask Allah to bless your union.",
        versetEN: "Our Lord, grant us from our spouses and offspring the joy of our eyes, and make us a guide for the righteous. (Quran 25:74)", psychoEN: "You have proven that you can change. This is not the end — it is the beginning of your new couple.",
      },
    ],

    modere: [
      {
        jour: 1,
        titreH: "Briser la glace", actionH: "Commence simple : dis-lui 'Assalamu alaykum' avec un sourire sincère ce soir. Pas plus. La rupture de la froideur commence par un mot.",
        titreF: "Première étape", actionF: "Ce soir, souris-lui sincèrement et dis-lui 'Comment s'est passée ta journée ?' Écoute vraiment.",
        verset: "Et répandez la paix entre vous. (Muslim)", psycho: "Après une période de distance, un micro-geste non menaçant est plus efficace qu'un grand discours.",
        titreHEN: "Breaking the ice", actionHEN: "Start simple: say 'Assalamu alaykum' to her with a sincere smile tonight. Nothing more. Breaking the coldness starts with one word.",
        titreFEN: "First step", actionFEN: "Tonight, smile at him sincerely and ask: 'How was your day?' Really listen.",
        versetEN: "And spread peace among yourselves. (Muslim)", psychoEN: "After a period of distance, a small non-threatening gesture is more effective than a big speech.",
      },
      {
        jour: 2,
        titreH: "Istighfar", actionH: "Avant toute action envers elle, fais 100 istighfar aujourd'hui. Commence par toi-même.",
        titreF: "Istighfar", actionF: "Fais 100 istighfar aujourd'hui. La purification commence de l'intérieur.",
        verset: "Demandez pardon à votre Seigneur, Il est Grand Pardonneur. (Coran 71:10)", psycho: "L'auto-examen sincère précède tout changement relationnel durable. Commencer par soi est la seule voie.",
        titreHEN: "Istighfar", actionHEN: "Before any action toward her, make 100 istighfar today. Start with yourself.",
        titreFEN: "Istighfar", actionFEN: "Make 100 istighfar today. Purification starts from within.",
        versetEN: "Ask forgiveness of your Lord, He is Most Forgiving. (Quran 71:10)", psychoEN: "Sincere self-examination precedes any lasting relational change. Starting with oneself is the only path.",
      },
      {
        jour: 3,
        titreH: "Le premier pardon", actionH: "Pense à la dernière dispute ou blessure. Même si tu n'avais pas complètement tort — demande pardon pour ta part.",
        titreF: "Le premier pardon", actionF: "Demande pardon pour quelque chose que tu as dit ou fait qui a blessé. Sans condition.",
        verset: "N'aimez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", psycho: "Assumer sa part de responsabilité — même partielle — débloque des situations figées depuis des semaines.",
        titreHEN: "The first forgiveness", actionHEN: "Think of the last dispute or hurt. Even if you weren't completely wrong — ask forgiveness for your part.",
        titreFEN: "The first forgiveness", actionFEN: "Ask forgiveness for something you said or did that hurt. Unconditionally.",
        versetEN: "Do you not love that Allah should forgive you? (Quran 24:22)", psychoEN: "Taking responsibility for one's part — even partial — unlocks situations frozen for weeks.",
      },
      {
        jour: 4,
        titreH: "Conversation sans agenda", actionH: "Propose-lui de parler ce soir — pas pour résoudre un problème, juste pour vous retrouver.",
        titreF: "Conversation douce", actionF: "Initie une conversation légère ce soir : un souvenir heureux, un sujet qui vous rapproche.",
        verset: "Et parmi Ses signes est qu'Il a créé pour vous des épouses. (Coran 30:21)", psycho: "Renouer par des conversations légères avant d'aborder les sujets lourds évite les réactions défensives.",
        titreHEN: "Conversation without agenda", actionHEN: "Suggest speaking tonight — not to solve a problem, just to reconnect.",
        titreFEN: "Gentle conversation", actionFEN: "Initiate a light conversation tonight: a happy memory, a topic that brings you closer.",
        versetEN: "And among His signs is that He created for you spouses. (Quran 30:21)", psychoEN: "Reconnecting through light conversations before tackling heavy topics avoids defensive reactions.",
      },
      {
        jour: 5,
        titreH: "Geste concret", actionH: "Fais quelque chose de concret pour le foyer aujourd'hui — aide ménagère, course, réparation. Sans rien demander.",
        titreF: "Geste d'amour", actionF: "Prépare quelque chose qu'il aime. Un repas, un environnement agréable. Montre que tu te soucies.",
        verset: "Vivez avec elles de façon convenable. (Coran 4:19)", psycho: "Les actes concrets signalent la volonté de changement plus fortement que les paroles.",
        titreHEN: "Concrete gesture", actionHEN: "Do something concrete for the home today — housework, errand, repair. Without asking for anything.",
        titreFEN: "Gesture of love", actionFEN: "Prepare something he loves. A meal, a pleasant environment. Show you care.",
        versetEN: "Live with them in kindness. (Quran 4:19)", psychoEN: "Concrete acts signal the willingness to change more strongly than words.",
      },
      {
        jour: 6,
        titreH: "Écoute sans défense", actionH: "Demande-lui : 'Qu'est-ce qui te pèse le plus dans notre relation ?' Et écoute sans te défendre, même si c'est difficile.",
        titreF: "Parole ouverte", actionF: "Dis-lui : 'J'aimerais qu'on parle vraiment. Qu'est-ce que tu attends de moi ?' Et accueille la réponse.",
        verset: "Et leur consultation entre eux est mutuelle. (Coran 42:38)", psycho: "Permettre à l'autre d'exprimer sa douleur sans défense est l'acte le plus courageux dans une relation.",
        titreHEN: "Listen without defense", actionHEN: "Ask her: 'What weighs on you most in our relationship?' And listen without defending yourself, even if it's hard.",
        titreFEN: "Open word", actionFEN: "Say to him: 'I'd like us to really talk. What do you expect from me?' And receive the answer.",
        versetEN: "And their affairs are conducted by mutual consultation. (Quran 42:38)", psychoEN: "Allowing the other to express their pain without defense is the most courageous act in a relationship.",
      },
      {
        jour: 7,
        titreH: "Dua sincère", actionH: "Ce soir, fais dua pour ton couple. Demande à Allah de mettre la rahma entre vous. Sincèrement.",
        titreF: "Dua sincère", actionF: "Fais dua pour ton mariage ce soir. Demande à Allah de ramener la tendresse entre vous.",
        verset: "Appelez votre Seigneur avec humilité et en secret. (Coran 7:55)", psycho: "L'intention spirituelle sincère réoriente la psychologie de la personne vers la solution plutôt que le problème.",
        titreHEN: "Sincere dua", actionHEN: "Tonight, make dua for your couple. Ask Allah to place rahma between you. Sincerely.",
        titreFEN: "Sincere dua", actionFEN: "Make dua for your marriage tonight. Ask Allah to bring tenderness back between you.",
        versetEN: "Call upon your Lord with humility and in secret. (Quran 7:55)", psychoEN: "Sincere spiritual intention reorients the person's psychology toward the solution rather than the problem.",
      },
      {
        jour: 8,
        titreH: "Lettre écrite", actionH: "Écris-lui une lettre courte. Pas pour te défendre — pour lui dire que tu tiens à elle et que tu veux changer.",
        titreF: "Message du cœur", actionF: "Envoie-lui un message écrit depuis le cœur. Ce que tu ressens. Sans accusation.",
        verset: "Une bonne parole est une aumône. (Sahih al-Bukhari 2989)", psycho: "L'écrit contourne les défenses verbales et atteint plus profondément dans les situations de conflit.",
        titreHEN: "Written letter", actionHEN: "Write her a short letter. Not to defend yourself — to tell her you care about her and want to change.",
        titreFEN: "Message from the heart", actionFEN: "Send him a message written from the heart. What you feel. Without accusation.",
        versetEN: "A good word is a charity. (Sahih al-Bukhari 2989)", psychoEN: "Writing bypasses verbal defenses and reaches more deeply in conflict situations.",
      },
      {
        jour: 9,
        titreH: "Maîtrise totale", actionH: "Peu importe ce qui se passe aujourd'hui — aucun mot dur, aucune critique. Maîtrise absolue.",
        titreF: "Douceur totale", actionF: "Aujourd'hui, que ta parole soit exclusivement douce. Même en cas de tension.",
        verset: "Le fort est celui qui se maîtrise dans la colère. (Bukhari)", psycho: "Une journée de maîtrise totale rompt les cycles automatiques de réaction et crée un nouveau schéma.",
        titreHEN: "Total control", actionHEN: "No matter what happens today — no harsh word, no criticism. Absolute control.",
        titreFEN: "Total gentleness", actionFEN: "Today, let your words be exclusively gentle. Even in case of tension.",
        versetEN: "The strong is the one who controls himself in anger. (Bukhari)", psychoEN: "A day of total control breaks automatic reaction cycles and creates a new pattern.",
      },
      {
        jour: 10,
        titreH: "10 jours — bilan honnête", actionH: "Es-tu honnête dans tes efforts ? Qu'est-ce que tu pourrais faire différemment ? Note-le.",
        titreF: "10 jours — bilan honnête", actionF: "Note honnêtement : qu'est-ce qui a changé ? Qu'est-ce qui résiste encore ?",
        verset: "Certes, Allah ne modifie pas l'état d'un peuple tant qu'ils ne changent pas ce qui est en eux. (Coran 13:11)", psycho: "L'auto-évaluation honnête à ce stade est le moment le plus critique d'un programme de changement.",
        titreHEN: "10 days — honest review", actionHEN: "Are you honest in your efforts? What could you do differently? Note it.",
        titreFEN: "10 days — honest review", actionFEN: "Honestly note: what has changed? What is still resisting?",
        versetEN: "Verily, Allah does not change the condition of a people until they change what is within themselves. (Quran 13:11)", psychoEN: "Honest self-assessment at this stage is the most critical moment in a change program.",
      },
      {
        jour: 11,
        titreH: "Proposer un médiateur", actionH: "Si la communication reste bloquée, propose doucement l'aide d'un imam ou d'un sage de confiance.",
        titreF: "Aide extérieure", actionF: "Si tu sens que vous avez besoin d'aide, propose-lui d'en parler à quelqu'un de confiance.",
        verset: "Et si vous craignez le désaccord entre les deux, désignez un arbitre de sa famille et un arbitre de la sienne. (Coran 4:35)", psycho: "Chercher de l'aide extérieure n'est pas un aveu d'échec — c'est un signe de maturité et d'amour.",
        titreHEN: "Suggest a mediator", actionHEN: "If communication remains blocked, gently suggest the help of a trusted imam or wise person.",
        titreFEN: "Outside help", actionFEN: "If you feel you need help, suggest discussing it with someone you trust.",
        versetEN: "And if you fear dissension between the two, send an arbitrator from his people and an arbitrator from her people. (Quran 4:35)", psychoEN: "Seeking outside help is not an admission of failure — it is a sign of maturity and love.",
      },
      {
        jour: 12,
        titreH: "Prière ensemble", actionH: "Propose-lui de faire une prière ensemble. Sans pression. Juste comme invitation douce.",
        titreF: "Prière ensemble", actionF: "Propose une courte prière commune ce soir. Un moment de connexion spirituelle.",
        verset: "Notre Seigneur, accorde-nous de nos épouses la joie des yeux. (Coran 25:74)", psycho: "La prière commune dans un couple en difficulté crée un espace neutre et pacifiant.",
        titreHEN: "Prayer together", actionHEN: "Suggest praying together. Without pressure. Just as a gentle invitation.",
        titreFEN: "Prayer together", actionFEN: "Suggest a short common prayer tonight. A moment of spiritual connection.",
        versetEN: "Our Lord, grant us from our spouses the joy of our eyes. (Quran 25:74)", psychoEN: "Common prayer in a struggling couple creates a neutral and pacifying space.",
      },
      {
        jour: 13,
        titreH: "Ce que j'admire", actionH: "Dis-lui trois choses que tu admires sincèrement chez elle, malgré les difficultés actuelles.",
        titreF: "Ce que j'admire", actionF: "Dis-lui trois qualités que tu apprécies vraiment chez lui, malgré les tensions.",
        verset: "Si vous n'aimez pas une de ses qualités, vous en apprécierez une autre. (Muslim)", psycho: "Réactiver la perception positive de l'autre brise le cycle de la focalisation sur les défauts.",
        titreHEN: "What I admire", actionHEN: "Tell her three things you sincerely admire about her, despite the current difficulties.",
        titreFEN: "What I admire", actionFEN: "Tell him three qualities you truly appreciate in him, despite the tensions.",
        versetEN: "If you dislike one of their qualities, you will appreciate another. (Muslim)", psychoEN: "Reactivating positive perception of the other breaks the cycle of focusing on flaws.",
      },
      {
        jour: 14,
        titreH: "Deux semaines", actionH: "Note : qu'est-ce qui a changé depuis 2 semaines ? Même une petite amélioration compte.",
        titreF: "Deux semaines", actionF: "Reconnais les progrès, même petits. Chaque pas compte.",
        verset: "Et certes, avec la difficulté il y a une facilité. (Coran 94:6)", psycho: "Identifier et nommer les améliorations — même infimes — ancre la progression et maintient l'espoir.",
        titreHEN: "Two weeks", actionHEN: "Note: what has changed since 2 weeks? Even a small improvement counts.",
        titreFEN: "Two weeks", actionFEN: "Acknowledge the progress, even small. Every step counts.",
        versetEN: "Indeed, with hardship comes ease. (Quran 94:6)", psychoEN: "Identifying and naming improvements — even minor ones — anchors progress and maintains hope.",
      },
      {
        jour: 15,
        titreH: "Intimité émotionnelle", actionH: "Partage avec elle une vulnérabilité réelle. Quelque chose que tu ne dis pas d'habitude.",
        titreF: "Vulnérabilité", actionF: "Partage avec lui quelque chose de vulnérable. La vraie intimité commence là.",
        verset: "Et Il a mis entre vous de l'affection et de la bienveillance. (Coran 30:21)", psycho: "La vulnérabilité partagée est le chemin le plus court vers la reconnexion émotionnelle.",
        titreHEN: "Emotional intimacy", actionHEN: "Share a real vulnerability with her. Something you don't usually say.",
        titreFEN: "Vulnerability", actionFEN: "Share something vulnerable with him. True intimacy begins there.",
        versetEN: "And He placed between you affection and mercy. (Quran 30:21)", psychoEN: "Shared vulnerability is the shortest path to emotional reconnection.",
      },
      {
        jour: 16,
        titreH: "Sortie simple", actionH: "Proposez une sortie simple ensemble. Une promenade. L'objectif : passer du temps côte à côte.",
        titreF: "Sortie ensemble", actionF: "Propose une sortie simple. Marchez ensemble, changez de cadre.",
        verset: "Le Prophète ﷺ faisait la course à pied avec Aïcha (ra). (Sunan Abi Dawud 2578)", psycho: "Changer d'environnement casse les associations négatives liées à l'espace du foyer.",
        titreHEN: "Simple outing", actionHEN: "Suggest a simple outing together. A walk. The goal: spending time side by side.",
        titreFEN: "Outing together", actionFEN: "Suggest a simple outing. Walk together, change scenery.",
        versetEN: "The Prophet ﷺ raced on foot with Aisha (may Allah be pleased with her). (Sunan Abi Dawud 2578)", psychoEN: "Changing environment breaks the negative associations linked to the home space.",
      },
      {
        jour: 17,
        titreH: "Valorise ce qu'elle porte", actionH: "Aujourd'hui, exprime à ta femme ce que tu apprécies dans sa façon de gérer le foyer ou de prendre soin de vous deux. Sois précis. Ex : 'J'admire la patience que tu mets dans la maison' ou 'Tu rends notre foyer apaisant'.",
        titreF: "Valorisation sincère", actionF: "Aujourd'hui, exprime à ton mari quelque chose que tu apprécies dans sa façon d'être père ou de gérer le foyer. Un mot sincère sur ce qu'il fait bien change la dynamique.",
        verset: "Et entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété, et ne vous entraidez pas dans le péché et la transgression. (Coran 5:2)", psycho: "Valoriser explicitement les rôles invisibles du conjoint — soin du foyer, parentalité, charge mentale — répare ce que la routine efface. Être reconnu(e) pour ce qu'on porte est l'un des besoins les plus profonds dans le couple.",
        titreHEN: "Value what she carries", actionHEN: "Today, tell your wife what you appreciate in the way she manages the home or takes care of both of you. Be precise. Ex: 'I admire the patience you put into our home' or 'You make our home peaceful'.",
        titreFEN: "Sincere appreciation", actionFEN: "Today, express to your husband something you appreciate about how he is as a father or how he manages the home. A sincere word about what he does well changes the dynamic.",
        versetEN: "Help one another in righteousness and piety, but do not help one another in sin and transgression. (Quran 5:2)", psychoEN: "Explicitly valuing the invisible roles of one's spouse — home care, parenting, mental load — repairs what routine erases. Being recognized for what we carry is one of the deepest needs in a couple.",
      },
      {
        jour: 18,
        titreH: "Ses besoins profonds", actionH: "Demande : 'De quoi as-tu besoin de moi que tu n'as pas en ce moment ?' Écoute vraiment.",
        titreF: "Ses besoins profonds", actionF: "Demande-lui : 'Qu'est-ce qui te manque le plus en ce moment ?' Accueille sans te défendre.",
        verset: "Et elles ont des droits équivalents à leurs obligations. (Coran 2:228)", psycho: "Identifier les besoins fondamentaux non satisfaits est la clé pour résoudre les conflits chroniques.",
        titreHEN: "Her deep needs", actionHEN: "Ask: 'What do you need from me that you don't have right now?' Really listen.",
        titreFEN: "His deep needs", actionFEN: "Ask him: 'What do you miss the most right now?' Receive without defending.",
        versetEN: "And they have rights equivalent to their obligations. (Quran 2:228)", psychoEN: "Identifying unsatisfied fundamental needs is the key to resolving chronic conflicts.",
      },
      {
        jour: 19,
        titreH: "Réconciliation profonde", actionH: "Propose une vraie conversation de réconciliation : 'Je veux qu'on repose les bases entre nous.'",
        titreF: "Réconciliation profonde", actionF: "Propose : 'Est-ce qu'on peut parler de comment on veut que notre couple soit à partir d'aujourd'hui ?'",
        verset: "Ils ont pris de vous une alliance solennelle. (Coran 4:21)", psycho: "Redéfinir explicitement les bases d'un couple est une étape thérapeutique puissante.",
        titreHEN: "Deep reconciliation", actionHEN: "Suggest a true reconciliation conversation: 'I want us to re-lay the foundations between us.'",
        titreFEN: "Deep reconciliation", actionFEN: "Suggest: 'Can we talk about how we want our couple to be from today?'",
        versetEN: "They have taken from you a solemn covenant. (Quran 4:21)", psychoEN: "Explicitly redefining the foundations of a couple is a powerful therapeutic step.",
      },
      {
        jour: 20,
        titreH: "Mi-parcours", actionH: "20 jours. Prends conscience du chemin parcouru. Ce travail sur toi-même est une ibada.",
        titreF: "Mi-parcours", actionF: "20 jours de persévérance. Reconnais ta force et ta foi.",
        verset: "Certes, avec la difficulté il y a une facilité. (Coran 94:5)", psycho: "La conscience du chemin parcouru est un facteur décisif de persévérance sur les 20 derniers jours.",
        titreHEN: "Halfway point", actionHEN: "20 days. Become aware of the journey traveled. This work on yourself is an ibada.",
        titreFEN: "Halfway point", actionFEN: "20 days of perseverance. Acknowledge your strength and faith.",
        versetEN: "Verily, with difficulty comes ease. (Quran 94:5)", psychoEN: "Awareness of the journey traveled is a decisive factor in perseverance for the last 20 days.",
      },
      {
        jour: 21,
        titreH: "Habitude spirituelle", actionH: "Installe une habitude spirituelle commune simple : lire ensemble un verset après le dîner.",
        titreF: "Habitude spirituelle", actionF: "Propose de lire ensemble un verset du Coran chaque soir. Même 3 minutes.",
        verset: "Les actes les plus aimés d'Allah sont ceux faits régulièrement. (Bukhari)", psycho: "Une habitude rituelle partagée crée un ancrage positif quotidien dans la relation.",
        titreHEN: "Spiritual habit", actionHEN: "Install a simple shared spiritual habit: read a verse together after dinner.",
        titreFEN: "Spiritual habit", actionFEN: "Suggest reading a verse from the Quran together every evening. Even 3 minutes.",
        versetEN: "The most beloved deeds to Allah are those done regularly. (Bukhari)", psychoEN: "A shared ritual habit creates a daily positive anchor in the relationship.",
      },
      {
        jour: 22,
        titreH: "Valorisation publique", actionH: "Devant un proche, dis quelque chose de positif sur ta femme. Protège son honneur.",
        titreF: "Fierté", actionF: "Parle de lui en bien devant quelqu'un. Défends son image.",
        verset: "Le meilleur d'entre vous est le meilleur envers sa famille. (Tirmidhi)", psycho: "Valoriser ou défendre publiquement son conjoint reconstruit l'estime de soi dans la relation et renforce le sentiment de loyauté.",
        titreHEN: "Public appreciation", actionHEN: "In front of a close one, say something positive about your wife. Protect her honor.",
        titreFEN: "Pride", actionFEN: "Speak well of him in front of someone. Defend his image.",
        versetEN: "The best of you is the best to his family. (Tirmidhi)", psychoEN: "Valuing or defending one's spouse publicly rebuilds self-esteem in the relationship and strengthens the sense of loyalty.",
      },
      {
        jour: 23,
        titreH: "Toucher affectueux", actionH: "Reprends les gestes physiques affectueux : main dans la main, câlin. Pas de pression — juste de la présence.",
        titreF: "Présence physique", actionF: "Rapproche-toi physiquement de lui avec douceur. Laisse le corps parler là où les mots résistent.",
        verset: "Il est une parure pour vous et vous êtes une parure pour lui. (Coran 2:187)", psycho: "Le toucher affectueux libère de l'ocytocine qui contre-balance les hormones de stress et de conflit.",
        titreHEN: "Affectionate touch", actionHEN: "Resume affectionate physical gestures: holding hands, a hug. No pressure — just presence.",
        titreFEN: "Physical presence", actionFEN: "Draw physically closer to him gently. Let the body speak where words resist.",
        versetEN: "He is a garment for you and you are a garment for him. (Quran 2:187)", psychoEN: "Affectionate touch releases oxytocin which counterbalances stress and conflict hormones.",
      },
      {
        jour: 24,
        titreH: "Rêves partagés", actionH: "Parlez de vos rêves. Votre maison idéale, votre vie dans 5 ans. Construisez une vision.",
        titreF: "Vision partagée", actionF: "Parlez de l'avenir avec optimisme. Qu'est-ce que vous voulez construire ensemble ?",
        verset: "Notre Seigneur, accorde-nous de nos épouses la joie des yeux. (Coran 25:74)", psycho: "Construire une vision commune réoriente l'attention du passé douloureux vers l'avenir possible.",
        titreHEN: "Shared dreams", actionHEN: "Talk about your dreams. Your ideal home, your life in 5 years. Build a vision.",
        titreFEN: "Shared vision", actionFEN: "Talk about the future with optimism. What do you want to build together?",
        versetEN: "Our Lord, grant us from our spouses the joy of our eyes. (Quran 25:74)", psychoEN: "Building a shared vision redirects attention from the painful past toward the possible future.",
      },
      {
        jour: 25,
        titreH: "Lettre de gratitude", actionH: "Écris-lui une lettre de gratitude pour tout ce qu'elle t'a apporté, même dans les moments difficiles.",
        titreF: "Lettre de gratitude", actionF: "Écris-lui pour le remercier des moments heureux que vous avez vécus ensemble.",
        verset: "Si vous êtes reconnaissants, J'augmenterai vos bienfaits. (Coran 14:7)", psycho: "Exprimer de la gratitude même dans les périodes difficiles renforce la résilience du couple.",
        titreHEN: "Gratitude letter", actionHEN: "Write her a gratitude letter for everything she has brought you, even in difficult moments.",
        titreFEN: "Gratitude letter", actionFEN: "Write to him to thank him for the happy moments you've lived together.",
        versetEN: "If you are grateful, I will increase your blessings. (Quran 14:7)", psychoEN: "Expressing gratitude even in difficult periods strengthens the couple's resilience.",
      },
      {
        jour: 26,
        titreH: "Plan de couple", actionH: "Proposez ensemble un 'contrat de couple' simple : 3 engagements mutuels pour l'avenir.",
        titreF: "Engagements mutuels", actionF: "Proposez de définir ensemble 3 règles simples pour votre relation going forward.",
        verset: "Consulte-les dans l'affaire, puis quand tu as décidé, place ta confiance en Allah. (Coran 3:159)", psycho: "Co-créer des règles de fonctionnement augmente l'adhésion et le sentiment d'équité.",
        titreHEN: "Couple plan", actionHEN: "Suggest together a simple 'couple contract': 3 mutual commitments for the future.",
        titreFEN: "Mutual commitments", actionFEN: "Suggest defining together 3 simple rules for your relationship going forward.",
        versetEN: "Consult them in the matter. And when you have decided, then rely upon Allah. (Quran 3:159)", psychoEN: "Co-creating operating rules increases adherence and the sense of fairness.",
      },
      {
        jour: 27,
        titreH: "Patience active", actionH: "La patience n'est pas passive. Aujourd'hui, fais un acte positif même si tu n'en as pas envie.",
        titreF: "Patience active", actionF: "La sabr n'est pas l'inaction. Fais aujourd'hui quelque chose de bien pour lui malgré la fatigue.",
        verset: "Certes, Allah est avec les patients. (Coran 2:153)", psycho: "Agir contre ses envies immédiates — behavioral activation — est une technique thérapeutique puissante.",
        titreHEN: "Active patience", actionHEN: "Patience is not passive. Today, do a positive act even if you don't feel like it.",
        titreFEN: "Active patience", actionFEN: "Sabr is not inaction. Do something good for him today despite fatigue.",
        versetEN: "Verily, Allah is with the patient. (Quran 2:153)", psychoEN: "Acting against immediate desires — behavioral activation — is a powerful therapeutic technique.",
      },
      {
        jour: 28,
        titreH: "Lettre d'engagement", actionH: "Écris une courte lettre à ta femme — pas pour te défendre, pas pour expliquer. Juste pour lui dire ce que tu veux construire avec elle. Ce que tu veux être pour elle. Laisse-la quelque part où elle la trouvera.",
        titreF: "Prépare une célébration", actionF: "Prépare quelque chose de spécial pour demain. Ce chemin mérite d'être célébré.",
        verset: "Et entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété. (Coran 5:2)", psycho: "Marquer symboliquement un cap — par une lettre, une célébration préparée — ancre les progrès et donne au couple une mémoire commune des moments importants.",
        titreHEN: "Letter of commitment", actionHEN: "Write a short letter to your wife — not to defend yourself, not to explain. Just to tell her what you want to build with her. What you want to be for her. Leave it somewhere she will find it.",
        titreFEN: "Prepare a celebration", actionFEN: "Prepare something special for tomorrow. This journey deserves to be celebrated.",
        versetEN: "Help one another in righteousness and piety. (Quran 5:2)", psychoEN: "Symbolically marking a milestone — through a letter, a prepared celebration — anchors progress and gives the couple a shared memory of important moments.",
      },
      {
        jour: 29,
        titreH: "Renouveau", actionH: "Proposez de renouveler symboliquement votre engagement. Une promesse simple, sincère.",
        titreF: "Renouveau", actionF: "Propose un renouvellement de votre engagement conjugal. Devant Allah.",
        verset: "Ils ont pris de vous une alliance solennelle. (Coran 4:21)", psycho: "Le renouvellement symbolique d'un engagement a un impact psychologique comparable à une nouvelle promesse.",
        titreHEN: "Renewal", actionHEN: "Suggest symbolically renewing your commitment. A simple, sincere promise.",
        titreFEN: "Renewal", actionFEN: "Suggest a renewal of your marital commitment. Before Allah.",
        versetEN: "They have taken from you a solemn covenant. (Quran 4:21)", psychoEN: "The symbolic renewal of a commitment has a psychological impact comparable to a new promise.",
      },
      {
        jour: 30,
        titreH: "30 jours", actionH: "30 jours ! MashaAllah. Fêtez cela ensemble. Note les 5 plus grands changements.",
        titreF: "30 jours !", actionF: "30 jours de courage et de foi. Célébrez ensemble.",
        verset: "Et certes, avec la difficulté il y a une facilité. (Coran 94:6)", psycho: "Célébrer le cap des 30 jours consolide les nouvelles habitudes et prépare la dernière ligne droite.",
        titreHEN: "30 days", actionHEN: "30 days! MashaAllah. Celebrate this together. Note the 5 biggest changes.",
        titreFEN: "30 days!", actionFEN: "30 days of courage and faith. Celebrate together.",
        versetEN: "Indeed, with hardship comes ease. (Quran 94:6)", psychoEN: "Celebrating the 30-day milestone consolidates new habits and prepares the final stretch.",
      },
      {
        jour: 31,
        titreH: "Ancrer les habitudes", actionH: "Identifie 3 nouvelles habitudes que tu as prises. Comment les rendre permanentes ?",
        titreF: "Habitudes permanentes", actionF: "Quelles habitudes de ces 30 jours veux-tu garder à vie ?",
        verset: "Les actes les plus aimés d'Allah sont ceux faits régulièrement. (Bukhari)", psycho: "Verbaliser et planifier la continuation d'une habitude multiplie par 3 les chances qu'elle persiste.",
        titreHEN: "Anchor the habits", actionHEN: "Identify 3 new habits you've taken on. How to make them permanent?",
        titreFEN: "Permanent habits", actionFEN: "Which habits from these 30 days do you want to keep for life?",
        versetEN: "The most beloved deeds to Allah are those done regularly. (Bukhari)", psychoEN: "Verbalizing and planning the continuation of a habit multiplies by 3 the chances it persists.",
      },
      {
        jour: 32,
        titreH: "Projet commun", actionH: "Lancez ensemble un projet concret : Oumra, rénovation, apprentissage du Coran. Un objectif commun.",
        titreF: "Projet de couple", actionF: "Proposez un projet commun qui vous donnera une direction partagée.",
        verset: "Consulte-les dans l'affaire, puis quand tu as décidé, place ta confiance en Allah. (Coran 3:159)", psycho: "Avoir un projet commun canalise l'énergie du couple vers l'avenir plutôt que vers les griefs passés.",
        titreHEN: "Shared project", actionHEN: "Launch a concrete project together: Umrah, renovation, learning the Quran. A common goal.",
        titreFEN: "Couple project", actionFEN: "Suggest a shared project that will give you a common direction.",
        versetEN: "Consult them in the matter. And when you have decided, then rely upon Allah. (Quran 3:159)", psychoEN: "Having a common project channels the couple's energy toward the future rather than past grievances.",
      },
      {
        jour: 33,
        titreH: "Pardon total", actionH: "Est-ce qu'il reste quelque chose de non pardonné entre vous ? C'est le moment de le libérer.",
        titreF: "Pardon total", actionF: "Y a-t-il des rancœurs encore présentes ? C'est le moment de les déposer.",
        verset: "Qu'ils pardonnent et passent outre. N'aimez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", psycho: "Le pardon complet — libérer sans conditions — est la fondation d'un couple qui dure.",
        titreHEN: "Total forgiveness", actionHEN: "Is there anything not yet forgiven between you? Now is the moment to release it.",
        titreFEN: "Total forgiveness", actionFEN: "Are there still present resentments? Now is the moment to lay them down.",
        versetEN: "Let them pardon and overlook. Do you not love that Allah should forgive you? (Quran 24:22)", psychoEN: "Complete forgiveness — releasing unconditionally — is the foundation of a couple that lasts.",
      },
      {
        jour: 34,
        titreH: "Valorisation", actionH: "Dis-lui 5 choses que tu apprécies en elle. Regarde comment elle réagit.",
        titreF: "Valorisation", actionF: "Dis-lui 5 choses que tu admires en lui. Observe l'effet.",
        verset: "Le meilleur d'entre vous est le meilleur envers sa famille. (Tirmidhi)", psycho: "Les neurosciences montrent qu'il faut 5 interactions positives pour contrebalancer 1 interaction négative.",
        titreHEN: "Appreciation", actionHEN: "Tell her 5 things you appreciate about her. Watch how she reacts.",
        titreFEN: "Appreciation", actionFEN: "Tell him 5 things you admire in him. Observe the effect.",
        versetEN: "The best of you is the best to his family. (Tirmidhi)", psychoEN: "Neuroscience shows it takes 5 positive interactions to counterbalance 1 negative interaction.",
      },
      {
        jour: 35,
        titreH: "Gestion des crises futures", actionH: "Établissez ensemble une 'règle de crise' : que faites-vous quand une dispute monte ? Ex: pause de 10 min.",
        titreF: "Protocole de crise", actionF: "Convenez ensemble d'un protocole simple pour les prochaines tensions : comment vous allez les gérer.",
        verset: "Repousse [le mal] par ce qui est meilleur. Et voilà que celui qu'une inimitié séparait de toi devient un ami chaleureux. (Coran 41:34)", psycho: "Avoir un protocole pré-établi pour les conflits réduit leur intensité et leur durée de 60%.",
        titreHEN: "Managing future crises", actionHEN: "Establish together a 'crisis rule': what do you do when an argument escalates? E.g.: 10-min pause.",
        titreFEN: "Crisis protocol", actionFEN: "Agree together on a simple protocol for the next tensions: how you will handle them.",
        versetEN: "Repel [evil] with what is better. And behold, the one between whom and you was enmity will become a devoted friend. (Quran 41:34)", psychoEN: "Having a pre-established protocol for conflicts reduces their intensity and duration by 60%.",
      },
      {
        jour: 36,
        titreH: "Reconnaissance", actionH: "Remercie Allah pour ton mariage. Même les moments difficiles étaient des leçons.",
        titreF: "Shukr", actionF: "Remercie Allah sincèrement pour ce foyer et pour le chemin parcouru.",
        verset: "Si vous êtes reconnaissants, J'augmenterai vos bienfaits. (Coran 14:7)", psycho: "La gratitude envers ses épreuves — en plus des bénédictions — est le niveau le plus élevé de résilience.",
        titreHEN: "Gratitude", actionHEN: "Thank Allah for your marriage. Even the difficult moments were lessons.",
        titreFEN: "Shukr", actionFEN: "Thank Allah sincerely for this home and for the journey traveled.",
        versetEN: "If you are grateful, I will increase your blessings. (Quran 14:7)", psychoEN: "Gratitude toward one's trials — in addition to blessings — is the highest level of resilience.",
      },
      {
        jour: 37,
        titreH: "Témoignage", actionH: "Partage avec un proche de confiance comment ton couple a évolué. Tes mots peuvent aider d'autres.",
        titreF: "Partage", actionF: "Si tu le sens, partage ton expérience avec une amie de confiance. Ta trajectoire peut inspirer.",
        verset: "Et rappelle, car le rappel profite aux croyants. (Coran 51:55)", psycho: "Partager son expérience de transformation la consolide chez celui qui la raconte.",
        titreHEN: "Testimony", actionHEN: "Share with a trusted close one how your couple has evolved. Your words can help others.",
        titreFEN: "Sharing", actionFEN: "If you feel ready, share your experience with a trusted friend. Your journey can inspire.",
        versetEN: "And remind, for reminding benefits the believers. (Quran 51:55)", psychoEN: "Sharing one's transformation experience consolidates it in the one who shares it.",
      },
      {
        jour: 38,
        titreH: "Remercie-la", actionH: "Remercie-la pour sa patience pendant cette période. Même si elle ne sait pas que tu faisais ce programme.",
        titreF: "Remercie-le", actionF: "Remercie-le pour ce qu'il a fait de bien pendant cette période.",
        verset: "Celui qui ne remercie pas les gens ne remercie pas Allah. (Abu Dawud)", psycho: "La gratitude explicite envers son conjoint est l'un des prédicteurs les plus robustes de la satisfaction conjugale.",
        titreHEN: "Thank her", actionHEN: "Thank her for her patience during this period. Even if she doesn't know you were doing this program.",
        titreFEN: "Thank him", actionFEN: "Thank him for what he did well during this period.",
        versetEN: "Whoever does not thank people does not thank Allah. (Abu Dawud)", psychoEN: "Explicit gratitude toward one's spouse is one of the most robust predictors of marital satisfaction.",
      },
      {
        jour: 39,
        titreH: "Prépare la suite", actionH: "Le plan se termine demain. Prépare comment tu vas maintenir ces efforts sans programme.",
        titreF: "Prépare la suite", actionF: "Comment vas-tu maintenir ces bonnes habitudes après le programme ?",
        verset: "Les actes les plus aimés d'Allah sont ceux faits régulièrement, même s'ils sont peu nombreux. (Bukhari)", psycho: "Planifier 'l'après' est la condition sine qua non pour éviter la régression post-programme.",
        titreHEN: "Prepare what comes next", actionHEN: "The plan ends tomorrow. Prepare how you will maintain these efforts without a program.",
        titreFEN: "Prepare what comes next", actionFEN: "How will you maintain these good habits after the program?",
        versetEN: "The most beloved deeds to Allah are those done regularly, even if they are few. (Bukhari)", psychoEN: "Planning 'the after' is the sine qua non condition for avoiding post-program regression.",
      },
      {
        jour: 40,
        titreH: "40 jours — Félicitations !", actionH: "40 jours d'efforts sincères. MashaAllah. Ce soir, faites dua ensemble et demandez à Allah de consolider votre foyer pour toujours.",
        titreF: "40 jours — Félicitations !", actionF: "40 jours de courage, de foi et d'amour. Priez ensemble ce soir. Votre foyer a été reconstruit.",
        verset: "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux, et fais de nous un guide pour les pieux. (Coran 25:74)", psycho: "Vous avez choisi votre mariage. Vous avez choisi de vous battre pour lui. C'est le plus beau des choix.",
        titreHEN: "40 days — Congratulations!", actionHEN: "40 days of sincere efforts. MashaAllah. Tonight, make dua together and ask Allah to consolidate your home forever.",
        titreFEN: "40 days — Congratulations!", actionFEN: "40 days of courage, faith and love. Pray together tonight. Your home has been rebuilt.",
        versetEN: "Our Lord, grant us from our spouses and offspring the joy of our eyes, and make us a guide for the righteous. (Quran 25:74)", psychoEN: "You chose your marriage. You chose to fight for it. That is the most beautiful of choices.",
      },
    ],

    grave: [
      { jour: 1, titreH: "Istighfar et auto-examen", titreF: "Istighfar et auto-examen", actionH: "Commence par toi : fais de l'istighfar et demande sincèrement à Allah de t'aider à changer. Ex : 'Astaghfirullah' sincèrement. Puis dis-toi : 'Qu'est-ce que j'ai fait qui a contribué à cette situation ?'", actionF: "Commence par toi : fais de l'istighfar et demande sincèrement à Allah de t'aider à changer.", verset: "Demandez pardon à votre Seigneur, puis revenez à Lui repentants. (Coran 11:3)", psychoH: "L'istighfar régulier apaise le système nerveux et installe un état d'humilité qui est la condition de tout vrai changement.", titreHEN: "Istighfar and self-examination", titreFEN: "Istighfar and self-examination", actionHEN: "Start with yourself: make istighfar and sincerely ask Allah to help you change. Say 'Astaghfirullah' with sincerity. Then ask yourself: 'What did I do that contributed to this situation?'", actionFEN: "Start with yourself: make istighfar and sincerely ask Allah to help you change.", versetEN: "Ask forgiveness of your Lord and then turn to Him in repentance. (Quran 11:3)", psychoHEN: "Regular istighfar soothes the nervous system and installs a state of humility that is the condition for all real change.", psychoF: "L'istighfar sincère apaise le système nerveux et installe un état d'humilité. Avant de demander à l'autre de changer, commencer par soi est la seule voie qui ouvre vraiment quelque chose.", psychoFEN: "Sincere istighfar soothes the nervous system and installs a state of humility. Before asking the other to change, starting with yourself is the only path that truly opens something." },
      { jour: 2, titreH: "Maîtrise totale", titreF: "Douceur absolue", actionH: "Aujourd'hui : aucune parole dure. Silence bienveillant si nécessaire. Maîtrise totale. Ex : Quand l'envie de dire quelque chose de dur vient, ferme les yeux et dis 'Aouthou billahi min al-shaytan.'", actionF: "Aujourd'hui : aucune parole dure. Douceur absolue ou silence bienveillant si nécessaire.", verset: "Et lorsque les ignorants leur adressent la parole, ils répondent : 'Paix !' (salaman). (Coran 25:63)", psychoH: "Choisir le silence ou la douceur face à la provocation interne est l'acte le plus puissant de maîtrise. Le cerveau apprend par la répétition à désactiver les réactions automatiques.", titreHEN: "Total control", titreFEN: "Absolute gentleness", actionHEN: "Today: no harsh words. Benevolent silence if necessary. Total control. When the urge to say something harsh comes, close your eyes and say 'Aouthou billahi min al-shaytan.'", actionFEN: "Today: no harsh words. Absolute gentleness or benevolent silence if necessary.", versetEN: "And when the ignorant address them harshly, they say words of peace. (Quran 25:63)", psychoHEN: "Choosing silence or gentleness in the face of inner provocation is the most powerful act of self-control. The brain learns through repetition to disable automatic reactions.", psychoF: "Choisir la douceur dans un climat tendu est l'acte le plus puissant qu'une femme puisse poser dans une crise. La douceur n'est pas faiblesse — c'est une force qui déstabilise les schémas de violence verbale.", psychoFEN: "Choosing gentleness in a tense climate is the most powerful act a woman can offer in a crisis. Gentleness is not weakness — it is a strength that destabilizes patterns of verbal violence." },
      { jour: 3, titreH: "Geste concret", titreF: "Geste concret", actionH: "Fais un geste concret pour le foyer aujourd'hui. Même minime. Pour montrer ta volonté de changer. Ex : Rentre à l'heure. Range quelque chose. Prépare un repas. Un geste, sans attendre de retour.", actionF: "Fais un geste concret pour le foyer aujourd'hui. Même minime. Pour montrer ta volonté de changer la situation.", verset: "Et faites le bien. Certes, Allah aime les bienfaisants. (Coran 2:195)", psychoH: "Dans une relation abîmée, les actes silencieux prouvent l'intention mieux que les promesses. Le corps écoute ce que les oreilles ne croient plus.", titreHEN: "Concrete gesture", titreFEN: "Concrete gesture", actionHEN: "Make a concrete gesture for the home today. Even a small one. To show your willingness to change. Come home on time. Tidy something. Prepare a meal. One gesture, without expecting anything in return.", actionFEN: "Make a concrete gesture for the home today. Even a small one. To show your willingness to change the situation.", versetEN: "And do good. Indeed, Allah loves the doers of good. (Quran 2:195)", psychoHEN: "In a damaged relationship, silent acts prove intention better than promises. The body listens to what ears no longer believe.", psychoF: "Dans une relation abîmée, les actes silencieux d'attention prouvent l'intention mieux que les promesses. Le corps écoute ce que les oreilles ne croient plus.", psychoFEN: "In a damaged relationship, silent acts of care prove intention better than promises. The body listens to what ears no longer believe." },
      { jour: 4, titreH: "Moment calme ensemble", titreF: "Moment calme ensemble", actionH: "Si la situation le permet, propose un moment calme ensemble ce soir. Sans agenda, sans pression. Ex : 'Ce soir, si tu es d'accord, on discute de notre journée.'", actionF: "Si la situation le permet, propose un moment calme ensemble ce soir. Sans agenda, sans pression.", verset: "Et parmi Ses signes est qu'Il a créé pour vous des épouses. (Coran 30:21)", psychoH: "Renouer par des conversations légères avant d'aborder les sujets lourds évite les réactions défensives.", titreHEN: "Calm moment together", titreFEN: "Calm moment together", actionHEN: "If the situation allows, suggest a calm moment together tonight. No agenda, no pressure. 'Tonight, if you agree, let's talk about our day.'", actionFEN: "If the situation allows, suggest a calm moment together tonight. No agenda, no pressure.", versetEN: "And among His signs is that He created for you spouses. (Quran 30:21)", psychoHEN: "Reconnecting through light conversations before tackling heavy topics avoids defensive reactions.", psychoF: "Proposer un moment sans agenda crée un espace de réparation possible. Les conversations légères avant les sujets lourds évitent les réactions défensives et rouvrent doucement la porte.", psychoFEN: "Offering a moment without an agenda creates space for possible repair. Light conversations before heavy topics avoid defensive reactions and gently reopen the door." },
      { jour: 5, titreH: "Chercher de l'aide", titreF: "Sécurité prioritaire", actionH: "Si elle a accepté le moment ensemble, remercie-la. Sinon consulte aujourd'hui un imam, un conseiller conjugal ou une personne sage de confiance si la situation est trop tendue. Ex : Appelle un imam de confiance ou un conseiller : 'J'ai besoin d'aide pour mon mariage.'", actionF: "Ta sécurité est prioritaire. Si tu ne te sens pas en sécurité, parles-en à une personne de confiance.", verset: "Demandez aide par la patience et la prière. (Coran 2:45)", psychoH: "Dans les crises graves, chercher de l'aide extérieure ou se mettre en sécurité n'est pas un échec — c'est un acte de discernement et de courage.", titreHEN: "Seek help", titreFEN: "Safety first", actionHEN: "If she accepted the moment together, thank her. Otherwise, consult an imam, a marriage counselor or a trusted wise person today if the situation is too tense. 'I need help with my marriage.'", actionFEN: "Your safety is the priority. If you don't feel safe, speak to a trusted person.", versetEN: "Seek help through patience and prayer. (Quran 2:45)", psychoHEN: "In severe crises, seeking outside help or putting yourself in safety is not a failure — it is an act of discernment and courage.", psychoF: "Ta sécurité émotionnelle et physique passe avant tout — c'est non négociable. Parler à une personne de confiance n'est pas trahir le couple, c'est protéger ce qui peut encore être sauvé.", psychoFEN: "Your emotional and physical safety comes first — it is non-negotiable. Speaking to someone you trust is not betraying the couple, it is protecting what can still be saved." },
      { jour: 6, titreH: "Cartographier les déclencheurs", titreF: "Parole sans défense", actionH: "Identifie les 3 situations qui te font perdre patience le plus souvent (fatigue, ses paroles, sa famille...). Note-les sur papier. Anticiper, c'est désamorcer. Ex : 'Quand je suis fatigué + qu'elle parle de sa mère = je m'énerve. Note ces patterns.'", actionF: "Écris-lui une phrase simple sans te défendre : \"Je vois ma part dans ce qui s'est abîmé, et je veux avancer avec sincérité.\"", verset: "Et qui se garde de sa propre avarice... ceux-là sont ceux qui réussissent. (Coran 59:9)", psychoH: "La sincérité envers soi-même précède la sincérité envers l'autre. Identifier ses patterns ou exprimer sa part sans défense sont deux faces du même travail intérieur.", titreHEN: "Mapping the triggers", titreFEN: "Word without defense", actionHEN: "Identify the 3 situations where you most often lose patience (fatigue, her words, her family...). Note them on paper. Anticipating is defusing. Ex: 'When I'm tired + she talks about her mother = I get angry. Note these patterns.'", actionFEN: "Write him a simple sentence without defending yourself: \"I see my part in what has been damaged, and I want to move forward with sincerity.\"", versetEN: "And whoever is protected from the stinginess of their soul — those are the successful ones. (Quran 59:9)", psychoHEN: "Honesty with oneself precedes honesty with the other. Identifying your patterns or expressing your share without defense are two sides of the same inner work.", psychoF: "Reconnaître sa part sans se défendre est l'acte le plus courageux dans une crise. Cela désarme l'autre et ouvre un espace que la justification ferme à clé.", psychoFEN: "Recognizing your share without defending yourself is the most courageous act in a crisis. It disarms the other and opens a space that justification locks tight." },
      { jour: 7, titreH: "Prière commune", titreF: "Dua sincère", actionH: "Propose une prière commune très courte ce soir. Sans pression. Ex : 'On fait 2 rakats ensemble ? 2 minutes, pas plus. Juste nous deux devant Allah.'", actionF: "Fais du dua pour ton couple. Demande à Allah ce que tu ne peux absolument pas faire seule.", verset: "Établis la prière, certes la prière préserve de la turpitude et de l'acte blâmable. (Coran 29:45)", psychoH: "Prier côte à côte synchronise les rythmes respiratoires et cardiaques des deux conjoints. C'est une régulation émotionnelle profonde et silencieuse.", titreHEN: "Common prayer", titreFEN: "Sincere dua", actionHEN: "Suggest a very short common prayer tonight. No pressure. '2 rakats together? 2 minutes, no more. Just the two of us before Allah.'", actionFEN: "Make dua for your couple. Ask Allah for what you absolutely cannot do alone.", versetEN: "Establish prayer; indeed, prayer prohibits immorality and wrongdoing. (Quran 29:45)", psychoHEN: "Praying side by side synchronizes the breathing and cardiac rhythms of both spouses. It is a deep and silent emotional regulation.", psychoF: "Le dua sincère réoriente le cœur de la femme vers la solution plutôt que vers le problème. Confier à Allah ce qu'on ne peut pas faire seule libère la pression intérieure.", psychoFEN: "Sincere dua reorients a woman's heart toward the solution rather than the problem. Entrusting to Allah what you cannot do alone releases inner pressure." },
      { jour: 8, titreH: "Ouvrir le dialogue", titreF: "Ecriture libératrice", actionH: "Demande-lui : 'Qu'est-ce dont tu aurais besoin pour aller mieux dans notre relation ?' Ex : 'Qu'est-ce qui te ferait du bien concrètement ? Une chose que je pourrais faire dès demain ?'", actionF: "Écris ce que tu ressens dans une lettre. Pour clarifier tes émotions. Pas forcément à donner.", verset: "Et leur consultation entre eux est mutuelle. (Coran 42:38)", psychoH: "Reconnecter passe par exprimer ses besoins — à l'autre ou à soi-même par écrit. La clarification des émotions précède toujours la résolution du conflit.", titreHEN: "Open dialogue", titreFEN: "Liberating writing", actionHEN: "Ask her: 'What would you need to feel better in our relationship?' 'What would concretely help you? One thing I could do tomorrow?'", actionFEN: "Write what you feel in a letter. To clarify your emotions. Not necessarily to give.", versetEN: "And their affairs are conducted by mutual consultation. (Quran 42:38)", psychoHEN: "Reconnecting starts with expressing needs — to the other person, or to yourself through writing. Clarifying emotions always precedes resolving conflict.", psychoF: "L'écriture libératrice permet d'exprimer ce que la parole bloque. Mettre ses émotions sur papier les clarifie pour soi-même — et les rend nommables plus tard.", psychoFEN: "Liberating writing allows you to express what speech blocks. Putting emotions on paper clarifies them for yourself — and makes them nameable later." },
      { jour: 9, titreH: "Silence et maîtrise", titreF: "Douceur totale", actionH: "Maîtrise totale aujourd'hui. Pas un reproche, pas un mot dur, pas un soupir d'agacement. Ex : Toute la journée, si une parole dure vient : lèvre fermée. Rien. Zéro.", actionF: "Douceur totale aujourd'hui. Que ta parole soit exclusivement douce, même en cas de tension.", verset: "Repousse [le mal] par ce qui est meilleur. Et voilà que celui qu'une inimitié séparait de toi devient un ami chaleureux. (Coran 41:34)", psychoH: "Une journée de maîtrise totale ou de douceur absolue rompt les cycles automatiques de réaction et crée un nouveau schéma neuronal.", titreHEN: "Silence and control", titreFEN: "Total gentleness", actionHEN: "Total control today. Not a single reproach, not a harsh word, not a sigh of irritation. All day long, if a harsh word comes: lips closed. Nothing. Zero.", actionFEN: "Total gentleness today. Let your words be exclusively gentle, even in case of tension.", versetEN: "Repel [evil] with what is better, and behold, the one between whom and you was enmity will become a devoted friend. (Quran 41:34)", psychoHEN: "A day of complete self-mastery or absolute gentleness breaks automatic reaction cycles and creates a new neural pattern.", psychoF: "Une journée de douceur totale rompt le cycle de la réaction automatique. Le cerveau apprend par la répétition à désactiver les vieilles habitudes verbales.", psychoFEN: "A day of total gentleness breaks the cycle of automatic reaction. The brain learns through repetition to disable old verbal habits." },
      { jour: 10, titreH: "Honnêteté envers soi", titreF: "Honnêteté envers soi", actionH: "Es-tu sincèrement engagé dans ce programme ? Honnêteté totale envers toi-même. Ex : 'Est-ce que je fais vraiment de mon mieux ou j'attends juste que ça passe ? Sois honnête.'", actionF: "Es-tu sincèrement engagée dans ce programme ? Honnêteté totale envers toi-même.", verset: "Certes, Allah ne modifie pas l'état d'un peuple tant qu'ils ne changent pas ce qui est en eux. (Coran 13:11)", psychoH: "L'auto-évaluation honnête à ce stade est le moment le plus critique d'un programme de changement.", titreHEN: "Honesty with oneself", titreFEN: "Honesty with oneself", actionHEN: "Are you sincerely committed to this program? Total honesty with yourself. 'Am I truly doing my best or am I just waiting for it to pass? Be honest.'", actionFEN: "Are you sincerely committed to this program? Total honesty with yourself.", versetEN: "Verily, Allah does not change the condition of a people until they change what is within themselves. (Quran 13:11)", psychoHEN: "Honest self-assessment at this stage is the most critical moment in a change program.", psychoF: "L'auto-évaluation honnête à ce stade est le moment le plus critique du parcours. Sans sincérité avec soi, aucun changement n'est durable.", psychoFEN: "Honest self-assessment at this stage is the most critical moment of the journey. Without honesty with yourself, no change is lasting." },
      { jour: 11, titreH: "Vulnérabilité partagée", titreF: "Chercher de l'aide", actionH: "Partage quelque chose de vulnérable avec elle si la sécurité le permet. Ex : 'Je sais que tu as l'impression que je ne t'entends pas. Je t'entends. J'ai peur.'", actionF: "Consulte une personne de confiance ou un imam cette semaine le cas échéant si ce n'est pas encore fait.", verset: "Aidez-vous mutuellement dans l'accomplissement des bonnes œuvres et de la piété. (Coran 5:2)", psychoH: "S'ouvrir à l'autre par la vulnérabilité ou s'ouvrir à une aide extérieure procèdent du même mouvement : reconnaître qu'on ne peut pas tout porter seul.", titreHEN: "Shared vulnerability", titreFEN: "Seek help", actionHEN: "Share something vulnerable with her if safety allows. 'I know you feel I don't hear you. I do hear you. I'm afraid.'", actionFEN: "Consult a trusted person or an imam this week if necessary if it hasn't been done yet.", versetEN: "Help one another in righteousness and piety. (Quran 5:2)", psychoHEN: "Opening up through vulnerability or opening up to outside help come from the same movement: acknowledging you cannot carry everything alone.", psychoF: "Chercher de l'aide extérieure n'est pas un échec mais un signe de maturité et d'amour pour son foyer. Une femme qui demande de l'aide se respecte assez pour ne pas s'épuiser seule.", psychoFEN: "Seeking outside help is not a failure but a sign of maturity and love for your home. A woman who asks for help respects herself enough not to exhaust herself alone." },
      { jour: 12, titreH: "Trouver une qualité", titreF: "Prière commune", actionH: "Pense à une seule qualité réelle de ta femme. Une seule. Fixe-toi dessus toute la journée. Ex : Cherche une qualité aujourd'hui. Une seule vraie. Fixe-toi dessus toute la journée.", actionF: "Propose une prière commune très courte ce soir. Sans pression.", verset: "Notre Seigneur, accorde-nous de nos épouses la joie des yeux. (Coran 25:74)", psychoH: "Voir le bien chez l'autre — par la prière commune ou par la recherche d'une qualité — est un acte de foi. Le regard positif construit ce qu'il cherche.", titreHEN: "Find one quality", titreFEN: "Common prayer", actionHEN: "Think of one real quality of your wife. Just one. Focus on it all day.", actionFEN: "Suggest a very short common prayer tonight. No pressure.", versetEN: "Our Lord, grant us from among our wives comfort to our eyes. (Quran 25:74)", psychoHEN: "Seeing the good in the other — through shared prayer or actively looking for a quality — is an act of faith. A positive gaze builds what it seeks.", psychoF: "Prier côte à côte synchronise les rythmes respiratoires et cardiaques. C'est une régulation émotionnelle silencieuse, plus puissante que toute conversation.", psychoFEN: "Praying side by side synchronizes breathing and heart rhythms. It is a silent emotional regulation, more powerful than any conversation." },
      { jour: 13, titreH: "Engager une vraie démarche", titreF: "Trouver une qualité", actionH: "Si rien n'a vraiment bougé depuis 2 semaines, prends un vrai rendez-vous avec un thérapeute conjugal ou un imam spécialisé. Pas un appel vague — un créneau fixé. Ex : 'J'ai pris rendez-vous avec [imam/conseiller]. Est-ce que tu accepterais de venir la prochaine fois ?'", actionF: "Pense à une seule qualité réelle de ton mari. Une seule. Fixe-toi dessus toute la journée.", verset: "Et si vous craignez le désaccord entre les deux, désignez alors un arbitre de sa famille et un arbitre de la sienne. (Coran 4:35)", psychoH: "Demander de l'aide n'est pas un échec mais un acte de maturité. 70% des couples qui consultent à temps évitent une séparation.", titreHEN: "Take a real step", titreFEN: "Find one quality", actionHEN: "If nothing has really moved in 2 weeks, book a real appointment with a marriage counselor or a qualified imam. Not a vague call — a fixed slot. Ex: 'I made an appointment with [imam/counselor]. Would you agree to come next time?'", actionFEN: "Think of one real quality of your husband. Just one. Focus on it all day.", versetEN: "And if you fear dissension between the two, send an arbitrator from his people and an arbitrator from her people. (Quran 4:35)", psychoHEN: "Asking for help is not a failure but an act of maturity. 70% of couples who seek counseling in time avoid separation.", psychoF: "Le cerveau humain a un biais de négativité qui amplifie les défauts. Chercher activement une seule qualité chez lui rééquilibre cette distorsion et change le regard.", psychoFEN: "The human brain has a negativity bias that amplifies flaws. Actively seeking one quality in him rebalances this distortion and changes the gaze." },
      { jour: 14, titreH: "Deux semaines — bilan", titreF: "Deux semaines — bilan", actionH: "2 semaines. Qu'est-ce qui a changé, même légèrement ? Si rien n'a changé, pose-toi la question pourquoi. Ex : 'Depuis 2 semaines, je n'ai pas crié. C'est un progrès. Est-ce que tu le remarques ?'", actionF: "2 semaines. Qu'est-ce qui a changé, même légèrement ? Si rien n'a changé, pose-toi la question pourquoi.", verset: "Et certes, avec la difficulté il y a une facilité. (Coran 94:6)", psychoH: "Faire un bilan ou chercher activement une qualité sont deux formes d'auto-évaluation honnête. À 2 semaines, on commence à voir ce qui change réellement.", titreHEN: "Two weeks — taking stock", titreFEN: "Two weeks — review", actionHEN: "2 weeks. What has changed, even slightly? If nothing has changed, ask yourself why. Ex: 'For 2 weeks now, I haven't raised my voice. That's progress. Do you notice it?'", actionFEN: "2 weeks. What has changed, even slightly? If nothing has changed, ask yourself why.", versetEN: "Indeed, with hardship comes ease. (Quran 94:6)", psychoHEN: "Taking stock or actively seeking a quality are two forms of honest self-assessment. After 2 weeks, you begin to see what is truly changing.", psychoF: "À 2 semaines, on commence à voir ce qui change réellement. Reconnaître même un micro-progrès chez soi ou dans la relation maintient l'élan pour les semaines suivantes.", psychoFEN: "After 2 weeks, you begin to see what is truly changing. Recognizing even a micro-progress in yourself or in the relationship maintains momentum for the weeks ahead." },
      { jour: 15, titreH: "Sortir de l'espace", titreF: "Vulnérabilité partagée", actionH: "Changez de lieu aujourd'hui si possible. Un café, une promenade. Sortez de l'espace du conflit. Ex : 'On va dans un café ? Juste changer d'air. Sans parler de ce qui s'est passé.'", actionF: "Partage quelque chose de vulnérable avec lui si la sécurité le permet.", verset: "Et parmi Ses signes, Il a créé pour vous des épouses... et Il a mis entre vous affection et miséricorde. (Coran 30:21)", psychoH: "Sortir de l'espace du conflit ou partager une vulnérabilité créent la même chose : un nouvel espace, neutre, où l'autre peut être vu autrement.", titreHEN: "Leave the space", titreFEN: "Shared vulnerability", actionHEN: "Change location today if possible. A café, a walk. Leave the space of conflict. 'Shall we go to a café? Just to change the air. Without talking about what happened.'", actionFEN: "Share something vulnerable with him if safety allows.", versetEN: "And of His signs is that He created for you mates... and He placed between you affection and mercy. (Quran 30:21)", psychoHEN: "Stepping out of the conflict space or sharing a vulnerability create the same thing: a new, neutral space where the other can be seen differently.", psychoF: "La vulnérabilité partagée est le chemin le plus court vers la reconnexion émotionnelle. Mais elle exige un environnement minimum de sécurité — sinon elle blesse au lieu de soigner.", psychoFEN: "Shared vulnerability is the shortest path to emotional reconnection. But it requires a minimum safe environment — otherwise it wounds instead of healing." },
      { jour: 16, titreH: "Réécrire le récit", titreF: "Changer de lieu", actionH: "Écris en une phrase ce que cette crise t'apprend sur toi-même. Pas ce qu'elle t'a fait — ce qu'elle t'apprend. Ex : 'Cette crise m'apprend que je dois mieux gérer mon silence quand je suis blessé.'", actionF: "Changez de lieu aujourd'hui si possible. Un café, une promenade. Sortez de l'espace du conflit.", verset: "Il se peut que vous ayez de l'aversion pour une chose alors qu'elle vous est un bien. (Coran 2:216)", psychoH: "Réécrire le sens d'une épreuve ou en sortir physiquement, c'est refuser que la crise écrive seule notre histoire.", titreHEN: "Rewriting the narrative", titreFEN: "Change of place", actionHEN: "Write in one sentence what this crisis teaches you about yourself. Not what it did to you — what it teaches you. Ex: 'This crisis teaches me that I need to better manage my silence when I am hurt.'", actionFEN: "Change location today if possible. A café, a walk. Leave the space of conflict.", versetEN: "Perhaps you dislike a thing which is good for you. (Quran 2:216)", psychoHEN: "Rewriting the meaning of a trial or physically stepping away from it is refusing to let the crisis write our story alone.", psychoF: "Changer d'environnement casse les associations négatives liées au foyer. Le cerveau réinterprète la relation autrement dans un cadre neuf.", psychoFEN: "Changing environment breaks the negative associations linked to the home. The brain reinterprets the relationship differently in a new setting." },
      { jour: 17, titreH: "Réunion hebdomadaire", titreF: "Cartographier les déclencheurs", actionH: "Mettre en place une réunion hebdomadaire à jour et heure fixe pour parler de la semaine, de ce qui était positif et de ce qui est à améliorer.", actionF: "Identifie les 3 situations qui te font perdre patience le plus souvent (fatigue, ses paroles, sa famille, sa froideur...). Note-les sur papier. Anticiper, c'est désamorcer.", verset: "Et qui se garde de sa propre avarice... ceux-là sont ceux qui réussissent. (Coran 59:9)", psychoH: "Anticiper ses déclencheurs ou structurer un temps d'échange régulier sont deux outils de prévention. Les couples solides anticipent au lieu de réagir.", titreHEN: "Weekly meeting", titreFEN: "Mapping the triggers", actionHEN: "Set up a weekly meeting at a fixed day and time to talk about the week, what was positive and what needs to improve.", actionFEN: "Identify the 3 situations where you most often lose patience (fatigue, his words, his family, his coldness...). Note them on paper. Anticipating is defusing.", versetEN: "And whoever is protected from the stinginess of their soul — those are the successful ones. (Quran 59:9)", psychoHEN: "Anticipating your triggers or structuring a regular check-in are two prevention tools. Strong couples anticipate instead of reacting.", psychoF: "Identifier ce qui te fait perdre patience est la première étape pour ne plus le subir. Anticiper sa propre réaction désamorce ce que la surprise enflamme.", psychoFEN: "Identifying what makes you lose patience is the first step to no longer suffering it. Anticipating your own reaction defuses what surprise inflames." },
      { jour: 18, titreH: "Valorisation publique", titreF: "Ouvrir le dialogue", actionH: "Dis quelque chose de bien sur ta femme devant quelqu'un si possible. Dans la crise, protège encore son honneur. Ex : Devant quelqu'un : 'Ma femme est quelqu'un d'exceptionnel. Je suis fier d'elle.'", actionF: "Demande-lui : 'Qu'est-ce dont tu aurais besoin pour aller mieux dans notre relation ?'", verset: "Vivez avec elles de façon convenable. (Coran 4:19)", psychoH: "Honorer l'autre publiquement ou demander ses besoins, c'est reconnaître sa valeur. Le respect est l'oxygène de toute relation durable.", titreHEN: "Public appreciation", titreFEN: "Open dialogue", actionHEN: "Say something positive about your wife in front of someone if possible. In the crisis, still protect her honor. 'My wife is someone exceptional. I'm proud of her.'", actionFEN: "Ask him: 'What would you need to feel better in our relationship?'", versetEN: "Live with them in kindness. (Quran 4:19)", psychoHEN: "Honoring the other publicly or asking about their needs is recognizing their worth. Respect is the oxygen of any lasting relationship.", psychoF: "Demander à l'autre de quoi il a besoin est plus efficace que de deviner. Ouvrir cette question, c'est reconnaître sa valeur et son droit à être entendu.", psychoFEN: "Asking the other what they need is more effective than guessing. Opening this question recognizes their worth and their right to be heard." },
      { jour: 19, titreH: "Dhikr et reconnexion", titreF: "Refonder les bases", actionH: "Introduis un élément spirituel dans ta journée : dhikr, lecture, dua. Reconnecte-toi à Allah. Ex : 'Astaghfirullah 33 fois. Alhamdulillah 33 fois. Allahu Akbar 33 fois.' Avant de dormir.", actionF: "Si la communication le permet, parle de refonder les bases ensemble.", verset: "Et tenez-vous tous fortement au câble d'Allah et ne soyez pas divisés entre vous. (Coran 3:103)", psychoH: "Le dhikr ou la refondation des bases procèdent du même geste : revenir au fondement. Tout ce qui s'est éloigné peut revenir à sa source.", titreHEN: "Dhikr and reconnection", titreFEN: "Reestablish the foundation", actionHEN: "Introduce a spiritual element into your day: dhikr, reading, dua. Reconnect with Allah. 'Astaghfirullah 33 times. Alhamdulillah 33 times. Allahu Akbar 33 times.' Before sleeping.", actionFEN: "If communication allows, talk about rebuilding the foundations together.", versetEN: "And hold firmly to the rope of Allah all together and do not become divided. (Quran 3:103)", psychoHEN: "Dhikr or rebuilding the foundation come from the same gesture: returning to the source. Anything that has drifted away can come back to its origin.", psychoF: "Reconstruire demande deux personnes. Mais faire sa part — proposer la refondation — est déjà un acte de foi dans le couple.", psychoFEN: "Rebuilding requires two people. But doing your part — proposing the refounding — is already an act of faith in the couple." },
      { jour: 20, titreH: "20 jours — reconnaître", titreF: "20 jours — ma force", actionH: "20 jours dans une crise grave. Tu tiens. C'est immense. Reconnais cet effort en toi. Ex : 'Je tiens depuis 20 jours. Ce n'est pas rien. Et toi tu tiens aussi. MashaAllah à nous deux.'", actionF: "20 jours dans une crise grave. Tu tiens. C'est immense. Reconnais ta force et ta foi.", verset: "Certes, avec la difficulté il y a une facilité. (Coran 94:5)", psychoH: "La conscience du chemin parcouru est un facteur décisif de persévérance sur les 20 derniers jours.", titreHEN: "20 days — acknowledge", titreFEN: "20 days — my strength", actionHEN: "20 days in a serious crisis. You are holding on. That is immense. Acknowledge this effort. 'I've been holding on for 20 days. That's not nothing. And you're holding on too. MashaAllah to us both.'", actionFEN: "20 days in a serious crisis. You are holding on. That is immense. Acknowledge your strength and your faith.", versetEN: "Verily, with difficulty comes ease. (Quran 94:5)", psychoHEN: "Awareness of the journey traveled is a decisive factor in perseverance for the last 20 days.", psychoF: "Reconnaître son propre courage à mi-parcours est un facteur décisif de persévérance. 20 jours dans une crise grave est une preuve d'engagement et de foi.", psychoFEN: "Recognizing your own courage at mid-point is a decisive factor in perseverance. 20 days in a serious crisis is proof of commitment and faith." },
      { jour: 21, titreH: "Geste affectueux", titreF: "Dhikr et reconnexion", actionH: "Un geste physique affectueux si la sécurité et le consentement le permettent. Ex : Pose la main sur son épaule en passant. Juste ça. Doux, sans rien dire.", actionF: "Introduis un élément spirituel dans ta journée : dhikr, lecture, dua. Reconnecte-toi à Allah.", verset: "Elles sont un vêtement pour vous et vous êtes un vêtement pour elles. (Coran 2:187)", psychoH: "Le toucher affectueux ou le dhikr régulier : tous deux apaisent le système nerveux. Le corps a sa propre mémoire, et il se souvient de la tendresse.", titreHEN: "Affectionate gesture", titreFEN: "Dhikr and reconnection", actionHEN: "An affectionate physical gesture if safety and consent allow. Place your hand on her shoulder in passing. Just that. Gentle, without saying anything.", actionFEN: "Introduce a spiritual element into your day: dhikr, reading, dua. Reconnect with Allah.", versetEN: "They are clothing for you and you are clothing for them. (Quran 2:187)", psychoHEN: "Affectionate touch or regular dhikr: both soothe the nervous system. The body has its own memory, and it remembers tenderness.", psychoF: "Le dhikr régulier apaise le système nerveux et stabilise ce que la relation éprouve. Quand le couple chancelle, la reconnexion à Allah devient le socle qui tient.", psychoFEN: "Regular dhikr soothes the nervous system and stabilizes what the relationship is testing. When the couple wavers, reconnection to Allah becomes the foundation that holds." },
      { jour: 22, titreH: "Lettre émotionnelle", titreF: "Valorisation publique", actionH: "Écris ce que tu ressens dans une lettre. Pas forcément à donner — pour clarifier tes émotions. Ex : Écris dans un journal ce que tu ressens vraiment. Pas pour elle. Pour clarifier.", actionF: "Parle de lui en bien devant quelqu'un. Dans la crise, protège encore son honneur.", verset: "Et parmi Ses signes, Il a créé pour vous des épouses... et Il a mis entre vous affection et miséricorde. (Coran 30:21)", psychoH: "Honorer l'autre — en écrivant ses émotions ou en parlant bien de lui — protège l'amour. Le regard porté sur l'autre façonne ce qu'on devient ensemble.", titreHEN: "Emotional letter", titreFEN: "Public appreciation", actionHEN: "Write what you feel in a letter. Not necessarily to give — to clarify your emotions. Write in a journal what you truly feel. Not for her. To clarify.", actionFEN: "Speak well of him in front of someone. In the crisis, still protect his honor.", versetEN: "And of His signs is that He created for you mates... and He placed between you affection and mercy. (Quran 30:21)", psychoHEN: "Honoring the other — by writing your emotions or speaking well of them — protects love. The way we look at the other shapes who we become together.", psychoF: "Protéger l'honneur de son mari dans la crise — surtout quand on est blessée — est l'une des plus belles qualités de l'épouse. Ce que tu dis de lui dehors façonne ce qu'il devient pour toi dedans.", psychoFEN: "Protecting your husband's honor in the crisis — especially when you are hurt — is one of the finest qualities of a wife. What you say about him outside shapes who he becomes for you inside." },
      { jour: 23, titreH: "Ce qui mérite d'être sauvé", titreF: "Réécrire le sens", actionH: "Note 3 choses précieuses de ton couple qui méritent qu'on se batte pour elles. Tes enfants, un projet commun, vos premières années. Ex : 'Ce qui mérite d'être sauvé : nos enfants, notre projet de maison, le respect mutuel qui reste.'", actionF: "Écris en une phrase ce que cette crise t'apprend sur toi-même. Pas ce qu'elle t'a fait — ce qu'elle t'apprend. Ex : 'Cette crise m'apprend à exprimer mes besoins au lieu de les taire.'", verset: "Il se peut que vous ayez de l'aversion pour une chose alors qu'elle vous est un bien. (Coran 2:216)", psychoH: "Lister ce qui mérite d'être sauvé ou trouver le sens caché de l'épreuve : dans les deux cas, on refuse de laisser la douleur définir le tout.", titreHEN: "What is worth saving", titreFEN: "Rewriting the meaning", actionHEN: "Note 3 precious things about your couple that are worth fighting for. Your children, a shared project, your early years. Ex: 'What is worth saving: our children, our house project, the mutual respect that remains.'", actionFEN: "Write in one sentence what this crisis teaches you about yourself. Not what it did to you — what it teaches you. Ex: 'This crisis teaches me to express my needs instead of keeping them silent.'", versetEN: "Perhaps you dislike a thing which is good for you. (Quran 2:216)", psychoHEN: "Listing what deserves to be saved or finding the hidden meaning of the trial: in both cases, we refuse to let pain define everything.", psychoF: "Donner un sens à une épreuve est ce que les psychologues appellent la croissance post-traumatique. Une femme qui transforme sa douleur en apprentissage refuse de laisser la crise écrire seule son histoire.", psychoFEN: "Giving meaning to a trial is what psychologists call post-traumatic growth. A woman who turns her pain into learning refuses to let the crisis write her story alone." },
      { jour: 24, titreH: "Lettre de gratitude", titreF: "Ce qui mérite d'être sauvé", actionH: "Écris ce pour quoi tu es reconnaissant dans cette relation. Même difficile à trouver. Ex : 'Même dans cette période difficile, je suis reconnaissant pour [chose précise].'", actionF: "Note 3 choses précieuses de ton couple ou de votre histoire qui méritent qu'on se batte pour elles. Ex : vos enfants, un projet commun, vos premières années, un souvenir précis.", verset: "Et Il a mis entre vous affection (mawadda) et bienveillance (rahma). (Coran 30:21)", psychoH: "Exprimer la gratitude ou nommer ce qui mérite d'être sauvé : deux façons de regarder ce qui reste plutôt que ce qui manque.", titreHEN: "Gratitude letter", titreFEN: "What is worth saving", actionHEN: "Write what you are grateful for in this relationship. Even if difficult to find. 'Even in this difficult period, I am grateful for [specific thing].'", actionFEN: "Note 3 precious things about your couple or your story that are worth fighting for. Ex: your children, a shared project, your early years, a specific memory.", versetEN: "And He placed between you affection (mawadda) and mercy (rahma). (Quran 30:21)", psychoHEN: "Expressing gratitude or naming what deserves to be saved: two ways of looking at what remains rather than what is missing.", psychoF: "En période de crise, le cerveau focalise sur le négatif. Lister volontairement ce qui mérite d'être préservé rééquilibre cette distorsion et redonne la force de continuer.", psychoFEN: "In times of crisis, the brain focuses on the negative. Voluntarily listing what deserves to be preserved rebalances this distortion and restores the strength to continue." },
      { jour: 25, titreH: "Engagement commun", titreF: "Gratitude sincère", actionH: "Proposez une seule règle simple que vous vous engagez tous les deux à respecter. Ex : 'Je propose une seule règle : on ne se couche jamais fâchés. On peut ne pas être d'accord mais on se dit bonsoir.'", actionF: "Écris ce pour quoi tu es reconnaissante dans cette relation. Même difficile à trouver.", verset: "Si vous êtes reconnaissants, J'augmenterai vos bienfaits. (Coran 14:7)", psychoH: "Exprimer de la gratitude même dans les périodes difficiles renforce la résilience du couple.", titreHEN: "Shared commitment", titreFEN: "Sincere gratitude", actionHEN: "Suggest one simple rule you both commit to respecting. 'I propose one rule: we never go to bed angry. We can disagree but we say goodnight.'", actionFEN: "Write what you are grateful for in this relationship. Even if difficult to find.", versetEN: "If you are grateful, I will increase your blessings. (Quran 14:7)", psychoHEN: "Expressing gratitude even in difficult periods strengthens the couple's resilience.", psychoF: "Exprimer de la gratitude même dans les périodes difficiles renforce la résilience du couple. Écrire ce qu'on remercie ancre le positif dans la mémoire émotionnelle.", psychoFEN: "Expressing gratitude even in difficult periods strengthens the couple's resilience. Writing what you give thanks for anchors the positive in emotional memory." },
      { jour: 26, titreH: "Lever un non-dit", titreF: "Engagement commun", actionH: "Choisis UN sujet que vous évitez depuis longtemps. Aborde-le calmement, sans accusation. Une seule chose. Ex : 'Il y a un sujet qu'on évite depuis longtemps. Est-ce qu'on peut en parler ce soir, calmement, 10 minutes ?'", actionF: "Proposez une seule règle simple que vous vous engagez tous les deux à respecter.", verset: "Et dites aux gens de bonnes paroles. (Coran 2:83)", psychoH: "Lever un non-dit avec douceur ou s'engager à une règle commune : deux manières de poser un mot là où il y avait du silence ou du flou.", titreHEN: "Lift the unspoken", titreFEN: "Shared commitment", actionHEN: "Choose ONE subject you have been avoiding for a long time. Bring it up calmly, without accusation. Just one thing. Ex: 'There is a subject we have been avoiding for a long time. Can we talk about it tonight, calmly, 10 minutes?'", actionFEN: "Suggest one simple rule you both commit to respecting.", versetEN: "And speak to people good words. (Quran 2:83)", psychoHEN: "Gently bringing up an unspoken issue or committing to a shared rule: two ways of placing a word where there was silence or uncertainty.", psychoF: "Co-créer une règle de fonctionnement augmente l'adhésion et le sentiment d'équité. Un seul engagement tenu vaut mieux que dix promesses oubliées.", psychoFEN: "Co-creating an operating rule increases adherence and the sense of fairness. One commitment kept is worth more than ten forgotten promises." },
      { jour: 27, titreH: "Te pardonner à toi-même", titreF: "Lever un non-dit", actionH: "Pardonne-toi pour tes erreurs passées. Tu n'es pas tes pires moments. Allah est Ar-Rahman pour celui qui revient à Lui. Ex : Dis-toi à voix haute : 'Je me pardonne. Je demande pardon à Allah. Je peux avancer.'", actionF: "Choisis UN sujet que vous évitez depuis longtemps. Aborde-le calmement, sans accusation, en parlant de tes ressentis. Une seule chose. Ex : 'Il y a un sujet que j'évite depuis longtemps avec toi. Est-ce qu'on peut en parler 10 minutes ce soir, sereinement ?'", verset: "Ne désespérez pas de la miséricorde d'Allah. Allah pardonne tous les péchés. (Coran 39:53)", psychoH: "Se pardonner ou ouvrir un sujet évité, c'est libérer un poids intérieur. Ce qu'on porte en silence finit toujours par peser sur la relation.", titreHEN: "Forgive yourself", titreFEN: "Lift the unspoken", actionHEN: "Forgive yourself for your past mistakes. You are not your worst moments. Allah is Ar-Rahman for the one who returns to Him. Tell yourself out loud: 'I forgive myself. I ask Allah for forgiveness. I can move forward.'", actionFEN: "Choose ONE subject you have been avoiding with him for a long time. Bring it up calmly, without accusation, speaking from your feelings. Just one thing. Ex: 'There is a subject I have been avoiding for a long time. Can we talk about it 10 minutes tonight, serenely?'", versetEN: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins. (Quran 39:53)", psychoHEN: "Forgiving yourself or opening up an avoided subject releases an inner burden. What we carry in silence always ends up weighing on the relationship.", psychoF: "Les non-dits accumulés deviennent des murs invisibles. Nommer calmement un sujet évité, en parlant de tes ressentis, libère une charge émotionnelle énorme — sans accuser.", psychoFEN: "Accumulated unspoken issues become invisible walls. Calmly naming an avoided subject, speaking from your feelings, releases an enormous emotional charge — without accusing." },
      { jour: 28, titreH: "Renouveau d'engagement", titreF: "Te pardonner à toi-même", actionH: "Si le moment est venu, proposez un renouvellement de votre engagement. Devant Allah. Ex : 'Devant Allah, je veux recommencer. Pas effacer — recommencer avec ce qu'on a appris.'", actionF: "Pardonne-toi pour tes erreurs passées dans la relation. Tu n'es pas tes pires moments. Allah est Ar-Rahman pour celle qui revient à Lui sincèrement. Ex : Dis-toi à voix haute : 'Je me pardonne. Je demande pardon à Allah. Je peux avancer.'", verset: "Elles ont pris de vous un engagement solennel. (Coran 4:21)", psychoH: "Renouveler son engagement ou se pardonner à soi-même : tous deux ouvrent un nouveau chapitre. Devant Allah, ce qui est passé peut être laissé derrière.", titreHEN: "Renewed commitment", titreFEN: "Forgive yourself", actionHEN: "If the moment has come, suggest a renewal of your commitment. Before Allah. 'Before Allah, I want to start again. Not erase — start again with what we've learned.'", actionFEN: "Forgive yourself for your past mistakes in the relationship. You are not your worst moments. Allah is Ar-Rahman for she who returns to Him sincerely. Tell yourself out loud: 'I forgive myself. I ask Allah for forgiveness. I can move forward.'", versetEN: "They have taken from you a solemn covenant. (Quran 4:21)", psychoHEN: "Renewing your commitment or forgiving yourself: both open a new chapter. Before Allah, what is past can be left behind.", psychoF: "Le pardon de soi est aussi sacré que le pardon de l'autre. Une femme qui ne se pardonne pas reste prisonnière de son passé et ne peut pas avancer. Allah est Ar-Rahman pour celle qui revient à Lui.", psychoFEN: "Self-forgiveness is as sacred as forgiving the other. A woman who does not forgive herself remains imprisoned by her past and cannot move forward. Allah is Ar-Rahman for she who returns to Him." },
      { jour: 29, titreH: "Forces nées de la crise", titreF: "Renouveau d'engagement", actionH: "Quelles habitudes nées de la crise veux-tu transformer en force pour l'avenir ? Ex : 'Chaque crise m'a appris quelque chose. Je suis plus patient. Mieux à l'écoute. C'est une force.'", actionF: "Si le moment est venu, proposez un renouvellement de votre engagement. Devant Allah.", verset: "Et quant aux bienfaits de ton Seigneur, raconte-les. (Coran 93:11)", psychoH: "Reconnaître ce que l'épreuve a forgé en soi est ce qu'on appelle la croissance post-traumatique. Les couples qui durent sont ceux qui transforment leurs cicatrices en force.", titreHEN: "Strengths born from the crisis", titreFEN: "Renewed commitment", actionHEN: "What habits born from the crisis do you want to turn into strengths for the future? Ex: 'Every crisis has taught me something. I'm more patient. A better listener. That's a strength.'", actionFEN: "If the moment has come, suggest a renewal of your commitment. Before Allah.", versetEN: "And as for the favor of your Lord, proclaim it. (Quran 93:11)", psychoHEN: "Recognizing what the trial has forged in you is what is called post-traumatic growth. Couples who last are those who turn their scars into strength.", psychoF: "Le renouvellement symbolique d'un engagement a un impact psychologique comparable à une nouvelle promesse. Cela réactive les circuits de l'attachement et crée un effet de nouveau départ.", psychoFEN: "The symbolic renewal of a commitment has a psychological impact comparable to a new promise. It reactivates attachment circuits and creates a fresh-start effect." },
      { jour: 30, titreH: "30 jours — gratitude", titreF: "30 jours — je tiens", actionH: "30 jours dans une crise grave. Tu as tenu. Allah a vu chaque effort. Ex : 'Alhamdulillah. 30 jours dans une crise grave. On est encore là. C'est Allah qui nous a tenus.'", actionF: "30 jours dans une crise grave. Tu as tenu. Allah a vu chaque larme et chaque effort.", verset: "Et certes, avec la difficulté il y a une facilité. (Coran 94:6)", psychoH: "Atteindre le jalon des 30 jours dans une crise grave et le reconnaître devant Allah ancre profondément la transformation. Nommer la gratitude solidifie ce qui a été acquis.", titreHEN: "30 days — gratitude", titreFEN: "30 days — I hold on", actionHEN: "30 days in a serious crisis. You held on. Allah has seen every effort. Ex: 'Alhamdulillah. 30 days in a serious crisis. We are still here. It is Allah who held us.'", actionFEN: "30 days in a serious crisis. You have held on. Allah has seen every tear and every effort.", versetEN: "Indeed, with hardship comes ease. (Quran 94:6)", psychoHEN: "Reaching the 30-day milestone in a serious crisis and recognizing it before Allah deeply anchors the transformation. Naming gratitude solidifies what has been gained.", psychoF: "Atteindre le jalon des 30 jours dans une crise grave et le reconnaître devant Allah ancre profondément la transformation. Aucun effort, aucune larme n'est invisible à Lui.", psychoFEN: "Reaching the 30-day milestone in a serious crisis and recognizing it before Allah deeply anchors the transformation. No effort, no tear is invisible to Him." },
      { jour: 31, titreH: "Projet commun", titreF: "Forces nées de la crise", actionH: "Lancez un projet commun, même petit. Un objectif partagé redonne un sens au 'nous'. Ex : 'Et si on se fixait un objectif commun ? Même petit. Quelque chose qui nous donne une direction.'", actionF: "Quelles habitudes nées de la crise veux-tu transformer en force pour l'avenir ?", verset: "Et entraidez-vous dans la piété et la bienfaisance. (Coran 5:2)", psychoH: "Construire un projet ensemble réoriente le couple vers l'avenir partagé et réduit la focalisation sur les blessures passées.", titreHEN: "Shared project", titreFEN: "Crisis-born strengths", actionHEN: "Launch a shared project, even small. A shared goal restores meaning to 'us'. 'What if we set a shared goal? Even small. Something that gives us a direction.'", actionFEN: "What habits born from the crisis do you want to transform into strengths for the future?", versetEN: "Help one another in righteousness and piety. (Quran 5:2)", psychoHEN: "Building a shared project redirects the couple toward a shared future and reduces focus on past wounds.", psychoF: "Construire un projet ensemble réoriente le couple vers l'avenir partagé et réduit la focalisation sur les blessures passées. Un objectif commun redonne sens à 'nous'.", psychoFEN: "Building a project together redirects the couple toward a shared future and reduces focus on past wounds. A shared goal restores meaning to 'we'." },
      { jour: 32, titreH: "Libérer la rancœur", titreF: "Projet commun", actionH: "Creuse encore : au jour 26 tu as levé un non-dit, aujourd'hui vas plus loin et libère une vraie rancœur. Le pardon te libère toi autant que l'autre. Ex : 'Je te pardonne [chose précise]. Dis-moi si tu peux me pardonner [chose précise].'", actionF: "Proposez un projet commun, même petit. Un objectif partagé redonne un sens au 'nous'.", verset: "Qu'ils pardonnent et qu'ils passent par-dessus. N'aimeriez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", psychoH: "Libérer une rancœur ou lancer un projet commun : tous deux orientent l'énergie du couple vers l'avenir, pas vers les comptes du passé.", titreHEN: "Release resentment", titreFEN: "Shared project", actionHEN: "Go deeper: on day 26 you brought up an unspoken issue. Today go further and release a real resentment. Forgiveness frees you as much as the other. Ex: 'I forgive you for [specific thing]. Tell me if you can forgive me for [specific thing].'", actionFEN: "Suggest a shared project, even small. A shared goal restores meaning to 'us'.", versetEN: "Let them pardon and overlook. Do you not love that Allah should forgive you? (Quran 24:22)", psychoHEN: "Releasing resentment or starting a shared project: both redirect the couple's energy toward the future, not toward past accounts.", psychoF: "Le pardon ne banalise pas ce qui s'est passé — il te libère, toi. Garder une rancœur, c'est porter en soi le poison qu'on espère donner à l'autre.", psychoFEN: "Forgiveness does not trivialize what happened — it frees you. Holding onto resentment is carrying within you the poison you hope to give the other." },
      { jour: 33, titreH: "5 qualités positives", titreF: "Libérer la rancœur", actionH: "Dis-lui 5 choses vraies et positives. Même si c'est difficile à trouver dans la crise. Ex : Cherche 5 vraies qualités. Même difficile. 'Tu es forte, tu as tenu, tu es honnête...'", actionF: "Est-il temps de libérer une rancœur ? Le pardon te libère toi autant que l'autre.", verset: "Qu'ils pardonnent et qu'ils passent par-dessus. N'aimeriez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", psychoH: "Dire 5 choses positives ou libérer une rancœur : deux gestes qui rééquilibrent la balance émotionnelle du couple vers le positif.", titreHEN: "5 positive qualities", titreFEN: "Release resentment", actionHEN: "Tell her 5 true and positive things. Even if difficult to find in the crisis. 'You are strong, you have held on, you are honest...'", actionFEN: "Is it time to release a resentment? Forgiveness frees you as much as the other.", versetEN: "Let them pardon and overlook. Do you not love that Allah should forgive you? (Quran 24:22)", psychoHEN: "Saying 5 positive things or releasing resentment: two gestures that rebalance the couple's emotional scale toward the positive.", psychoF: "Il faut 5 interactions positives pour compenser 1 interaction négative. Nommer 5 qualités vraies de ton mari rééquilibre la balance émotionnelle du couple vers le positif.", psychoFEN: "It takes 5 positive interactions to compensate for 1 negative one. Naming 5 true qualities in your husband rebalances the couple's emotional scale toward the positive." },
      { jour: 34, titreH: "Protocole de crise", titreF: "5 qualités positives", actionH: "Établissez ensemble comment vous allez gérer les prochains moments de tension. Ex : 'On se met d'accord : si ça monte, on s'arrête. On prend 10 minutes chacun. Puis on reprend.'", actionF: "Dis-lui 5 choses vraies et positives. Même si c'est difficile à trouver dans la crise.", verset: "Et entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété. (Coran 5:2)", psychoH: "Établir un protocole de tension ou nommer 5 qualités : tous deux protègent la relation des dérapages. L'amour solide se construit par des règles autant que par des élans.", titreHEN: "Crisis protocol", titreFEN: "5 positive qualities", actionHEN: "Establish together how you will handle the next moments of tension. 'If it escalates, we stop. We each take 10 minutes. Then we resume.'", actionFEN: "Tell him 5 true and positive things. Even if difficult to find in the crisis.", versetEN: "Help one another in righteousness and piety. (Quran 5:2)", psychoHEN: "Setting a tension protocol or naming 5 qualities: both protect the relationship from slipping. Solid love is built through rules as much as through impulses.", psychoF: "Avoir un protocole pré-établi pour les tensions réduit leur intensité de 60%. Le cerveau en crise ne peut pas inventer une solution — il doit suivre un plan déjà prêt.", psychoFEN: "Having a pre-established protocol for tensions reduces their intensity by 60%. The brain in crisis cannot invent a solution — it must follow an already prepared plan." },
      { jour: 35, titreH: "Shukr — l'épreuve enseigne", titreF: "Protocole de crise", actionH: "Remercie Allah pour ce que cette épreuve t'a appris sur toi-même. Ex : 'Cette épreuve m'a appris que j'avais besoin de travailler sur ma colère / mon orgueil / ma présence.'", actionF: "Convenez ensemble d'un protocole simple pour les prochaines tensions.", verset: "Endure avec patience ! Ta patience ne vient qu'avec l'aide d'Allah. (Coran 16:127)", psychoH: "Faire du shukr pour l'épreuve ou préparer un protocole de tension : deux manières d'accueillir ce qui pourrait revenir, sans s'effondrer.", titreHEN: "Shukr — trial teaches", titreFEN: "Crisis protocol", actionHEN: "Thank Allah for what this trial has taught you about yourself. 'This trial taught me I needed to work on my anger / my pride / my presence.'", actionFEN: "Agree together on a simple protocol for the next tensions.", versetEN: "And be patient. Your patience is only by [the help of] Allah. (Quran 16:127)", psychoHEN: "Practicing shukr for the trial or preparing a tension protocol: two ways of welcoming what may come back without collapsing.", psychoF: "Faire du shukr pour ce que l'épreuve t'a enseigné est le niveau le plus élevé de résilience. Toute épreuve porte une sagesse — la nommer la transforme en force.", psychoFEN: "Practicing shukr for what the trial has taught you is the highest level of resilience. Every trial carries a wisdom — naming it turns it into strength." },
      { jour: 36, titreH: "Partager son chemin", titreF: "Shukr — l'épreuve enseigne", actionH: "Partage avec quelqu'un de confiance ce que tu as traversé et ce que tu as appris. Ex : Appelle un proche de confiance : 'Ça va mieux. On a traversé quelque chose de difficile ensemble.'", actionF: "Remercie Allah pour ce que cette épreuve t'a appris sur toi-même.", verset: "Si vous êtes reconnaissants, certes J'augmenterai Mes bienfaits pour vous. (Coran 14:7)", psychoH: "Partager son chemin avec un proche ou faire du shukr à Allah : tous deux nomment ce qu'on a traversé, et nommer console plus que tout.", titreHEN: "Share the journey", titreFEN: "Shukr — trial teaches", actionHEN: "Share with a trusted person what you have been through and what you have learned. 'It's better. We went through something difficult together.'", actionFEN: "Thank Allah for what this trial has taught you about yourself.", versetEN: "If you are grateful, I will surely increase My favor upon you. (Quran 14:7)", psychoHEN: "Sharing your journey with someone close or practicing shukr to Allah: both name what you have been through, and naming consoles more than anything.", psychoF: "Reconnaître ce que l'épreuve a forgé en soi est la forme la plus haute de gratitude. Le shukr conscient transforme la cicatrice en sagesse — et la sagesse en force pour la suite.", psychoFEN: "Recognizing what the trial has forged in you is the highest form of gratitude. Conscious shukr transforms the scar into wisdom — and wisdom into strength for what's next." },
      { jour: 37, titreH: "Remercier son épouse", titreF: "Partager avec confiance", actionH: "Remercie-la pour chaque effort, même invisible, durant ces semaines difficiles. Ex : 'Merci d'avoir tenu. Tu aurais pu partir. Tu es restée. Je ne l'oublierai jamais.'", actionF: "Partage avec une amie de confiance ce que tu as traversé et ce que tu as appris le cas échéant.", verset: "Et appelle [les gens] dans le sentier de ton Seigneur, par la sagesse et la bonne exhortation. (Coran 16:125)", psychoH: "Remercier son conjoint ou partager son parcours avec un proche : deux formes de gratitude qui rendent visible ce que la crise avait rendu invisible.", titreHEN: "Thank your wife", titreFEN: "Share with confidence", actionHEN: "Thank her for every effort, even invisible, during these difficult weeks. 'Thank you for holding on. You could have left. You stayed. I will never forget it.'", actionFEN: "Share with a trusted friend what you have been through and what you have learned if appropriate.", versetEN: "Invite to the way of your Lord with wisdom and good instruction. (Quran 16:125)", psychoHEN: "Thanking your spouse or sharing your journey with someone close: two forms of gratitude that make visible what the crisis had made invisible.", psychoF: "Raconter son parcours de transformation à une amie de confiance consolide les changements chez celle qui les raconte. Et ton expérience peut devenir une lumière pour d'autres.", psychoFEN: "Telling your story of transformation to a trusted friend consolidates the changes in the one who tells them. And your experience can become a light for others." },
      { jour: 38, titreH: "Un rituel retrouvé", titreF: "Remercier son époux", actionH: "Identifie un petit rituel disparu pendant la crise (salam au réveil, mot du soir, thé partagé...). Réinstalle-le aujourd'hui. Ex : Avant de dormir : 'Bonsoir, fais de beaux rêves.' Comme avant. Sans grand discours.", actionF: "Remercie-le pour chaque effort, même invisible, durant ces semaines difficiles.", verset: "Quant aux bonnes œuvres durables, elles te rapporteront auprès de ton Seigneur une bien meilleure récompense. (Coran 18:46)", psychoH: "Réinstaller un rituel disparu ou remercier explicitement : ce sont les petits gestes répétés qui reconstruisent un foyer, pas les grands moments rares.", titreHEN: "A recovered ritual", titreFEN: "Thank your husband", actionHEN: "Identify a small ritual that disappeared during the crisis (salam upon waking, evening word, shared tea...). Reinstate it today. Ex: Before sleeping: 'Goodnight, sweet dreams.' Like before. No grand speech.", actionFEN: "Thank him for every effort, even invisible, during these difficult weeks.", versetEN: "But the enduring good deeds are better with your Lord for reward. (Quran 18:46)", psychoHEN: "Reinstating a lost ritual or explicitly expressing thanks: it is the small repeated gestures that rebuild a home, not the rare grand moments.", psychoF: "La reconnaissance explicite envers son époux donne l'envie de continuer à donner. Réinstaller un petit rituel ou remercier explicitement : ce sont ces gestes répétés qui reconstruisent un foyer.", psychoFEN: "Explicit recognition toward your husband gives the desire to keep giving. Reinstating a small ritual or explicitly thanking: it is these repeated gestures that rebuild a home." },
      { jour: 39, titreH: "Planifier l'après", titreF: "Planifier l'après", actionH: "Demain c'est le dernier jour. Comment tu continues sans le programme ? Planifie maintenant. Ex : Écris dans un carnet : 'Ce que je fais chaque semaine pour ne plus en arriver là : [liste].' Tu peux refaire le diagnostic et faire le plan modéré. Chaque plan apporte une pierre à votre couple.", actionF: "Demain c'est le dernier jour. Comment tu continues sans le programme ? Planifie maintenant. Tu peux refaire le diagnostic et faire le plan modéré si besoin. Chaque plan apporte une pierre à votre couple.", verset: "Et quiconque craint Allah, Il lui donnera une issue favorable. (Coran 65:2)", psychoH: "Planifier l'après-programme est ce qui distingue une parenthèse d'un véritable changement. L'habitude est désormais en toi — il s'agit maintenant de la maintenir consciemment.", titreHEN: "Plan the after", titreFEN: "Plan the after", actionHEN: "Tomorrow is the last day. How will you continue without the program? Plan now. Write: 'What I do each week so we never get there again: [list].' You can redo the diagnostic and do the moderate plan. Each plan adds a stone to your couple.", actionFEN: "Tomorrow is the last day. How will you continue without the program? Plan now. You can redo the diagnostic and do the moderate plan if needed. Each plan adds a stone to your couple.", versetEN: "And whoever fears Allah — He will make for him a way out. (Quran 65:2)", psychoHEN: "Planning what comes after the program is what distinguishes a parenthesis from real change. The habit is now within you — it's about consciously maintaining it.", psychoF: "Planifier l'après n'est pas la fin du parcours mais sa consolidation. Une femme qui a tenu 40 jours dans une crise grave a tous les outils pour continuer — il suffit de les rendre conscients.", psychoFEN: "Planning what comes after is not the end of the journey but its consolidation. A woman who held on for 40 days in a serious crisis has all the tools to continue — they just need to be made conscious." },
      { jour: 40, titreH: "40 jours — lumière", titreF: "40 jours — lumière", actionH: "40 jours dans une crise grave. Allah est témoin de chaque larme et de chaque effort. Ex : Faites du dua les deux, les mains ouvertes : 'Ya Allah, que ce foyer soit une lumière.'", actionF: "40 jours dans une crise grave. Allah est témoin de chaque larme et de chaque effort.", verset: "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux, et fais de nous un guide pour les pieux. (Coran 25:74)", psychoH: "Vous avez choisi votre mariage. Vous avez choisi de vous battre pour lui. C'est le plus beau des choix.", titreHEN: "40 days — light", titreFEN: "40 days — light", actionHEN: "40 days in a serious crisis. Allah is witness to every tear and every effort. Make dua together, hands open: 'Ya Allah, may this home be a light.'", actionFEN: "40 days in a serious crisis. Allah is witness to every tear and every effort.", versetEN: "Our Lord, grant us from our spouses and offspring the joy of our eyes, and make us a guide for the righteous. (Quran 25:74)", psychoHEN: "You chose your marriage. You chose to fight for it. That is the most beautiful of choices.", psychoF: "Tu as choisi ton mariage. Tu as choisi de te battre pour lui. C'est le plus beau des choix — et Allah a vu chaque larme et chaque effort.", psychoFEN: "You chose your marriage. You chose to fight for it. That is the most beautiful of choices — and Allah has seen every tear and every effort." },
    ],
  };

  return plans[niveau] || plans.leger;
};

export const PLAN_DATA = {
  leger: genererPlan('leger'),
  modere: genererPlan('modere'),
  grave: genererPlan('grave'),
};

// ─── INJECTION DES JOURS BONUS ────────────────────────────────────────────────
// Positions 1, 3, 5 dans chaque semaine (0-indexé = J2, J4, J6)
// Les jours bonus REMPLACENT le jour du plan de base à ces positions
const SLOTS_BONUS = [1, 3, 5];

// Détecte les failles à partir des réponses au questionnaire
// reponses = { q1: 1-3, q2: 1-3, q3: 1-3, q4: 1-3, q5: 1-3, q6: 1-3 }
export const detecterFailles = (reponses) => {
  const failles = [];
  if (reponses.q1 >= 2.5)
    failles.push({ theme: 'communication', label: 'Communication', emoji: '💬', score: reponses.q1 });
  const scoreAmbiance = (reponses.q2 + reponses.q3) / 2;
  if (scoreAmbiance >= 2.5)
    failles.push({ theme: 'ambiance', label: 'Ambiance & Conflits', emoji: '🏠', score: scoreAmbiance });
  if (reponses.q4 >= 2.5)
    failles.push({ theme: 'intimite', label: 'Intimité', emoji: '❤️', score: reponses.q4 });
  if (reponses.q5 >= 2.5)
    failles.push({ theme: 'spiritualite', label: 'Spiritualité', emoji: '🤲', score: reponses.q5 });
  if (reponses.q6 >= 2.5)
    failles.push({ theme: 'reconstruction', label: 'Reconstruction', emoji: '🕊️', score: reponses.q6 });
  // Trier par score décroissant (plus urgent en premier)
  failles.sort((a, b) => b.score - a.score);
  return failles;
};

// Retourne le type de contenu pour un jour donné
// { type: 'base', data: {...} } ou { type: 'bonus', theme, jourBonus, faille }
export const getPlanJour = (jourIndex, failles, niveau) => {
  if (!niveau || !PLAN_DATA[niveau]) {
    return { type: 'base', data: null };
  }

  if (niveau === 'grave') {
    return { type: 'base', data: PLAN_DATA[niveau][jourIndex] || null };
  }

  const positionSemaine = jourIndex % 7;
  const estSlotBonus = [1, 3, 5].includes(positionSemaine);
  const numSemaine = Math.floor(jourIndex / 7);

  if (estSlotBonus && failles && failles.length > 0) {
    const slotIndex = [1, 3, 5].indexOf(positionSemaine);
    const numSlotGlobal = numSemaine * 3 + slotIndex;

    const failleIndex = numSlotGlobal % failles.length;
    const faille = failles[failleIndex];

    const jourBonusFaille = Math.floor(numSlotGlobal / failles.length);

    const BONUS_MAX = 7;
    if (jourBonusFaille >= BONUS_MAX) {
      return {
        type: 'base',
        data: PLAN_DATA[niveau][jourIndex] || null,
      };
    }

    return {
      type: 'bonus',
      faille,
      jourBonus: jourBonusFaille,
      data: PLAN_DATA[niveau][jourIndex] || null,
    };
  }

  return {
    type: 'base',
    data: PLAN_DATA[niveau][jourIndex] || null,
  };
};

// Calcul du niveau en Mode Duo (score le plus élevé des deux)
export const calculerNiveauDuo = (scoreA, scoreB) => {
  return calculerNiveau(Math.max(scoreA, scoreB));
};

// Calcul des réponses moyennes en Mode Duo
export const calculerReponsesMoyennes = (repA, repB) => ({
  q1: (repA.q1 + repB.q1) / 2,
  q2: (repA.q2 + repB.q2) / 2,
  q3: (repA.q3 + repB.q3) / 2,
  q4: (repA.q4 + repB.q4) / 2,
  q5: (repA.q5 + repB.q5) / 2,
  q6: (repA.q6 + repB.q6) / 2,
});
