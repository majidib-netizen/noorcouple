// ─── SEMAINES BONUS — 140 messages ──────────────────────────────────────────
// 5 thèmes × 7 jours × 2 genres × 2 notifs (matin + soir)
// Déclenchées après les 40 jours de base selon les failles détectées
//
// Structure : BONUS_MESSAGES[theme].homme[jour] = { matin, matinEN, soir, soirEN }
//             BONUS_MESSAGES[theme].femme[jour]  = { matin, matinEN, soir, soirEN }

export const BONUS_MESSAGES = {

  // ══════════════════════════════════════════════════════════════════
  //  BONUS A — COMMUNICATION
  // ══════════════════════════════════════════════════════════════════
  communication: {
    homme: [
      {
        matin: "🌅 Aujourd'hui : parle-lui d'une chose qui te tient à cœur. Pas un problème — quelque chose de positif que tu veux partager. Ex : un projet, une pensée, un souvenir.",
        matinEN: "🌅 Today: tell her one thing that matters to you. Not a problem — something positive you want to share. E.g.: a project, a thought, a memory.",
        soir: "🌙 L'as-tu fait ? 'Celui qui croit en Allah et au Jour dernier doit dire du bien ou se taire.' (Sahih al-Bukhari 6138) — Recommencer à communiquer par le positif avant le difficile est la clé du rétablissement.",
        soirEN: "Did you do it? 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.' (Sahih al-Bukhari 6138) — Starting communication with the positive before the difficult is the key to recovery.",
      },
      {
        matin: "🌅 Pratique l'écoute active ce soir : quand elle parle, répète en tes propres mots ce qu'elle vient de dire avant de répondre. Ex : 'Si je comprends bien, tu me dis que...'",
        matinEN: "🌅 Practice active listening tonight: when she speaks, repeat in your own words what she just said before responding. E.g.: 'If I understand correctly, you're telling me that...'",
        soir: "🌙 As-tu reformulé avant de répondre ? Cette technique réduit les malentendus de 70% et montre à l'autre qu'il est vraiment entendu.",
        soirEN: "Did you rephrase before responding? This technique reduces misunderstandings by 70% and shows the other that they are truly heard.",
      },
      {
        matin: "🌅 Exprime un besoin avec la formule : 'Quand [situation], je ressens [émotion], j'aurais besoin de [demande précise].' Ex : 'Quand on ne se parle pas le soir, je me sens seul. J'aurais besoin qu'on prenne 10 minutes ensemble.'",
        matinEN: "🌅 Express a need using this formula: 'When [situation], I feel [emotion], I would need [specific request].' E.g.: 'When we don't talk in the evening, I feel lonely. I would need us to take 10 minutes together.'",
        soir: "🌙 As-tu utilisé cette formule ? Elle évite l'accusation et ouvre un espace de dialogue. C'est la communication non-violente appliquée au foyer islamique.",
        soirEN: "Did you use this formula? It avoids accusation and opens a space for dialogue. It is nonviolent communication applied to the Islamic home.",
      },
      {
        matin: "🌅 Identifie un sujet que vous évitez depuis longtemps. Aborde-le ce soir avec douceur, en commençant par : 'J'aimerais qu'on puisse parler de [sujet] quand tu te sens prêt(e).'",
        matinEN: "🌅 Identify a topic you have been avoiding for a long time. Bring it up gently tonight, starting with: 'I'd like us to be able to talk about [topic] when you feel ready.'",
        soir: "🌙 As-tu osé l'aborder ? Les sujets évités s'accumulent et créent des murs invisibles. Nommer un sujet sans l'imposer est déjà un acte de courage.",
        soirEN: "Did you dare bring it up? Avoided topics accumulate and create invisible walls. Naming a topic without imposing it is already an act of courage.",
      },
      {
        matin: "🌅 Aujourd'hui : pose-lui 3 questions ouvertes sur sa vie intérieure. Pas 'ça va ?' — mais 'Qu'est-ce qui t'a rendu heureux(se) cette semaine ?' ou 'Qu'est-ce qui te préoccupe en ce moment ?'",
        matinEN: "🌅 Today: ask her 3 open-ended questions about her inner life. Not 'how are you?' — but 'What made you happy this week?' or 'What's on your mind right now?'",
        soir: "🌙 As-tu posé ces questions ? S'intéresser à la vie intérieure de son époux/épouse crée une intimité émotionnelle que rien d'autre ne peut remplacer.",
        soirEN: "Did you ask these questions? Showing interest in your spouse's inner life creates an emotional intimacy that nothing else can replace.",
      },
      {
        matin: "🌅 Établissez ce soir un rituel de communication : 10 minutes chaque soir sans téléphone où chacun partage 1 chose positive et 1 chose difficile de sa journée.",
        matinEN: "🌅 Establish a communication ritual tonight: 10 minutes each evening without phones where each person shares 1 positive thing and 1 difficult thing from their day.",
        soir: "🌙 Avez-vous établi ce rituel ? Les couples qui maintiennent un espace de parole quotidien gèrent 3 fois mieux leurs conflits que les autres.",
        soirEN: "Did you establish this ritual? Couples who maintain a daily space for conversation manage their conflicts 3 times better than others.",
      },
      {
        matin: "🌅 Répondez ensemble à cette question : 'Qu'est-ce qui a changé dans notre façon de communiquer cette semaine ?' Notez 2 choses concrètes à garder.",
        matinEN: "🌅 Answer this question together: 'What has changed in the way we communicate this week?' Write down 2 concrete things to keep.",
        soir: "🌙 Avez-vous fait ce bilan ? 'Consulte-les dans l'affaire, puis quand tu as décidé, place ta confiance en Allah.' (Coran 3:159) — La communication est une compétence qui s'entretient toute la vie.",
        soirEN: "Did you do this review? 'Consult them in the matter. And when you have decided, then rely upon Allah.' (Quran 3:159) — Communication is a skill that is cultivated throughout life.",
      },
    ],
    femme: [
      {
        matin: "🌅 Aujourd'hui : partage avec lui quelque chose de positif qui te tient à cœur. Pas un problème à résoudre — juste quelque chose que tu veux lui dire. Ex : un projet, une joie, une pensée sur vous deux.",
        matinEN: "🌅 Today: share with him something positive that matters to you. Not a problem to solve — just something you want to tell him. E.g.: a project, a joy, a thought about the two of you.",
        soir: "🌙 L'as-tu fait ? Recommencer à communiquer par le positif avant le difficile est la clé pour rouvrir les portes fermées.",
        soirEN: "Did you do it? Starting communication with the positive before the difficult is the key to reopening closed doors.",
      },
      {
        matin: "🌅 Quand il te parle ce soir, reformule ce qu'il dit avant de répondre. Ex : 'Si je comprends bien, tu me dis que...' Montre-lui qu'il est vraiment entendu.",
        matinEN: "🌅 When he speaks to you tonight, rephrase what he says before responding. E.g.: 'If I understand correctly, you're telling me that...' Show him he is truly heard.",
        soir: "🌙 As-tu reformulé ? Cette technique simple transforme la qualité des échanges et réduit les malentendus profondément.",
        soirEN: "Did you rephrase? This simple technique deeply transforms the quality of exchanges and reduces misunderstandings.",
      },
      {
        matin: "🌅 Exprime un besoin avec cette formule : 'Quand [situation], je ressens [émotion], j'aurais besoin de [demande précise].' Ex : 'Quand tu rentres sans me parler, je me sens invisible. J'aurais besoin qu'on se dise bonjour vraiment.'",
        matinEN: "🌅 Express a need using this formula: 'When [situation], I feel [emotion], I would need [specific request].' E.g.: 'When you come home without speaking to me, I feel invisible. I would need us to truly greet each other.'",
        soir: "🌙 As-tu utilisé cette formule ? Elle évite l'accusation et ouvre un dialogue. C'est exprimer ses besoins avec la dignité que l'Islam nous enseigne.",
        soirEN: "Did you use this formula? It avoids accusation and opens dialogue. It is expressing one's needs with the dignity Islam teaches us.",
      },
      {
        matin: "🌅 Il y a un sujet que vous évitez. Aborde-le doucement ce soir : 'J'aimerais qu'on puisse parler de [sujet] quand tu te sens prêt. Pas maintenant si tu veux — mais bientôt.'",
        matinEN: "🌅 There is a topic you have been avoiding. Bring it up gently tonight: 'I'd like us to be able to talk about [topic] when you feel ready. Not now if you prefer — but soon.'",
        soir: "🌙 As-tu osé nommer ce sujet ? Les non-dits construisent des murs invisibles. Nommer sans imposer est un acte de maturité et d'amour.",
        soirEN: "Did you dare name this topic? Unspoken things build invisible walls. Naming without imposing is an act of maturity and love.",
      },
      {
        matin: "🌅 Pose-lui 3 questions ouvertes sur sa vie intérieure. Pas 'ça va ?' — mais 'Qu'est-ce qui t'a rendu heureux cette semaine ?' ou 'Qu'est-ce qui te préoccupe en ce moment ?'",
        matinEN: "🌅 Ask him 3 open-ended questions about his inner life. Not 'how are you?' — but 'What made you happy this week?' or 'What's on your mind right now?'",
        soir: "🌙 As-tu posé ces questions ? S'intéresser à la vie intérieure de son conjoint crée une intimité émotionnelle profonde et durable.",
        soirEN: "Did you ask these questions? Showing interest in your spouse's inner life creates deep and lasting emotional intimacy.",
      },
      {
        matin: "🌅 Proposez un rituel de 10 minutes chaque soir : sans téléphone, chacun partage 1 chose positive et 1 chose difficile de sa journée. Rien de plus.",
        matinEN: "🌅 Suggest a 10-minute nightly ritual: no phones, each person shares 1 positive thing and 1 difficult thing from their day. Nothing more.",
        soir: "🌙 Avez-vous créé ce rituel ? Les couples qui maintiennent un espace de parole quotidien gèrent bien mieux leurs tensions.",
        soirEN: "Did you create this ritual? Couples who maintain a daily space for conversation manage their tensions much better.",
      },
      {
        matin: "🌅 Demandez-vous ensemble : 'Qu'est-ce qui a changé dans notre façon de nous parler cette semaine ?' Notez 2 choses concrètes à garder.",
        matinEN: "🌅 Ask each other: 'What has changed in the way we talk this week?' Write down 2 concrete things to keep.",
        soir: "🌙 Avez-vous fait ce bilan ? 'Consulte-les dans l'affaire, puis quand tu as décidé, place ta confiance en Allah.' (Coran 3:159) — La communication est une compétence qui se cultive toute la vie.",
        soirEN: "Did you do this review? 'Consult them in the matter. And when you have decided, then rely upon Allah.' (Quran 3:159) — Communication is a skill that is cultivated throughout life.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  //  BONUS B — AMBIANCE / CONFLITS
  // ══════════════════════════════════════════════════════════════════
  ambiance: {
    homme: [
      {
        matin: "🌅 Aujourd'hui : identifie la principale source de tension récurrente dans votre foyer. Ne l'aborde pas encore — juste la nommer mentalement. Ex : l'argent, la belle-famille, les tâches ménagères.",
        matinEN: "🌅 Today: identify the main recurring source of tension in your home. Don't address it yet — just name it mentally. E.g.: money, in-laws, household chores.",
        soir: "🌙 As-tu identifié cette source ? On ne peut résoudre que ce qu'on nomme clairement. La prochaine étape sera d'en parler avec méthode.",
        soirEN: "Did you identify this source? We can only resolve what we clearly name. The next step will be to address it methodically.",
      },
      {
        matin: "🌅 Établissez une règle de crise ensemble ce soir : 'Quand une tension monte, on fait une pause de 10 minutes chacun de son côté avant de reprendre.' Dites-vous cette règle à voix haute.",
        matinEN: "🌅 Establish a crisis rule together tonight: 'When tension rises, we each take a 10-minute break before resuming.' Say this rule out loud to each other.",
        soir: "🌙 Avez-vous cette règle ? 'Le fort est celui qui se maîtrise dans la colère.' (Bukhari) — Avoir un protocole pré-établi réduit l'intensité des conflits de 60%.",
        soirEN: "Do you have this rule? 'The strong man is the one who controls himself in anger.' (Bukhari) — Having a pre-established protocol reduces conflict intensity by 60%.",
      },
      {
        matin: "🌅 Ce soir, aborde la source de tension identifiée précédemment. Utilise la méthode : 'Quand [situation], je ressens [émotion]. On pourrait essayer [proposition concrète] ?'",
        matinEN: "🌅 Tonight, address the source of tension identified previously. Use the method: 'When [situation], I feel [emotion]. Could we try [concrete proposal]?'",
        soir: "🌙 As-tu pu aborder ce sujet ? Transformer un conflit en problème à résoudre ensemble — et non l'un contre l'autre — change tout.",
        soirEN: "Were you able to bring up this topic? Transforming a conflict into a problem to solve together — not one against the other — changes everything.",
      },
      {
        matin: "🌅 Fais une journée sans sarcasme, ironie ou ton condescendant. Si l'envie vient, remplace par le silence bienveillant. Ex : au lieu de 'évidemment tu n'as pas fait X', dis rien ou 'j'aurais besoin de X.'",
        matinEN: "🌅 Have a day without sarcasm, irony, or condescension. If the urge comes, replace it with kind silence. E.g.: instead of 'obviously you didn't do X', say nothing or 'I would need X.'",
        soir: "🌙 As-tu tenu ? Le sarcasme est l'un des 4 comportements les plus destructeurs du couple selon les recherches. L'éliminer change l'ambiance immédiatement.",
        soirEN: "Did you hold to it? Sarcasm is one of the 4 most destructive behaviors in a couple according to research. Eliminating it immediately changes the atmosphere.",
      },
      {
        matin: "🌅 Réconciliez-vous sur un sujet non résolu. Pas besoin d'accord — juste dire : 'On ne s'est pas mis d'accord sur X. Je t'aime quand même et je veux qu'on avance.' Ex : un pardon, une concession.",
        matinEN: "🌅 Reconcile on an unresolved matter. No agreement needed — just say: 'We didn't agree on X. I still love you and I want us to move forward.' E.g.: a forgiveness, a concession.",
        soir: "🌙 Avez-vous tourné une page ? Les meilleurs des hommes sont lents à la colère et prompts à se réconcilier. (Musnad Ahmad 11143) Chaque réconciliation renforce le foyer.",
        soirEN: "Did you turn a page? The best of men are slow to anger and quick to be appeased. (Musnad Ahmad 11143) Every reconciliation strengthens the home.",
      },
      {
        matin: "🌅 Créez une ambiance de sérénité ce soir : dîner calme, pas de discussion lourde, lumière douce. Juste être bien ensemble. Ex : musique douce, bonne nourriture, bonne humeur.",
        matinEN: "🌅 Create a peaceful atmosphere tonight: a calm dinner, no heavy conversation, soft lighting. Just being well together. E.g.: soft music, good food, good spirits.",
        soir: "🌙 Avez-vous créé cet espace ? 'Afin que vous viviez en tranquillité auprès d'elles.' (Coran 30:21) — La sérénité du foyer se construit intentionnellement.",
        soirEN: "Did you create this space? 'That you may find tranquility in them.' (Quran 30:21) — The serenity of the home is built intentionally.",
      },
      {
        matin: "🌅 Évaluez ensemble : 'Sur une échelle de 1 à 10, comment était l'ambiance de notre foyer cette semaine ? Qu'est-ce qui a changé ?' Notez 2 choses à garder.",
        matinEN: "🌅 Evaluate together: 'On a scale of 1 to 10, how was the atmosphere in our home this week? What changed?' Write down 2 things to keep.",
        soir: "🌙 Avez-vous fait ce bilan ? Une ambiance saine dans le foyer est un droit que chaque conjoint mérite. Continuez à le construire chaque jour.",
        soirEN: "Did you do this review? A healthy atmosphere in the home is a right that every spouse deserves. Keep building it every day.",
      },
    ],
    femme: [
      {
        matin: "🌅 Identifie la principale source de tension récurrente dans votre foyer. Ne l'aborde pas encore — juste la nommer clairement en toi. Ex : les finances, la belle-famille, les tâches.",
        matinEN: "🌅 Identify the main recurring source of tension in your home. Don't address it yet — just name it clearly within yourself. E.g.: finances, in-laws, household tasks.",
        soir: "🌙 As-tu identifié cette source ? On ne peut résoudre que ce qu'on nomme. La prochaine étape sera d'en parler avec méthode et douceur.",
        soirEN: "Did you identify this source? We can only resolve what we name. The next step will be to address it with method and gentleness.",
      },
      {
        matin: "🌅 Proposez ce soir une règle de crise : 'Quand une tension monte, on se donne 10 minutes chacun avant de reprendre.' Dites-vous cette règle à voix haute ensemble.",
        matinEN: "🌅 Suggest a crisis rule tonight: 'When tension rises, we each take 10 minutes apart before resuming.' Say this rule out loud together.",
        soir: "🌙 Avez-vous cette règle ? Un protocole pré-établi pour les crises réduit leur intensité et leur durée considérablement.",
        soirEN: "Do you have this rule? A pre-established protocol for crises considerably reduces their intensity and duration.",
      },
      {
        matin: "🌅 Aborde ce soir la source de tension identifiée précédemment. Avec douceur : 'Quand [situation], je ressens [émotion]. On pourrait essayer [proposition] ?'",
        matinEN: "🌅 Address tonight the source of tension identified previously. Gently: 'When [situation], I feel [emotion]. Could we try [proposal]?'",
        soir: "🌙 As-tu pu l'aborder ? Transformer un conflit en problème à résoudre ensemble — et non l'un contre l'autre — change toute la dynamique.",
        soirEN: "Were you able to bring it up? Transforming a conflict into a problem to solve together — not one against the other — changes the entire dynamic.",
      },
      {
        matin: "🌅 Journée sans sarcasme ni ironie. Si l'envie vient, remplace par le silence doux ou une demande directe. Ex : au lieu d'un soupir agacé, dis 'j'aurais besoin de...'",
        matinEN: "🌅 A day without sarcasm or irony. If the urge comes, replace it with gentle silence or a direct request. E.g.: instead of an irritated sigh, say 'I would need...'",
        soir: "🌙 As-tu tenu ? Le sarcasme est l'un des comportements les plus corrosifs dans un couple. L'éliminer transforme l'ambiance immédiatement.",
        soirEN: "Did you hold to it? Sarcasm is one of the most corrosive behaviors in a couple. Eliminating it immediately transforms the atmosphere.",
      },
      {
        matin: "🌅 Réconciliez-vous sur un sujet non résolu. Pas besoin d'accord total — juste : 'On ne s'est pas mis d'accord sur X. Je t'aime quand même et je veux qu'on avance.'",
        matinEN: "🌅 Reconcile on an unresolved matter. No full agreement needed — just: 'We didn't agree on X. I still love you and I want us to move forward.'",
        soir: "🌙 Avez-vous tourné une page ? Les meilleurs des hommes sont lents à la colère et prompts à se réconcilier. (Musnad Ahmad 11143) Chaque réconciliation renforce le foyer.",
        soirEN: "Did you turn a page? The best of men are slow to anger and quick to be appeased. (Musnad Ahmad 11143) Every reconciliation strengthens the home.",
      },
      {
        matin: "🌅 Ce soir : crée une ambiance douce. Dîner calme, pas de sujet lourd, présence légère et chaleureuse. Le foyer doit être un refuge.",
        matinEN: "🌅 Tonight: create a gentle atmosphere. A calm dinner, no heavy topic, a light and warm presence. The home must be a refuge.",
        soir: "🌙 Avez-vous créé cet espace ? 'Afin que vous viviez en tranquillité auprès d'elles.' (Coran 30:21) — La sérénité du foyer se construit intentionnellement.",
        soirEN: "Did you create this space? 'That you may find tranquility in them.' (Quran 30:21) — The serenity of the home is built intentionally.",
      },
      {
        matin: "🌅 Évaluez ensemble : 'Sur une échelle de 1 à 10, comment était l'ambiance cette semaine ? Qu'est-ce qui a changé ?' Notez 2 choses à ancrer.",
        matinEN: "🌅 Evaluate together: 'On a scale of 1 to 10, how was the atmosphere this week? What changed?' Write down 2 things to anchor.",
        soir: "🌙 Avez-vous fait ce bilan ? Une ambiance saine dans le foyer est un droit que chaque conjoint mérite. Continuez à le construire.",
        soirEN: "Did you do this review? A healthy atmosphere in the home is a right that every spouse deserves. Keep building it.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  //  BONUS C — INTIMITÉ
  // ══════════════════════════════════════════════════════════════════
  intimite: {
    homme: [
      {
        matin: "🌅 L'intimité commence par la sécurité émotionnelle. Aujourd'hui : dis-lui quelque chose de vulnérable que tu ne dis pas d'habitude. Ex : une peur, un doute, un rêve secret.",
        matinEN: "🌅 Intimacy begins with emotional safety. Today: tell her something vulnerable that you don't usually say. E.g.: a fear, a doubt, a secret dream.",
        soir: "🌙 As-tu osé ? 'Elles sont un vêtement pour vous et vous êtes un vêtement pour elles.' (Coran 2:187) — La vraie intimité commence quand on se montre tel qu'on est.",
        soirEN: "Did you dare? 'They are clothing for you and you are clothing for them.' (Quran 2:187) — True intimacy begins when we show ourselves as we truly are.",
      },
      {
        matin: "🌅 Reprends les petits gestes physiques affectueux du quotidien : prends sa main, pose la main sur son épaule en passant, fais-lui un câlin à son réveil. Sans attente.",
        matinEN: "🌅 Bring back the small daily affectionate gestures: take her hand, rest your hand on her shoulder in passing, give her a hug when she wakes up. Without expectation.",
        soir: "🌙 As-tu recréé ce contact ? Le toucher affectueux quotidien libère de l'ocytocine qui renforce le lien et réduit le stress des deux partenaires.",
        soirEN: "Did you recreate this contact? Daily affectionate touch releases oxytocin that strengthens the bond and reduces stress for both partners.",
      },
      {
        matin: "🌅 Crée un moment d'intimité intellectuelle ce soir : parlez d'un sujet qui vous passionne tous les deux. L'Islam, un projet, un livre. Échangez vos idées pendant 20 minutes.",
        matinEN: "🌅 Create a moment of intellectual intimacy tonight: talk about a topic that fascinates you both. Islam, a project, a book. Share your ideas for 20 minutes.",
        soir: "🌙 Avez-vous échangé vraiment ? L'intimité intellectuelle — partager ses pensées, ses idées, ses convictions — est une forme de rapprochement profond souvent oubliée.",
        soirEN: "Did you truly exchange ideas? Intellectual intimacy — sharing thoughts, ideas, and convictions — is a form of deep closeness that is often forgotten.",
      },
      {
        matin: "🌅 Partagez avec elle un souvenir de vos débuts qui vous a marqué. Pas pour vous plaindre du présent — pour raviver la chaleur des origines. Ex : 'Je me souviens que la première fois que...'",
        matinEN: "🌅 Share with her a memory from your early days that left a mark on you. Not to complain about the present — to rekindle the warmth of your origins. E.g.: 'I remember the first time...'",
        soir: "🌙 As-tu ravivé ce souvenir ? Revisiter les débuts réactive les émotions positives fondatrices du couple. C'est une technique thérapeutique puissante.",
        soirEN: "Did you revive this memory? Revisiting your beginnings reactivates the positive founding emotions of the couple. It is a powerful therapeutic technique.",
      },
      {
        matin: "🌅 Créez un rituel d'intimité hebdomadaire : une sortie rien qu'à vous, un dîner aux chandelles, une promenade. Planifiez-le maintenant pour cette semaine.",
        matinEN: "🌅 Create a weekly intimacy ritual: an outing just for the two of you, a candlelit dinner, a walk. Plan it now for this week.",
        soir: "🌙 C'est planifié ? Les couples qui créent des rituels d'intimité réguliers maintiennent le désir et la connexion mieux que tous les autres.",
        soirEN: "Is it planned? Couples who create regular intimacy rituals maintain desire and connection better than all others.",
      },
      {
        matin: "🌅 Faites dua l'un pour l'autre, en sa présence. Lève les mains et invoque Allah pour elle à voix haute. Ex : 'Ya Allah, bénisse ma femme, protège-la et comble-la.'",
        matinEN: "🌅 Make dua for her out loud, in her presence. Raise your hands and invoke Allah for her. E.g.: 'Ya Allah, bless my wife, protect her and grant her abundance.'",
        soir: "🌙 As-tu fait ce dua pour elle ? 'Lorsqu'un homme aime son frère, qu'il l'informe qu'il l'aime.' (Sunan Abi Dawud 5124) — L'intimité spirituelle est la plus profonde.",
        soirEN: "Did you make this dua for her? 'When a man loves his brother, he should tell him that he loves him.' (Sunan Abi Dawud 5124) — Spiritual intimacy is the deepest.",
      },
      {
        matin: "🌅 Dites-vous mutuellement : 'La chose qui me rapproche le plus de toi, c'est...' Écoutez la réponse de l'autre vraiment. Gardez cette information précieusement.",
        matinEN: "🌅 Tell each other: 'The thing that brings me closest to you is...' Truly listen to each other's answer. Keep this precious information.",
        soir: "🌙 Avez-vous fait cet échange ? Connaître ce qui rapproche l'autre est un outil de connexion pour toute la vie conjugale.",
        soirEN: "Did you have this exchange? Knowing what brings the other closer is a tool for connection throughout all of married life.",
      },
    ],
    femme: [
      {
        matin: "🌅 L'intimité commence par la sécurité émotionnelle. Partage avec lui quelque chose de vulnérable que tu ne dis pas d'habitude. Ex : une peur, un doute sur toi-même, un rêve que tu gardes pour toi.",
        matinEN: "🌅 Intimacy begins with emotional safety. Share with him something vulnerable that you don't usually say. E.g.: a fear, a self-doubt, a dream you keep to yourself.",
        soir: "🌙 As-tu osé te montrer ? 'Elles sont un vêtement pour vous et vous êtes un vêtement pour elles.' (Coran 2:187) — La vraie intimité naît de la confiance et de l'authenticité.",
        soirEN: "Did you dare show yourself? 'They are clothing for you and you are clothing for them.' (Quran 2:187) — True intimacy is born of trust and authenticity.",
      },
      {
        matin: "🌅 Reprends les petits gestes affectueux quotidiens : pose la main sur son bras en passant, fais-lui un câlin au réveil, souris-lui quand tes regards se croisent.",
        matinEN: "🌅 Bring back the small daily affectionate gestures: place your hand on his arm in passing, give him a hug when he wakes up, smile at him when your eyes meet.",
        soir: "🌙 As-tu recréé ces moments de contact ? Le toucher affectueux quotidien renforce le lien et rappelle à l'autre qu'il est aimé.",
        soirEN: "Did you recreate these moments of contact? Daily affectionate touch strengthens the bond and reminds the other that they are loved.",
      },
      {
        matin: "🌅 Crée un moment d'intimité intellectuelle ce soir : parlez d'un sujet qui vous passionne tous les deux. L'Islam, un projet, un film. Échangez vos idées pendant 20 minutes.",
        matinEN: "🌅 Create a moment of intellectual intimacy tonight: talk about a topic that fascinates you both. Islam, a project, a film. Share your ideas for 20 minutes.",
        soir: "🌙 Avez-vous échangé ? L'intimité intellectuelle — partager ses pensées et convictions — est une forme de rapprochement profond souvent négligée.",
        soirEN: "Did you exchange ideas? Intellectual intimacy — sharing thoughts and convictions — is a form of deep closeness that is often neglected.",
      },
      {
        matin: "🌅 Rappelle-lui un souvenir de vos débuts qui t'a marquée. Ex : 'Je me souviens que la première fois que tu m'as dit [chose], j'ai compris que tu étais différent.'",
        matinEN: "🌅 Remind him of a memory from your early days that left a mark on you. E.g.: 'I remember the first time you said [thing], I knew you were different.'",
        soir: "🌙 As-tu ravivé ce souvenir ? Revisiter les débuts réactive les émotions positives fondatrices du couple. C'est une technique thérapeutique puissante.",
        soirEN: "Did you revive this memory? Revisiting your beginnings reactivates the positive founding emotions of the couple. It is a powerful therapeutic technique.",
      },
      {
        matin: "🌅 Planifiez un rituel d'intimité hebdomadaire : une sortie rien qu'à vous, un dîner calme, une promenade. Proposez-le lui maintenant et fixez une date.",
        matinEN: "🌅 Plan a weekly intimacy ritual: an outing just for the two of you, a quiet dinner, a walk. Suggest it to him now and set a date.",
        soir: "🌙 C'est planifié ? Les couples qui créent des rituels d'intimité réguliers maintiennent leur connexion mieux que tous les autres.",
        soirEN: "Is it planned? Couples who create regular intimacy rituals maintain their connection better than all others.",
      },
      {
        matin: "🌅 Fais dua pour lui à voix haute, en sa présence. Lève les mains et invoque Allah pour lui. Ex : 'Ya Allah, guide mon mari, protège-le et bénis-le dans tout ce qu'il entreprend.'",
        matinEN: "🌅 Make dua for him out loud, in his presence. Raise your hands and invoke Allah for him. E.g.: 'Ya Allah, guide my husband, protect him and bless him in all that he undertakes.'",
        soir: "🌙 As-tu fait ce dua pour lui ? Prier pour son conjoint à voix haute en sa présence est l'un des actes d'amour spirituel les plus forts.",
        soirEN: "Did you make this dua for him? Praying for one's spouse out loud in their presence is one of the strongest acts of spiritual love.",
      },
      {
        matin: "🌅 Dites-vous mutuellement : 'La chose qui me rapproche le plus de toi, c'est...' Écoutez vraiment. Gardez cette réponse précieusement.",
        matinEN: "🌅 Tell each other: 'The thing that brings me closest to you is...' Truly listen. Keep this precious answer.",
        soir: "🌙 Avez-vous fait cet échange ? Connaître ce qui rapproche l'autre est un outil de connexion pour toute la vie conjugale à venir.",
        soirEN: "Did you have this exchange? Knowing what brings the other closer is a tool for connection throughout all of married life to come.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  //  BONUS D — SPIRITUALITÉ
  // ══════════════════════════════════════════════════════════════════
  spiritualite: {
    homme: [
      {
        matin: "🌅 Priez une prière ensemble aujourd'hui. Une seule suffit. Proposez-le avec douceur ce soir : 'On fait le maghreb ensemble ?' Sans pression si elle refuse — l'invitation est déjà un acte.",
        matinEN: "🌅 Pray one prayer together today. Just one is enough. Suggest it gently tonight: 'Shall we pray Maghrib together?' No pressure if she declines — the invitation itself is already an act.",
        soir: "🌙 Avez-vous prié ensemble ? 'Qu'Allah fasse miséricorde à l'homme qui se lève la nuit pour prier et réveille sa femme.' (Abu Dawud) — La prière commune est le ciment le plus solide.",
        soirEN: "Did you pray together? 'May Allah have mercy on the man who rises at night to pray and wakes his wife.' (Abu Dawud) — Shared prayer is the strongest cement.",
      },
      {
        matin: "🌅 Lisez ensemble un verset du Coran sur le mariage et partagez ce qu'il vous inspire. Ex : Coran 30:21. Pas besoin d'un long discours — juste ce que ça vous évoque.",
        matinEN: "🌅 Read a Quran verse on marriage together and share what it inspires in you. E.g.: Quran 30:21. No need for a long speech — just what it evokes for you.",
        soir: "🌙 Avez-vous lu ensemble ? Le Coran lu en couple n'est plus seulement une lecture individuelle — il devient une conversation avec Allah à deux.",
        soirEN: "Did you read together? The Quran read as a couple is no longer just an individual reading — it becomes a conversation with Allah for two.",
      },
      {
        matin: "🌅 Donnez la sadaqa ensemble aujourd'hui. Même 1€ mis en commun pour une cause charitable. Décidez ensemble à qui vous donnez.",
        matinEN: "🌅 Give sadaqa together today. Even €1 pooled together for a charitable cause. Decide together to whom you give.",
        soir: "🌙 Avez-vous donné ensemble ? 'Si vous êtes reconnaissants, J'augmenterai vos bienfaits.' (Coran 14:7) — La sadaqa commune crée un sentiment de mission partagée.",
        soirEN: "Did you give together? 'If you are grateful, I will surely increase you.' (Quran 14:7) — Giving sadaqa together creates a sense of shared mission.",
      },
      {
        matin: "🌅 Faites du dhikr ensemble ce soir avant de dormir. 33 fois Subhanallah, 33 fois Alhamdulillah, 33 fois Allahu Akbar. 3 minutes ensemble.",
        matinEN: "🌅 Do dhikr together tonight before sleeping. 33 times Subhanallah, 33 times Alhamdulillah, 33 times Allahu Akbar. 3 minutes together.",
        soir: "🌙 Avez-vous fait ce dhikr ? Le dhikr commun avant de dormir crée un espace de paix partagé et rappelle que vous êtes ensemble devant Allah.",
        soirEN: "Did you make this dhikr? Shared dhikr before sleeping creates a space of shared peace and reminds you that you are together before Allah.",
      },
      {
        matin: "🌅 Parlez ce soir de vos objectifs spirituels communs : Oumra, mémorisation du Coran, apprentissage de la religion. Qu'est-ce que vous voulez accomplir ensemble pour Allah ?",
        matinEN: "🌅 Talk tonight about your shared spiritual goals: Umrah, memorizing the Quran, learning the religion. What do you want to accomplish together for Allah?",
        soir: "🌙 Avez-vous défini ces objectifs ? Les couples qui ont une vision spirituelle commune avancent ensemble vers l'Au-delà. C'est la plus belle des ambitions conjugales.",
        soirEN: "Did you define these goals? Couples who have a shared spiritual vision advance together toward the Hereafter. It is the most beautiful of marital ambitions.",
      },
      {
        matin: "🌅 Récitez ensemble le dua du couple : 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin wa-j'alna lil-muttaqina imama.' (Coran 25:74) — Ce soir, mains ouvertes ensemble.",
        matinEN: "🌅 Recite the couple's dua together: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin wa-j'alna lil-muttaqina imama.' (Quran 25:74) — Tonight, hands open together.",
        soir: "🌙 Avez-vous récité ce dua ? Invoquer Allah pour son foyer ensemble est l'acte spirituel le plus puissant qu'un couple puisse faire. Faites-en un rituel.",
        soirEN: "Did you recite this dua? Invoking Allah for your home together is the most powerful spiritual act a couple can perform. Make it a ritual.",
      },
      {
        matin: "🌅 Demandez-vous : 'Comment Allah est-il présent dans notre foyer aujourd'hui ? Qu'est-ce qu'on peut faire chaque semaine pour Le garder au centre ?' Fixez une habitude spirituelle commune.",
        matinEN: "🌅 Ask each other: 'How is Allah present in our home today? What can we do every week to keep Him at the center?' Establish a shared spiritual habit.",
        soir: "🌙 Avez-vous défini cette habitude ? Le foyer islamique idéal n'est pas parfait — il est intentionnel. Chaque effort vers Allah est récompensé.",
        soirEN: "Did you define this habit? The ideal Islamic home is not perfect — it is intentional. Every effort toward Allah is rewarded.",
      },
    ],
    femme: [
      {
        matin: "🌅 Propose-lui de prier une prière ensemble aujourd'hui. Une seule. Ex : 'On fait le maghreb ensemble ce soir ?' Sans pression si il refuse — l'invitation compte déjà.",
        matinEN: "🌅 Suggest praying one prayer together today. Just one. E.g.: 'Shall we pray Maghrib together tonight?' No pressure if he declines — the invitation already counts.",
        soir: "🌙 Avez-vous prié ensemble ? La prière commune crée une intimité avec Allah et entre vous qui ne ressemble à rien d'autre.",
        soirEN: "Did you pray together? Shared prayer creates an intimacy with Allah and between you that resembles nothing else.",
      },
      {
        matin: "🌅 Lisez ensemble un verset du Coran sur le mariage et partagez ce qu'il vous inspire. Ex : Coran 30:21. Juste vos réflexions spontanées — pas un cours.",
        matinEN: "🌅 Read a Quran verse on marriage together and share what it inspires in you. E.g.: Quran 30:21. Just your spontaneous thoughts — not a lecture.",
        soir: "🌙 Avez-vous lu ensemble ? Le Coran lu en couple devient une conversation à deux avec Allah. C'est une forme d'intimité spirituelle unique.",
        soirEN: "Did you read together? The Quran read as a couple becomes a conversation for two with Allah. It is a unique form of spiritual intimacy.",
      },
      {
        matin: "🌅 Donnez la sadaqa ensemble aujourd'hui. Même 1€ en commun pour une cause. Décidez ensemble à qui vous donnez et pourquoi.",
        matinEN: "🌅 Give sadaqa together today. Even €1 pooled together for a cause. Decide together to whom you give and why.",
        soir: "🌙 Avez-vous donné ensemble ? 'Si vous êtes reconnaissants, J'augmenterai vos bienfaits.' (Coran 14:7) — La sadaqa commune crée un sentiment de mission partagée.",
        soirEN: "Did you give together? 'If you are grateful, I will surely increase you.' (Quran 14:7) — Giving sadaqa together creates a sense of shared mission.",
      },
      {
        matin: "🌅 Faites du dhikr ensemble ce soir avant de dormir. 33 fois Subhanallah, 33 fois Alhamdulillah, 33 fois Allahu Akbar. Juste 3 minutes côte à côte.",
        matinEN: "🌅 Do dhikr together tonight before sleeping. 33 times Subhanallah, 33 times Alhamdulillah, 33 times Allahu Akbar. Just 3 minutes side by side.",
        soir: "🌙 Avez-vous fait ce dhikr ? Ces 3 minutes créent un espace de paix partagé et rappellent que vous êtes ensemble devant Allah.",
        soirEN: "Did you make this dhikr? These 3 minutes create a space of shared peace and remind you that you are together before Allah.",
      },
      {
        matin: "🌅 Parlez de vos objectifs spirituels communs : Oumra, mémorisation du Coran, apprentissage de la religion. Qu'est-ce que vous voulez accomplir ensemble pour Allah ?",
        matinEN: "🌅 Talk about your shared spiritual goals: Umrah, memorizing the Quran, learning the religion. What do you want to accomplish together for Allah?",
        soir: "🌙 Avez-vous défini ces objectifs ? Les couples qui ont une vision spirituelle commune avancent ensemble vers l'Au-delà. C'est la plus belle des ambitions.",
        soirEN: "Did you define these goals? Couples who have a shared spiritual vision advance together toward the Hereafter. It is the most beautiful of ambitions.",
      },
      {
        matin: "🌅 Récitez ensemble le dua du couple : 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin.' (Coran 25:74) — Ce soir, mains ouvertes ensemble.",
        matinEN: "🌅 Recite the couple's dua together: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin.' (Quran 25:74) — Tonight, hands open together.",
        soir: "🌙 Avez-vous récité ce dua ? Invoquer Allah pour son foyer ensemble est l'acte le plus puissant qu'un couple puisse faire. Faites-en un rituel.",
        soirEN: "Did you recite this dua? Invoking Allah for your home together is the most powerful act a couple can perform. Make it a ritual.",
      },
      {
        matin: "🌅 Demandez-vous : 'Comment Allah est-il présent dans notre foyer aujourd'hui ? Qu'est-ce qu'on fait chaque semaine pour Le garder au centre ?' Fixez une habitude commune.",
        matinEN: "🌅 Ask each other: 'How is Allah present in our home today? What do we do every week to keep Him at the center?' Establish a shared habit.",
        soir: "🌙 Avez-vous défini cette habitude ? Le foyer islamique idéal n'est pas parfait — il est intentionnel. Chaque effort vers Allah est récompensé.",
        soirEN: "Did you define this habit? The ideal Islamic home is not perfect — it is intentional. Every effort toward Allah is rewarded.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  //  BONUS E — RECONSTRUCTION
  // ══════════════════════════════════════════════════════════════════
  reconstruction: {
    homme: [
      {
        matin: "🌅 Commencez par un acte de foi : dites-vous l'un l'autre 'Je choisis de reconstruire avec toi.' Ces mots, dits clairement, posent les fondations de tout ce qui suit.",
        matinEN: "🌅 Begin with an act of faith: tell each other 'I choose to rebuild with you.' These words, spoken clearly, lay the foundation for everything that follows.",
        soir: "🌙 Avez-vous dit ces mots ? 'Ils ont pris de vous une alliance solennelle.' (Coran 4:21) — Renouveler son choix consciemment est l'acte fondateur d'un nouveau départ.",
        soirEN: "Did you say these words? 'They have taken from you a solemn covenant.' (Quran 4:21) — Consciously renewing one's choice is the founding act of a new beginning.",
      },
      {
        matin: "🌅 Libérez les rancœurs du passé. Écrivez chacun sur un papier ce que vous pardonnez à l'autre. Ne montrez pas la liste — brûlez-la ou déchirez-la. Symboliquement, c'est fini.",
        matinEN: "🌅 Release past grievances. Each write on a piece of paper what you forgive the other for. Don't show the list — burn it or tear it up. Symbolically, it is over.",
        soir: "🌙 Avez-vous libéré ? 'N'aimez-vous pas qu'Allah vous pardonne ?' (Coran 24:22) — Le pardon complet et définitif est la condition sine qua non d'une vraie reconstruction.",
        soirEN: "Did you release it? 'Would you not like Allah to forgive you?' (Quran 24:22) — Complete and definitive forgiveness is the necessary condition for true rebuilding.",
      },
      {
        matin: "🌅 Définissez ensemble 3 règles de fonctionnement pour votre nouveau départ. Ex : 'On ne dort jamais fâchés. On dit merci chaque jour. On se parle avant de se plaindre à d'autres.'",
        matinEN: "🌅 Define 3 ground rules for your new start together. E.g.: 'We never go to bed angry. We say thank you every day. We talk to each other before complaining to others.'",
        soir: "🌙 Avez-vous vos 3 règles ? Ces engagements mutuels co-créés sont plus puissants que n'importe quelle promesse unilatérale.",
        soirEN: "Do you have your 3 rules? These mutually co-created commitments are more powerful than any unilateral promise.",
      },
      {
        matin: "🌅 Partagez vos peurs sur l'avenir. Ex : 'Ce qui me fait peur dans notre reconstruction, c'est...' Écoutez sans vous défendre. Ces peurs partagées deviennent des forces partagées.",
        matinEN: "🌅 Share your fears about the future. E.g.: 'What scares me about our rebuilding is...' Listen without defending yourself. These shared fears become shared strengths.",
        soir: "🌙 Avez-vous partagé vos peurs ? Nommer ses fragilités devant l'autre crée une intimité que rien d'autre ne peut donner. C'est le courage de la reconstruction.",
        soirEN: "Did you share your fears? Naming one's vulnerabilities before the other creates an intimacy that nothing else can provide. It is the courage of rebuilding.",
      },
      {
        matin: "🌅 Planifiez un projet commun symbolique du nouveau départ : Oumra, renouvellement de vœux, voyage. Pas forcément immédiat — mais un horizon commun vers lequel marcher.",
        matinEN: "🌅 Plan a symbolic shared project for your new beginning: Umrah, vow renewal, a trip. Not necessarily immediate — but a shared horizon to walk toward.",
        soir: "🌙 Avez-vous un projet ? L'horizon commun transforme 'survivre au passé' en 'construire l'avenir'. C'est un changement de direction fondamental.",
        soirEN: "Do you have a project? The shared horizon transforms 'surviving the past' into 'building the future'. It is a fundamental change of direction.",
      },
      {
        matin: "🌅 Faites dua ensemble pour votre couple et pour la solidité de ce que vous reconstruisez. Demandez à Allah de mettre la barakah dans vos efforts.",
        matinEN: "🌅 Make dua together for your couple and for the solidity of what you are rebuilding. Ask Allah to place barakah in your efforts.",
        soir: "🌙 Avez-vous prié ensemble ? Tout ce qui est construit avec Allah au centre ne s'effondre pas. C'est la garantie la plus solide qui soit.",
        soirEN: "Did you pray together? Everything built with Allah at the center does not collapse. It is the most solid guarantee there is.",
      },
      {
        matin: "🌅 Dites-vous mutuellement : 'Ce qui me donne confiance en notre avenir, c'est...' Ancrez cette confiance. Vous avez traversé une tempête — vous en sortez plus solides.",
        matinEN: "🌅 Tell each other: 'What gives me confidence in our future is...' Anchor this confidence. You have weathered a storm — you emerge from it stronger.",
        soir: "🌙 Avez-vous exprimé cette confiance ? بارك الله فيكم — Que Allah bénisse ce que vous avez reconstruit. Le chemin parcouru est une preuve de votre amour.",
        soirEN: "Did you express this trust? بارك الله فيكم — May Allah bless what you have rebuilt. The path you have walked is a proof of your love.",
      },
    ],
    femme: [
      {
        matin: "🌅 Dites-vous l'un à l'autre : 'Je choisis de reconstruire avec toi.' Ces mots, dits clairement et consciemment, posent les fondations de tout ce qui suit.",
        matinEN: "🌅 Tell each other: 'I choose to rebuild with you.' These words, spoken clearly and consciously, lay the foundation for everything that follows.",
        soir: "🌙 Avez-vous dit ces mots ? 'Ils ont pris de vous une alliance solennelle.' (Coran 4:21) — Renouveler son choix consciemment est l'acte fondateur d'un nouveau départ.",
        soirEN: "Did you say these words? 'They have taken from you a solemn covenant.' (Quran 4:21) — Consciously renewing one's choice is the founding act of a new beginning.",
      },
      {
        matin: "🌅 Libérez les rancœurs. Écrivez chacun sur un papier ce que vous pardonnez à l'autre. Ne montrez pas la liste — déchirez-la ensemble. Symboliquement, c'est fini.",
        matinEN: "🌅 Release grievances. Each write on a piece of paper what you forgive the other for. Don't show the list — tear it up together. Symbolically, it is over.",
        soir: "🌙 Avez-vous libéré ? 'N'aimez-vous pas qu'Allah vous pardonne ?' (Coran 24:22) — Le pardon définitif est la seule fondation solide d'une vraie reconstruction.",
        soirEN: "Did you release it? 'Would you not like Allah to forgive you?' (Quran 24:22) — Definitive forgiveness is the only solid foundation for true rebuilding.",
      },
      {
        matin: "🌅 Définissez ensemble 3 règles pour votre nouveau départ. Ex : 'On ne se couche jamais fâchés. On dit merci chaque jour. On se parle avant de se plaindre à d'autres.'",
        matinEN: "🌅 Define 3 rules for your new start together. E.g.: 'We never go to bed angry. We say thank you every day. We talk to each other before complaining to others.'",
        soir: "🌙 Avez-vous vos 3 règles ? Ces engagements co-créés sont plus puissants que n'importe quelle promesse unilatérale.",
        soirEN: "Do you have your 3 rules? These co-created commitments are more powerful than any unilateral promise.",
      },
      {
        matin: "🌅 Partagez vos peurs sur l'avenir. Ex : 'Ce qui me fait peur dans notre reconstruction, c'est...' Écoutez sans vous défendre. Ces peurs partagées deviennent des forces.",
        matinEN: "🌅 Share your fears about the future. E.g.: 'What scares me about our rebuilding is...' Listen without defending yourself. These shared fears become strengths.",
        soir: "🌙 Avez-vous partagé vos peurs ? Nommer ses fragilités devant l'autre crée une intimité profonde. C'est le courage réel de la reconstruction.",
        soirEN: "Did you share your fears? Naming one's vulnerabilities before the other creates deep intimacy. It is the true courage of rebuilding.",
      },
      {
        matin: "🌅 Planifiez un projet commun symbolique : Oumra, renouvellement de vœux, voyage. Pas forcément immédiat — mais un horizon vers lequel marcher ensemble.",
        matinEN: "🌅 Plan a symbolic shared project: Umrah, vow renewal, a trip. Not necessarily immediate — but a horizon to walk toward together.",
        soir: "🌙 Avez-vous un projet commun ? L'horizon partagé transforme 'survivre au passé' en 'construire l'avenir'. C'est un changement de cap fondamental.",
        soirEN: "Do you have a shared project? The shared horizon transforms 'surviving the past' into 'building the future'. It is a fundamental change of course.",
      },
      {
        matin: "🌅 Faites dua ensemble pour votre couple et pour la solidité de ce que vous reconstruisez. Demandez à Allah de mettre la barakah dans chaque effort.",
        matinEN: "🌅 Make dua together for your couple and for the solidity of what you are rebuilding. Ask Allah to place barakah in every effort.",
        soir: "🌙 Avez-vous prié ensemble ? Tout ce qui est construit avec Allah au centre ne s'effondre pas. C'est la garantie la plus solide qui soit.",
        soirEN: "Did you pray together? Everything built with Allah at the center does not collapse. It is the most solid guarantee there is.",
      },
      {
        matin: "🌅 Dites-vous mutuellement : 'Ce qui me donne confiance en notre avenir, c'est...' Ancrez cette confiance. Vous avez traversé une tempête — vous en sortez plus solides.",
        matinEN: "🌅 Tell each other: 'What gives me confidence in our future is...' Anchor this confidence. You have weathered a storm — you emerge from it stronger.",
        soir: "🌙 Avez-vous exprimé cette confiance ? بارك الله فيكم — Que Allah bénisse ce que vous avez reconstruit. Le chemin parcouru est la preuve de votre amour.",
        soirEN: "Did you express this trust? بارك الله فيكم — May Allah bless what you have rebuilt. The path you have walked is the proof of your love.",
      },
    ],
  },
};
