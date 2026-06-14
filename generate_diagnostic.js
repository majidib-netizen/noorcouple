// generate_diagnostic.js
// Génère le fichier Excel de diagnostic des références islamiques
// Usage: node generate_diagnostic.js

const ExcelJS = require('./node_modules/exceljs');
const path = require('path');

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function extractRef(citation) {
  // Extrait la référence entre les dernières parenthèses
  const m = citation.match(/\(([^)]+)\)\s*$/);
  return m ? m[1] : '';
}

function detectType(ref) {
  if (!ref) return '?';
  if (/Coran|Quran/i.test(ref)) return 'Q';
  if (/Bukhari|Muslim|Tirmidhi|Abu Dawud|Nasa'i|Al-Adab|Bazzar|Nasa.i/i.test(ref)) return 'H';
  if (/Proph.te|Prophet/i.test(ref)) return 'P';
  return '?';
}

function truncate(s, n = 100) {
  if (!s) return '';
  return s.length > n ? s.substring(0, n - 3) + '...' : s;
}

// ─── DONNÉES planData.js ──────────────────────────────────────────────────────

const PLAN_ENTRIES = [

  // ── LÉGER ─────────────────────────────────────────────────────────────────
  { plan: 'Léger', jour: 1,  verset: "Et Il a mis entre vous de l'affection et de la bienveillance. (Coran 30:21)", versetEN: "And He placed between you affection and mercy. (Quran 30:21)" },
  { plan: 'Léger', jour: 2,  verset: "Vivez avec elles de façon convenable. (Coran 4:19)", versetEN: "Live with them in kindness. (Quran 4:19)" },
  { plan: 'Léger', jour: 3,  verset: "Offrez-vous des cadeaux, vous vous aimerez davantage. (Al-Adab Al-Mufrad)", versetEN: "Give each other gifts and you will love each other more. (Al-Adab Al-Mufrad)" },
  { plan: 'Léger', jour: 4,  verset: "Notre Seigneur, accorde-nous de nos épouses la joie des yeux. (Coran 25:74)", versetEN: "Our Lord, grant us from our spouses the joy of our eyes. (Quran 25:74)" },
  { plan: 'Léger', jour: 5,  verset: "Le meilleur d'entre vous est le meilleur envers sa famille. (Tirmidhi)", versetEN: "The best of you is the best to his family. (Tirmidhi)" },
  { plan: 'Léger', jour: 6,  verset: "Il est une parure pour vous et vous êtes une parure pour lui. (Coran 2:187)", versetEN: "He is a garment for you and you are a garment for him. (Quran 2:187)" },
  { plan: 'Léger', jour: 7,  verset: "Et leur consultation entre eux est mutuelle. (Coran 42:38)", versetEN: "And their affairs are conducted by mutual consultation. (Quran 42:38)" },
  { plan: 'Léger', jour: 8,  verset: "Parlez-leur de façon convenable. (Coran 4:5)", versetEN: "Speak to them in a known kindly manner. (Quran 4:5)" },
  { plan: 'Léger', jour: 9,  verset: "Offrez-vous des cadeaux, vous vous aimerez davantage. (Al-Adab Al-Mufrad)", versetEN: "Give each other gifts and you will love each other more. (Al-Adab Al-Mufrad)" },
  { plan: 'Léger', jour: 10, verset: "Consultez-vous entre vous de façon bienveillante. (Coran 65:6)", versetEN: "Consult each other kindly. (Quran 65:6)" },
  { plan: 'Léger', jour: 11, verset: "Le fort est celui qui se maîtrise dans la colère. (Bukhari)", versetEN: "The strong is the one who controls himself in anger. (Bukhari)" },
  { plan: 'Léger', jour: 12, verset: "Quand un homme regarde son épouse et qu'elle le regarde, Allah les regarde avec miséricorde. (Bazzar)", versetEN: "When a man looks at his wife and she looks at him, Allah looks at them with mercy. (Bazzar)" },
  { plan: 'Léger', jour: 13, verset: "Et elles ont des droits équivalents à leurs obligations. (Coran 2:228)", versetEN: "And they have rights equivalent to their obligations. (Quran 2:228)" },
  { plan: 'Léger', jour: 14, verset: "Certes, Allah ne modifie pas l'état d'un peuple tant que ceux-ci ne changent pas ce qui est en eux-mêmes. (Coran 13:11)", versetEN: "Verily, Allah does not change the condition of a people until they change what is within themselves. (Quran 13:11)" },
  { plan: 'Léger', jour: 15, verset: "Il est une parure pour vous et vous êtes une parure pour lui. (Coran 2:187)", versetEN: "He is a garment for you and you are a garment for him. (Quran 2:187)" },
  { plan: 'Léger', jour: 16, verset: "Et parmi Ses signes est qu'Il a créé pour vous des épouses afin que vous viviez en tranquillité. (Coran 30:21)", versetEN: "And among His signs is that He created for you spouses so that you may find tranquility. (Quran 30:21)" },
  { plan: 'Léger', jour: 17, verset: "Les croyants et les croyantes sont alliés les uns des autres. (Coran 9:71)", versetEN: "The believing men and women are allies of one another. (Quran 9:71)" },
  { plan: 'Léger', jour: 18, verset: "Et consultez-vous entre vous de façon bienveillante. (Coran 65:6)", versetEN: "And consult each other kindly. (Quran 65:6)" },
  { plan: 'Léger', jour: 19, verset: "N'aimez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", versetEN: "Do you not love that Allah should forgive you? (Quran 24:22)" },
  { plan: 'Léger', jour: 20, verset: "Après la difficulté vient la facilité. (Coran 94:6)", versetEN: "After difficulty comes ease. (Quran 94:6)" },
  { plan: 'Léger', jour: 21, verset: "Et priez humblement et en secret. (Coran 7:55)", versetEN: "And pray to Him with humility and in secret. (Quran 7:55)" },
  { plan: 'Léger', jour: 22, verset: "Le Prophète ﷺ offrait des cadeaux à ses épouses pour nourrir l'amour. (Al-Adab Al-Mufrad)", versetEN: "The Prophet ﷺ gave gifts to his wives to nourish love. (Al-Adab Al-Mufrad)" },
  { plan: 'Léger', jour: 23, verset: "Et les croyants sont alliés les uns des autres. (Coran 9:71)", versetEN: "And the believers are allies of one another. (Quran 9:71)" },
  { plan: 'Léger', jour: 24, verset: "Et qui se garde de sa propre avarice... ceux-là sont ceux qui réussissent. (Coran 59:9)", versetEN: "And whoever is protected from the stinginess of their soul — those are the successful ones. (Quran 59:9)" },
  { plan: 'Léger', jour: 25, verset: "Le meilleur d'entre vous est le meilleur envers sa famille. (Tirmidhi)", versetEN: "The best of you is the best to his family. (Tirmidhi)" },
  { plan: 'Léger', jour: 26, verset: "Afin que vous viviez en tranquillité auprès d'elles. (Coran 30:21)", versetEN: "That you may find tranquility in them. (Quran 30:21)" },
  { plan: 'Léger', jour: 27, verset: "Certes, avec la difficulté il y a une facilité. (Coran 94:5)", versetEN: "Verily, with difficulty comes ease. (Quran 94:5)" },
  { plan: 'Léger', jour: 28, verset: "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux. (Coran 25:74)", versetEN: "Our Lord, grant us from our spouses and offspring the joy of our eyes. (Quran 25:74)" },
  { plan: 'Léger', jour: 29, verset: "Et dites aux gens de bonnes paroles. (Coran 2:83)", versetEN: "And speak to people good words. (Quran 2:83)" },
  { plan: 'Léger', jour: 30, verset: "Et Il a mis entre vous de l'affection et de la bienveillance. (Coran 30:21)", versetEN: "And He placed between you affection and mercy. (Quran 30:21)" },
  { plan: 'Léger', jour: 31, verset: "Ce que tu dépenses pour ta famille est une sadaqa. (Bukhari)", versetEN: "What you spend on your family is a sadaqa. (Bukhari)" },
  { plan: 'Léger', jour: 32, verset: "Le fort est celui qui se maîtrise dans la colère. (Bukhari)", versetEN: "The strong is the one who controls himself in anger. (Bukhari)" },
  { plan: 'Léger', jour: 33, verset: "Afin que vous viviez en tranquillité auprès d'elles. (Coran 30:21)", versetEN: "That you may find tranquility in them. (Quran 30:21)" },
  { plan: 'Léger', jour: 34, verset: "Dis : Seigneur, augmente mes connaissances. (Coran 20:114)", versetEN: "Say: My Lord, increase my knowledge. (Quran 20:114)" },
  { plan: 'Léger', jour: 35, verset: "Si vous les avez en aversion, il se peut qu'Allah ait placé beaucoup de bien. (Coran 4:19)", versetEN: "If you dislike them, perhaps Allah has placed much good in them. (Quran 4:19)" },
  { plan: 'Léger', jour: 36, verset: "Et entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété, et ne vous entraidez pas dans le péché et la transgression. (Coran 5:2)", versetEN: "Help one another in righteousness and piety, but do not help one another in sin and transgression. (Quran 5:2)" },
  { plan: 'Léger', jour: 37, verset: "Ils ont pris de vous une alliance solennelle. (Coran 4:21)", versetEN: "They have taken from you a solemn covenant. (Quran 4:21)" },
  { plan: 'Léger', jour: 38, verset: "Si vous êtes reconnaissants, J'augmenterai certes vos bienfaits. (Coran 14:7)", versetEN: "If you are grateful, I will surely increase your blessings. (Quran 14:7)" },
  { plan: 'Léger', jour: 39, verset: "Les actes les plus aimés d'Allah sont ceux faits régulièrement, même s'ils sont peu nombreux. (Bukhari)", versetEN: "The most beloved deeds to Allah are those done regularly, even if they are few. (Bukhari)" },
  { plan: 'Léger', jour: 40, verset: "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux, et fais de nous un guide pour les pieux. (Coran 25:74)", versetEN: "Our Lord, grant us from our spouses and offspring the joy of our eyes, and make us a guide for the righteous. (Quran 25:74)" },

  // ── MODÉRÉ ────────────────────────────────────────────────────────────────
  { plan: 'Modéré', jour: 1,  verset: "Et répandez la paix entre vous. (Muslim)", versetEN: "And spread peace among yourselves. (Muslim)" },
  { plan: 'Modéré', jour: 2,  verset: "Demandez pardon à votre Seigneur, Il est Grand Pardonneur. (Coran 71:10)", versetEN: "Ask forgiveness of your Lord, He is Most Forgiving. (Quran 71:10)" },
  { plan: 'Modéré', jour: 3,  verset: "N'aimez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", versetEN: "Do you not love that Allah should forgive you? (Quran 24:22)" },
  { plan: 'Modéré', jour: 4,  verset: "Et parmi Ses signes est qu'Il a créé pour vous des épouses. (Coran 30:21)", versetEN: "And among His signs is that He created for you spouses. (Quran 30:21)" },
  { plan: 'Modéré', jour: 5,  verset: "Vivez avec elles de façon convenable. (Coran 4:19)", versetEN: "Live with them in kindness. (Quran 4:19)" },
  { plan: 'Modéré', jour: 6,  verset: "Et leur consultation entre eux est mutuelle. (Coran 42:38)", versetEN: "And their affairs are conducted by mutual consultation. (Quran 42:38)" },
  { plan: 'Modéré', jour: 7,  verset: "Appelez votre Seigneur avec humilité et en secret. (Coran 7:55)", versetEN: "Call upon your Lord with humility and in secret. (Quran 7:55)" },
  { plan: 'Modéré', jour: 8,  verset: "Une parole bonne est comme un aumône. (Bukhari)", versetEN: "A good word is like a charity. (Bukhari)" },
  { plan: 'Modéré', jour: 9,  verset: "Le fort est celui qui se maîtrise dans la colère. (Bukhari)", versetEN: "The strong is the one who controls himself in anger. (Bukhari)" },
  { plan: 'Modéré', jour: 10, verset: "Certes, Allah ne modifie pas l'état d'un peuple tant qu'ils ne changent pas ce qui est en eux. (Coran 13:11)", versetEN: "Verily, Allah does not change the condition of a people until they change what is within themselves. (Quran 13:11)" },
  { plan: 'Modéré', jour: 11, verset: "Et si vous craignez la rupture entre eux, envoyez un arbitre de sa famille. (Coran 4:35)", versetEN: "And if you fear a split between them, appoint an arbitrator from his family. (Quran 4:35)" },
  { plan: 'Modéré', jour: 12, verset: "Notre Seigneur, accorde-nous de nos épouses la joie des yeux. (Coran 25:74)", versetEN: "Our Lord, grant us from our spouses the joy of our eyes. (Quran 25:74)" },
  { plan: 'Modéré', jour: 13, verset: "Si vous n'aimez pas une de ses qualités, vous en apprécierez une autre. (Muslim)", versetEN: "If you dislike one of their qualities, you will appreciate another. (Muslim)" },
  { plan: 'Modéré', jour: 14, verset: "Après la difficulté vient la facilité. (Coran 94:6)", versetEN: "After difficulty comes ease. (Quran 94:6)" },
  { plan: 'Modéré', jour: 15, verset: "Et Il a mis entre vous de l'affection et de la bienveillance. (Coran 30:21)", versetEN: "And He placed between you affection and mercy. (Quran 30:21)" },
  { plan: 'Modéré', jour: 16, verset: "Voyagez sur la terre. (Coran 6:11)", versetEN: "Travel through the land. (Quran 6:11)" },
  { plan: 'Modéré', jour: 17, verset: "Et entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété, et ne vous entraidez pas dans le péché et la transgression. (Coran 5:2)", versetEN: "Help one another in righteousness and piety, but do not help one another in sin and transgression. (Quran 5:2)" },
  { plan: 'Modéré', jour: 18, verset: "Et elles ont des droits équivalents à leurs obligations. (Coran 2:228)", versetEN: "And they have rights equivalent to their obligations. (Quran 2:228)" },
  { plan: 'Modéré', jour: 19, verset: "Ils ont pris de vous une alliance solennelle. (Coran 4:21)", versetEN: "They have taken from you a solemn covenant. (Quran 4:21)" },
  { plan: 'Modéré', jour: 20, verset: "Certes, avec la difficulté il y a une facilité. (Coran 94:5)", versetEN: "Verily, with difficulty comes ease. (Quran 94:5)" },
  { plan: 'Modéré', jour: 21, verset: "Les actes les plus aimés d'Allah sont ceux faits régulièrement. (Bukhari)", versetEN: "The most beloved deeds to Allah are those done regularly. (Bukhari)" },
  { plan: 'Modéré', jour: 22, verset: "Le meilleur d'entre vous est le meilleur envers sa famille. (Tirmidhi)", versetEN: "The best of you is the best to his family. (Tirmidhi)" },
  { plan: 'Modéré', jour: 23, verset: "Il est une parure pour vous et vous êtes une parure pour lui. (Coran 2:187)", versetEN: "He is a garment for you and you are a garment for him. (Quran 2:187)" },
  { plan: 'Modéré', jour: 24, verset: "Notre Seigneur, accorde-nous de nos épouses la joie des yeux. (Coran 25:74)", versetEN: "Our Lord, grant us from our spouses the joy of our eyes. (Quran 25:74)" },
  { plan: 'Modéré', jour: 25, verset: "Si vous êtes reconnaissants, J'augmenterai vos bienfaits. (Coran 14:7)", versetEN: "If you are grateful, I will increase your blessings. (Quran 14:7)" },
  { plan: 'Modéré', jour: 26, verset: "Et consultez-vous entre vous de façon bienveillante. (Coran 65:6)", versetEN: "And consult each other kindly. (Quran 65:6)" },
  { plan: 'Modéré', jour: 27, verset: "Certes, Allah est avec les patients. (Coran 2:153)", versetEN: "Verily, Allah is with the patient. (Quran 2:153)" },
  { plan: 'Modéré', jour: 28, verset: "Et entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété. (Coran 5:2)", versetEN: "Help one another in righteousness and piety. (Quran 5:2)" },
  { plan: 'Modéré', jour: 29, verset: "Ils ont pris de vous une alliance solennelle. (Coran 4:21)", versetEN: "They have taken from you a solemn covenant. (Quran 4:21)" },
  { plan: 'Modéré', jour: 30, verset: "Après la difficulté vient la facilité. (Coran 94:6)", versetEN: "After difficulty comes ease. (Quran 94:6)" },
  { plan: 'Modéré', jour: 31, verset: "Les actes les plus aimés d'Allah sont ceux faits régulièrement. (Bukhari)", versetEN: "The most beloved deeds to Allah are those done regularly. (Bukhari)" },
  { plan: 'Modéré', jour: 32, verset: "Et consultez-vous entre vous de façon bienveillante. (Coran 65:6)", versetEN: "And consult each other kindly. (Quran 65:6)" },
  { plan: 'Modéré', jour: 33, verset: "Qu'ils pardonnent et passent outre. N'aimez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", versetEN: "Let them pardon and overlook. Do you not love that Allah should forgive you? (Quran 24:22)" },
  { plan: 'Modéré', jour: 34, verset: "Le meilleur d'entre vous est le meilleur envers sa famille. (Tirmidhi)", versetEN: "The best of you is the best to his family. (Tirmidhi)" },
  { plan: 'Modéré', jour: 35, verset: "Repousse [le mal] par ce qui est meilleur. Et voilà que celui qu'une inimitié séparait de toi devient un ami chaleureux. (Coran 41:34)", versetEN: "Repel [evil] with what is better. And behold, the one between whom and you was enmity will become a devoted friend. (Quran 41:34)" },
  { plan: 'Modéré', jour: 36, verset: "Si vous êtes reconnaissants, J'augmenterai vos bienfaits. (Coran 14:7)", versetEN: "If you are grateful, I will increase your blessings. (Quran 14:7)" },
  { plan: 'Modéré', jour: 37, verset: "Et rappelle, car le rappel profite aux croyants. (Coran 51:55)", versetEN: "And remind, for reminding benefits the believers. (Quran 51:55)" },
  { plan: 'Modéré', jour: 38, verset: "Celui qui ne remercie pas les gens ne remercie pas Allah. (Abu Dawud)", versetEN: "Whoever does not thank people does not thank Allah. (Abu Dawud)" },
  { plan: 'Modéré', jour: 39, verset: "Les actes les plus aimés d'Allah sont ceux faits régulièrement, même s'ils sont peu nombreux. (Bukhari)", versetEN: "The most beloved deeds to Allah are those done regularly, even if they are few. (Bukhari)" },
  { plan: 'Modéré', jour: 40, verset: "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux, et fais de nous un guide pour les pieux. (Coran 25:74)", versetEN: "Our Lord, grant us from our spouses and offspring the joy of our eyes, and make us a guide for the righteous. (Quran 25:74)" },

  // ── GRAVE ─────────────────────────────────────────────────────────────────
  { plan: 'Grave', jour: 1,  verset: "Demandez pardon à votre Seigneur, puis revenez à Lui repentants. (Coran 11:3)", versetEN: "Ask forgiveness of your Lord and then turn to Him in repentance. (Quran 11:3)" },
  { plan: 'Grave', jour: 2,  verset: "Et lorsque les ignorants leur adressent la parole, ils répondent : 'Paix !' (Coran 25:63)", versetEN: "And when the ignorant address them harshly, they say words of peace. (Quran 25:63)" },
  { plan: 'Grave', jour: 3,  verset: "Et faites le bien. Certes, Allah aime les bienfaisants. (Coran 2:195)", versetEN: "And do good. Indeed, Allah loves the doers of good. (Quran 2:195)" },
  { plan: 'Grave', jour: 4,  verset: "Et parmi Ses signes est qu'Il a créé pour vous des épouses. (Coran 30:21)", versetEN: "And among His signs is that He created for you spouses. (Quran 30:21)" },
  { plan: 'Grave', jour: 5,  verset: "Demandez aide par la patience et la prière. (Coran 2:45)", versetEN: "Seek help through patience and prayer. (Quran 2:45)" },
  { plan: 'Grave', jour: 6,  verset: "Et qui se garde de sa propre avarice... ceux-là sont ceux qui réussissent. (Coran 59:9)", versetEN: "And whoever is protected from the stinginess of their soul — those are the successful ones. (Quran 59:9)" },
  { plan: 'Grave', jour: 7,  verset: "Établis la prière, certes la prière préserve de la turpitude et de l'acte blâmable. (Coran 29:45)", versetEN: "Establish prayer; indeed, prayer prohibits immorality and wrongdoing. (Quran 29:45)" },
  { plan: 'Grave', jour: 8,  verset: "Et leur consultation entre eux est mutuelle. (Coran 42:38)", versetEN: "And their affair is by mutual consultation. (Quran 42:38)" },
  { plan: 'Grave', jour: 9,  verset: "Repousse [le mal] par ce qui est meilleur. Et voilà que celui qu'une inimitié séparait de toi devient un ami chaleureux. (Coran 41:34)", versetEN: "Repel [evil] with what is better, and behold, the one between whom and you was enmity will become a devoted friend. (Quran 41:34)" },
  { plan: 'Grave', jour: 10, verset: "Certes, Allah ne modifie pas l'état d'un peuple tant qu'ils ne changent pas ce qui est en eux. (Coran 13:11)", versetEN: "Verily, Allah does not change the condition of a people until they change what is within themselves. (Quran 13:11)" },
  { plan: 'Grave', jour: 11, verset: "Aidez-vous mutuellement dans l'accomplissement des bonnes œuvres et de la piété. (Coran 5:2)", versetEN: "Help one another in righteousness and piety. (Quran 5:2)" },
  { plan: 'Grave', jour: 12, verset: "Notre Seigneur, accorde-nous de nos épouses la joie des yeux. (Coran 25:74)", versetEN: "Our Lord, grant us comfort of the eyes from our spouses. (Quran 25:74)" },
  { plan: 'Grave', jour: 13, verset: "Et si vous craignez le désaccord entre les deux, désignez un arbitre de sa famille et un arbitre de la sienne. (Coran 4:35)", versetEN: "And if you fear dissension between the two, send an arbitrator from his people and an arbitrator from her people. (Quran 4:35)" },
  { plan: 'Grave', jour: 14, verset: "Et avec la difficulté, il y a certes une facilité. (Coran 94:6)", versetEN: "Indeed, with hardship comes ease. (Quran 94:6)" },
  { plan: 'Grave', jour: 15, verset: "Et parmi Ses signes, Il a créé pour vous des épouses... et Il a mis entre vous affection et miséricorde. (Coran 30:21)", versetEN: "And of His signs is that He created for you mates... and He placed between you affection and mercy. (Quran 30:21)" },
  { plan: 'Grave', jour: 16, verset: "Il se peut que vous ayez de l'aversion pour une chose alors qu'elle vous est un bien. (Coran 2:216)", versetEN: "Perhaps you dislike a thing which is good for you. (Quran 2:216)" },
  { plan: 'Grave', jour: 17, verset: "Et qui se garde de sa propre avarice... ceux-là sont ceux qui réussissent. (Coran 59:9)", versetEN: "And whoever is protected from the stinginess of their soul — those are the successful ones. (Quran 59:9)" },
  { plan: 'Grave', jour: 18, verset: "Vivez avec elles de façon convenable. (Coran 4:19)", versetEN: "Live with them in kindness. (Quran 4:19)" },
  { plan: 'Grave', jour: 19, verset: "Et tenez-vous tous fortement au câble d'Allah et ne soyez pas divisés entre vous. (Coran 3:103)", versetEN: "And hold firmly to the rope of Allah all together and do not become divided. (Quran 3:103)" },
  { plan: 'Grave', jour: 20, verset: "Certes, avec la difficulté il y a une facilité. (Coran 94:5)", versetEN: "Verily, with difficulty comes ease. (Quran 94:5)" },
  { plan: 'Grave', jour: 21, verset: "Il est une parure pour vous et vous êtes une parure pour lui. (Coran 2:187)", versetEN: "They are a garment for you and you are a garment for them. (Quran 2:187)" },
  { plan: 'Grave', jour: 22, verset: "Et parmi Ses signes, Il a créé pour vous des épouses... et Il a mis entre vous affection et miséricorde. (Coran 30:21)", versetEN: "And of His signs is that He created for you mates... and He placed between you affection and mercy. (Quran 30:21)" },
  { plan: 'Grave', jour: 23, verset: "Il se peut que vous ayez de l'aversion pour une chose alors qu'elle vous est un bien. (Coran 2:216)", versetEN: "Perhaps you dislike a thing which is good for you. (Quran 2:216)" },
  { plan: 'Grave', jour: 24, verset: "Et Il a mis entre vous affection (mawadda) et bienveillance (rahma). (Coran 30:21)", versetEN: "And He placed between you affection (mawadda) and mercy (rahma). (Quran 30:21)" },
  { plan: 'Grave', jour: 25, verset: "Si vous êtes reconnaissants, J'augmenterai vos bienfaits. (Coran 14:7)", versetEN: "If you are grateful, I will increase your blessings. (Quran 14:7)" },
  { plan: 'Grave', jour: 26, verset: "Et dites aux gens de bonnes paroles. (Coran 2:83)", versetEN: "And speak to people good words. (Quran 2:83)" },
  { plan: 'Grave', jour: 27, verset: "Ne désespérez pas de la miséricorde d'Allah. Allah pardonne tous les péchés. (Coran 39:53)", versetEN: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins. (Quran 39:53)" },
  { plan: 'Grave', jour: 28, verset: "Elles ont pris de vous un engagement solennel. (Coran 4:21)", versetEN: "They have taken from you a solemn covenant. (Quran 4:21)" },
  { plan: 'Grave', jour: 29, verset: "Et quant aux bienfaits de ton Seigneur, raconte-les. (Coran 93:11)", versetEN: "And as for the favor of your Lord, proclaim it. (Quran 93:11)" },
  { plan: 'Grave', jour: 30, verset: "Et avec la difficulté, il y a certes une facilité. (Coran 94:6)", versetEN: "Indeed, with hardship comes ease. (Quran 94:6)" },
  { plan: 'Grave', jour: 31, verset: "Et entraidez-vous dans la piété et la bienfaisance. (Coran 5:2)", versetEN: "Help one another in righteousness and piety. (Quran 5:2)" },
  { plan: 'Grave', jour: 32, verset: "Qu'ils pardonnent et qu'ils passent par-dessus. N'aimeriez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", versetEN: "Let them pardon and overlook. Do you not love that Allah should forgive you? (Quran 24:22)" },
  { plan: 'Grave', jour: 33, verset: "Qu'ils pardonnent et qu'ils passent par-dessus. N'aimeriez-vous pas qu'Allah vous pardonne ? (Coran 24:22)", versetEN: "Let them pardon and overlook. Do you not love that Allah should forgive you? (Quran 24:22)" },
  { plan: 'Grave', jour: 34, verset: "Et entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété. (Coran 5:2)", versetEN: "Help one another in righteousness and piety. (Quran 5:2)" },
  { plan: 'Grave', jour: 35, verset: "Endure avec patience ! Ta patience ne vient qu'avec l'aide d'Allah. (Coran 16:127)", versetEN: "And be patient. Your patience is only by [the help of] Allah. (Quran 16:127)" },
  { plan: 'Grave', jour: 36, verset: "Si vous êtes reconnaissants, certes J'augmenterai Mes bienfaits pour vous. (Coran 14:7)", versetEN: "If you are grateful, I will surely increase My favor upon you. (Quran 14:7)" },
  { plan: 'Grave', jour: 37, verset: "Et appelle [les gens] dans le sentier de ton Seigneur, par la sagesse et la bonne exhortation. (Coran 16:125)", versetEN: "Invite to the way of your Lord with wisdom and good instruction. (Quran 16:125)" },
  { plan: 'Grave', jour: 38, verset: "Quant aux bonnes œuvres durables, elles te rapporteront auprès de ton Seigneur une bien meilleure récompense. (Coran 18:46)", versetEN: "But the enduring good deeds are better with your Lord for reward. (Quran 18:46)" },
  { plan: 'Grave', jour: 39, verset: "Et quiconque craint Allah, Il lui donnera une issue favorable. (Coran 65:2)", versetEN: "And whoever fears Allah — He will make for him a way out. (Quran 65:2)" },
  { plan: 'Grave', jour: 40, verset: "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux, et fais de nous un guide pour les pieux. (Coran 25:74)", versetEN: "Our Lord, grant us from our spouses and offspring the joy of our eyes, and make us a guide for the righteous. (Quran 25:74)" },
];

// NIVEAUX (grave.encouragement)
const NIVEAUX_ENTRIES = [
  {
    plan: 'Grave', champ: 'NIVEAUX.encouragement',
    verset: "« Après la difficulté vient la facilité. » (Coran 94:5) — Même les épreuves les plus lourdes peuvent être surmontées avec sincérité, patience et l'aide d'Allah.",
    versetEN: "\"After difficulty comes ease.\" (Quran 94:5) — Even the heaviest trials can be overcome with sincerity, patience and Allah's help.",
  },
];

// ─── DONNÉES notifMessages.js (soir avec citations) ───────────────────────────

const NOTIF_ENTRIES = [
  // LÉGER HOMME
  { plan: 'Léger', genre: 'Homme', jour: 1,  soir: "'Le meilleur d'entre vous est le meilleur envers sa famille.' (Tirmidhi)", soirEN: "'The best of you is the best to his family.' (Tirmidhi)" },
  { plan: 'Léger', genre: 'Homme', jour: 3,  soir: "'Offrez-vous des cadeaux, vous vous aimerez davantage.' (Al-Adab Al-Mufrad)", soirEN: "'Give gifts to one another, for gifts increase love.' (Al-Adab Al-Mufrad)" },
  { plan: 'Léger', genre: 'Homme', jour: 4,  soir: "'Qu'Allah ait miséricorde à l'homme qui se lève et réveille sa femme pour prier.' (Abu Dawud)", soirEN: "'May Allah have mercy on the man who rises at night to pray and wakes his wife.' (Abu Dawud)" },
  { plan: 'Léger', genre: 'Homme', jour: 7,  soir: "'Et leur consultation entre eux est mutuelle.' (Coran 42:38)", soirEN: "'And their affairs are conducted through consultation among themselves.' (Quran 42:38)" },
  { plan: 'Léger', genre: 'Homme', jour: 11, soir: "'Le fort est celui qui se maîtrise dans la colère.' (Bukhari)", soirEN: "'The strong man is the one who controls himself in anger.' (Bukhari)" },
  { plan: 'Léger', genre: 'Homme', jour: 14, soir: "'Ils ont pris de vous une alliance solennelle.' (Coran 4:21)", soirEN: "'They have taken from you a solemn covenant.' (Quran 4:21)" },
  { plan: 'Léger', genre: 'Homme', jour: 19, soir: "'N'aimez-vous pas qu'Allah vous pardonne ?' (Coran 24:22)", soirEN: "'Would you not like Allah to forgive you?' (Quran 24:22)" },
  { plan: 'Léger', genre: 'Homme', jour: 30, soir: "'Celui qui ne remercie pas les gens ne remercie pas Allah.' (Abu Dawud)", soirEN: "'He who does not thank people does not thank Allah.' (Abu Dawud)" },
  { plan: 'Léger', genre: 'Homme', jour: 31, soir: "Ce que tu dépenses pour ta famille est une sadaqa (Bukhari).", soirEN: "What you spend on your family is a sadaqa (Bukhari)." },

  // LÉGER FEMME
  { plan: 'Léger', genre: 'Femme', jour: 1,  soir: "'La meilleure femme est celle qui, lorsque tu la regardes, te réjouit.' (Nasa'i)", soirEN: "'The best woman is the one who, when you look at her, brings you joy.' (Nasa'i)" },
  { plan: 'Léger', genre: 'Femme', jour: 3,  soir: "'Celui qui ne remercie pas les gens ne remercie pas Allah.' (Abu Dawud)", soirEN: "'He who does not thank people does not thank Allah.' (Abu Dawud)" },
  { plan: 'Léger', genre: 'Femme', jour: 7,  soir: "'Et leur consultation entre eux est mutuelle.' (Coran 42:38)", soirEN: "'And their affairs are conducted through consultation among themselves.' (Quran 42:38)" },
  { plan: 'Léger', genre: 'Femme', jour: 9,  soir: "'Offrez-vous des cadeaux, vous vous aimerez davantage.' (Al-Adab Al-Mufrad)", soirEN: "'Give gifts to one another, for gifts increase love.' (Al-Adab Al-Mufrad)" },
  { plan: 'Léger', genre: 'Femme', jour: 15, soir: "'Il est une parure pour vous et vous êtes une parure pour lui.' (Coran 2:187)", soirEN: "'He is a garment for you and you are a garment for him.' (Quran 2:187)" },
  { plan: 'Léger', genre: 'Femme', jour: 17, soir: "'Qui préserve l'honneur de son mari en son absence.' (Nasa'i)", soirEN: "'She who preserves her husband's honor in his absence.' (Nasa'i)" },
  { plan: 'Léger', genre: 'Femme', jour: 19, soir: "'N'aimez-vous pas qu'Allah vous pardonne ?' (Coran 24:22)", soirEN: "'Would you not like Allah to forgive you?' (Quran 24:22)" },
  { plan: 'Léger', genre: 'Femme', jour: 24, soir: "'Une parole bonne est comme une aumône.' (Bukhari)", soirEN: "'A good word is like an act of charity.' (Bukhari)" },
  { plan: 'Léger', genre: 'Femme', jour: 26, soir: "'Afin que vous viviez en tranquillité (sakina) auprès d'elles.' (Coran 30:21)", soirEN: "'That you may find tranquility in them.' (Quran 30:21)" },

  // MODÉRÉ HOMME
  { plan: 'Modéré', genre: 'Homme', jour: 3,  soir: "'N'aimez-vous pas qu'Allah vous pardonne ?' (Coran 24:22)", soirEN: "'Would you not like Allah to forgive you?' (Quran 24:22)" },
  { plan: 'Modéré', genre: 'Homme', jour: 5,  soir: "Le Prophète ﷺ aidait à la maison. Les actes parlent quand les mots ont perdu leur sens.", soirEN: "The Prophet ﷺ helped at home. Actions speak when words have lost their meaning." },
  { plan: 'Modéré', genre: 'Homme', jour: 27, soir: "'Certes, Allah est avec les patients.' (Coran 2:153)", soirEN: "'Indeed, Allah is with the patient.' (Quran 2:153)" },
  { plan: 'Modéré', genre: 'Homme', jour: 28, soir: "'Ils ont pris de vous une alliance solennelle.' (Coran 4:21)", soirEN: "'They have taken from you a solemn covenant.' (Quran 4:21)" },

  // MODÉRÉ FEMME
  { plan: 'Modéré', genre: 'Femme', jour: 9,  soir: "'Certes Allah est doux et Il aime la douceur en toute chose.' (Bukhari & Muslim)", soirEN: "'Indeed Allah is gentle and He loves gentleness in all things.' (Bukhari & Muslim)" },
  { plan: 'Modéré', genre: 'Femme', jour: 27, soir: "'Certes, Allah est avec les patients.' (Coran 2:153)", soirEN: "'Indeed, Allah is with the patient.' (Quran 2:153)" },

  // GRAVE FEMME
  { plan: 'Grave', genre: 'Femme', jour: 2,  soir: "'Certes Allah est doux et Il aime la douceur en toute chose.' (Bukhari & Muslim)", soirEN: "'Indeed Allah is gentle and He loves gentleness in all things.' (Bukhari & Muslim)" },
  { plan: 'Grave', genre: 'Femme', jour: 7,  soir: "'Après la difficulté vient la facilité.' (Coran 94:5-6)", soirEN: "'After difficulty comes ease.' (Quran 94:5-6)" },
];

// ─── BUILD ROWS ───────────────────────────────────────────────────────────────

function buildPlanRows() {
  const rows = [];
  // Plan data (verset entries)
  for (const e of PLAN_ENTRIES) {
    const refFR = extractRef(e.verset);
    const refEN = extractRef(e.versetEN);
    rows.push({
      plan: e.plan,
      jour: e.jour,
      cote: 'H+F',
      champ: 'verset',
      typeFR: detectType(refFR),
      refFR,
      citFR: e.verset,
      typeEN: detectType(refEN),
      refEN,
      citEN: e.versetEN,
      coherence: refFR.replace(/Coran/,'').trim() === refEN.replace(/Quran/,'').trim() ? '✓' : '⚠',
    });
  }
  // NIVEAUX entries
  for (const e of NIVEAUX_ENTRIES) {
    const refFR = extractRef(e.verset);
    const refEN = extractRef(e.versetEN);
    rows.push({
      plan: e.plan,
      jour: 'NIVEAUX',
      cote: 'H+F',
      champ: e.champ,
      typeFR: detectType(refFR),
      refFR,
      citFR: e.verset,
      typeEN: detectType(refEN),
      refEN,
      citEN: e.versetEN,
      coherence: '✓',
    });
  }
  return rows;
}

function buildNotifRows() {
  const rows = [];
  for (const e of NOTIF_ENTRIES) {
    const refFR = extractRef(e.soir);
    const refEN = extractRef(e.soirEN);
    const type = detectType(refFR) || detectType(refEN);
    rows.push({
      plan: e.plan,
      jour: e.jour,
      cote: e.genre,
      champ: 'soir (notif)',
      typeFR: type,
      refFR,
      citFR: e.soir,
      typeEN: type,
      refEN,
      citEN: e.soirEN,
      coherence: '✓',
    });
  }
  return rows;
}

// ─── ANOMALIES ────────────────────────────────────────────────────────────────

const ANOMALIES = [
  { n: 1, ref: 'Coran 4:5',   plan: 'Léger J8',     desc: "Verset sur la propriété des incapables repurposé comme 'parlez convenablement à l'épouse'" },
  { n: 2, ref: 'Coran 6:11',  plan: 'Modéré J16',   desc: "Verset de 'voyagez sur la terre' (observer les civilisations passées) utilisé pour 'changer de cadre'" },
  { n: 3, ref: 'Coran 2:187', plan: 'Grave J21',     desc: "FR='une parure pour lui' (sing. masc.) vs EN='a garment for them' (neutre pluriel)" },
  { n: 4, ref: 'Coran 25:74', plan: 'Grave J12',     desc: "EN='comfort of the eyes' devrait être 'joy of their eyes' selon Sahih International" },
  { n: 5, ref: 'Coran 42:38', plan: 'Multiple',      desc: "3 formulations FR différentes : 'mutuelle' / 'bienveillante' / 'en secret' selon le contexte" },
  { n: 6, ref: 'Coran 94:5 vs 94:6', plan: 'Multiple', desc: "Même phrase ('Après la difficulté...') utilisée indifféremment pour les deux versets" },
  { n: 7, ref: 'Coran 7:55',  plan: 'Léger J21 vs Modéré J7', desc: "Deux traductions FR différentes du même verset entre les plans" },
  { n: 8, ref: 'Bukhari (Modéré J8)', plan: 'Modéré J8', desc: "FR='comme un aumône' vs EN='like a charity' — légère divergence lexicale harmonisable" },
];

// ─── UNIQUE REFERENCES ────────────────────────────────────────────────────────

function buildUniqueRefs(planRows, notifRows) {
  const map = new Map();
  const all = [...planRows, ...notifRows];
  for (const r of all) {
    const key = r.refFR || r.refEN;
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, { ref: key, type: r.typeFR || r.typeEN, occurrences: 0, jours: [], plans: new Set() });
    }
    const entry = map.get(key);
    entry.occurrences++;
    if (r.jour !== 'NIVEAUX') entry.jours.push(`${r.plan[0]}J${r.jour}`);
    entry.plans.add(r.plan);
  }
  return Array.from(map.values())
    .sort((a, b) => b.occurrences - a.occurrences)
    .map(e => ({ ...e, plans: Array.from(e.plans).join(', '), jours: e.jours.join(', ') }));
}

// ─── EXCEL GENERATION ─────────────────────────────────────────────────────────

async function generate() {
  const planRows = buildPlanRows();
  const notifRows = buildNotifRows();
  const allRows = [...planRows, ...notifRows];
  const uniqueRefs = buildUniqueRefs(planRows, notifRows);

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Sakina Diagnostic';
  wb.created = new Date();

  const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E4057' } };
  const HEADER_FONT = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  const PLAN_COLORS = { 'Léger': 'FFFFF8E1', 'Modéré': 'FFFFF3E0', 'Grave': 'FFFDECEA' };
  const TYPE_COLORS = { Q: 'FFE8F5E9', H: 'FFE3F2FD', P: 'FFF3E5F5' };

  function styleHeader(ws, cols) {
    const headerRow = ws.getRow(1);
    headerRow.eachCell(cell => {
      cell.fill = HEADER_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
      cell.border = { bottom: { style: 'medium', color: { argb: 'FF000000' } } };
    });
    headerRow.height = 32;
    ws.views = [{ state: 'frozen', ySplit: 1 }];
  }

  function addDataRow(ws, values, planName, typeKey) {
    const row = ws.addRow(values);
    const bgColor = PLAN_COLORS[planName] || 'FFFFFFFF';
    row.eachCell(cell => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    });
    if (typeKey && TYPE_COLORS[typeKey]) {
      const typeCell = row.getCell(5); // Type column
      typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TYPE_COLORS[typeKey] } };
      typeCell.font = { bold: true };
    }
    row.height = 45;
    return row;
  }

  // ── FEUILLE 1 : TABLEAU FR ────────────────────────────────────────────────
  const ws1 = wb.addWorksheet('1 - Tableau FR');
  ws1.columns = [
    { header: 'Plan',      key: 'plan',  width: 10 },
    { header: 'Jour',      key: 'jour',  width: 8  },
    { header: 'Côté',      key: 'cote',  width: 10 },
    { header: 'Champ',     key: 'champ', width: 18 },
    { header: 'Type',      key: 'type',  width: 6  },
    { header: 'Référence', key: 'ref',   width: 16 },
    { header: 'Citation FR (100c)',  key: 'cit',   width: 80 },
  ];
  styleHeader(ws1, ws1.columns);
  for (const r of allRows) {
    addDataRow(ws1, [r.plan, r.jour, r.cote, r.champ, r.typeFR, r.refFR, truncate(r.citFR, 120)], r.plan, r.typeFR);
  }

  // ── FEUILLE 2 : TABLEAU EN ────────────────────────────────────────────────
  const ws2 = wb.addWorksheet('2 - Tableau EN');
  ws2.columns = [
    { header: 'Plan',      key: 'plan',  width: 10 },
    { header: 'Jour',      key: 'jour',  width: 8  },
    { header: 'Côté',      key: 'cote',  width: 10 },
    { header: 'Champ',     key: 'champ', width: 18 },
    { header: 'Type',      key: 'type',  width: 6  },
    { header: 'Référence', key: 'ref',   width: 16 },
    { header: 'Citation EN (100c)',  key: 'cit',   width: 80 },
  ];
  styleHeader(ws2, ws2.columns);
  for (const r of allRows) {
    addDataRow(ws2, [r.plan, r.jour, r.cote, r.champ, r.typeEN, r.refEN, truncate(r.citEN, 120)], r.plan, r.typeEN);
  }

  // ── FEUILLE 3 : TABLEAU COMPARATIF FR↔EN ─────────────────────────────────
  const ws3 = wb.addWorksheet('3 - FR vs EN');
  ws3.columns = [
    { header: 'Plan',      key: 'plan',  width: 10 },
    { header: 'Jour',      key: 'jour',  width: 8  },
    { header: 'Côté',      key: 'cote',  width: 10 },
    { header: 'Champ',     key: 'champ', width: 18 },
    { header: 'T',         key: 'type',  width: 4  },
    { header: 'Réf FR',    key: 'refFR', width: 16 },
    { header: 'Citation FR',key: 'citFR',width: 55 },
    { header: 'Réf EN',    key: 'refEN', width: 16 },
    { header: 'Citation EN',key: 'citEN',width: 55 },
    { header: 'Cohérence', key: 'coh',   width: 10 },
  ];
  styleHeader(ws3, ws3.columns);
  for (const r of allRows) {
    const row = ws3.addRow([r.plan, r.jour, r.cote, r.champ, r.typeFR, r.refFR, truncate(r.citFR, 90), r.refEN, truncate(r.citEN, 90), r.coherence]);
    const bgColor = PLAN_COLORS[r.plan] || 'FFFFFFFF';
    row.eachCell(cell => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    });
    const cohCell = row.getCell(10);
    if (r.coherence === '⚠') {
      cohCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF59D' } };
      cohCell.font = { bold: true };
    }
    row.height = 45;
  }

  // ── FEUILLE 4 : RÉFÉRENCES UNIQUES ───────────────────────────────────────
  const ws4 = wb.addWorksheet('4 - Réfs Uniques');
  ws4.columns = [
    { header: 'Référence',  key: 'ref',   width: 22 },
    { header: 'Type',       key: 'type',  width: 6  },
    { header: 'Occurrences',key: 'occ',   width: 12 },
    { header: 'Plans',      key: 'plans', width: 25 },
    { header: 'Jours',      key: 'jours', width: 60 },
  ];
  styleHeader(ws4, ws4.columns);
  for (const r of uniqueRefs) {
    const row = ws4.addRow([r.ref, r.type, r.occurrences, r.plans, r.jours]);
    row.eachCell(cell => {
      cell.alignment = { wrapText: true, vertical: 'top' };
    });
    const typeKey = r.type;
    if (TYPE_COLORS[typeKey]) {
      row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TYPE_COLORS[typeKey] } };
    }
    if (r.occurrences >= 5) {
      row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF176' } };
      row.getCell(3).font = { bold: true };
    }
    row.height = 35;
  }

  // ── FEUILLE 5 : ANOMALIES ─────────────────────────────────────────────────
  const ws5 = wb.addWorksheet('5 - Anomalies');
  ws5.columns = [
    { header: 'N°',        key: 'n',    width: 5  },
    { header: 'Référence', key: 'ref',  width: 22 },
    { header: 'Plan/Jour', key: 'plan', width: 20 },
    { header: 'Description de l\'anomalie', key: 'desc', width: 80 },
  ];
  styleHeader(ws5, ws5.columns);
  for (const a of ANOMALIES) {
    const row = ws5.addRow([a.n, a.ref, a.plan, a.desc]);
    row.eachCell(cell => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9C4' } };
    });
    row.height = 40;
  }

  // ── FEUILLE 6 : COMPTAGE ──────────────────────────────────────────────────
  const ws6 = wb.addWorksheet('6 - Comptage');
  ws6.columns = [
    { header: 'Indicateur', key: 'ind', width: 45 },
    { header: 'Valeur',     key: 'val', width: 15 },
    { header: 'Détail',     key: 'det', width: 60 },
  ];
  styleHeader(ws6, ws6.columns);

  const qRefs = uniqueRefs.filter(r => r.type === 'Q');
  const hRefs = uniqueRefs.filter(r => r.type === 'H');
  const totalQ = allRows.filter(r => r.typeFR === 'Q').length;
  const totalH = allRows.filter(r => r.typeFR === 'H').length;
  const totalP = allRows.filter(r => r.typeFR === 'P').length;

  const counts = [
    ['Entrées totales analysées (FR + EN)', allRows.length, 'planData.verset (120) + NIVEAUX (1) + notif.soir (26)'],
    ['Versets coraniques uniques (Q)', qRefs.length, qRefs.map(r=>r.ref).join(', ')],
    ['Sources hadith uniques (H)', hRefs.length, hRefs.map(r=>r.ref).join(', ')],
    ['Occurrences Q dans planData', planRows.filter(r=>r.typeFR==='Q').length, ''],
    ['Occurrences H dans planData', planRows.filter(r=>r.typeFR==='H').length, ''],
    ['Occurrences Q dans notif', notifRows.filter(r=>r.typeFR==='Q').length, ''],
    ['Occurrences H dans notif', notifRows.filter(r=>r.typeFR==='H').length, ''],
    ['Occurrences Prophète ﷺ', totalP, ''],
    ['Entrées Léger', allRows.filter(r=>r.plan==='Léger').length, ''],
    ['Entrées Modéré', allRows.filter(r=>r.plan==='Modéré').length, ''],
    ['Entrées Grave', allRows.filter(r=>r.plan==='Grave').length, ''],
    ['Anomalies identifiées', ANOMALIES.length, 'Voir feuille 5'],
    ['Cohérence FR↔EN globale', `${allRows.filter(r=>r.coherence==='✓').length}/${allRows.length}`, ''],
    ['Réf. la plus fréquente', uniqueRefs[0]?.ref || '', `${uniqueRefs[0]?.occurrences} occurrences`],
  ];

  for (const [ind, val, det] of counts) {
    const row = ws6.addRow([ind, val, det]);
    row.eachCell(cell => {
      cell.alignment = { wrapText: true, vertical: 'middle' };
    });
    row.getCell(2).font = { bold: true };
    row.height = 22;
  }

  // ─── ÉCRITURE ─────────────────────────────────────────────────────────────
  const outPath = path.join(__dirname, 'diagnostic_references_islamiques.xlsx');
  await wb.xlsx.writeFile(outPath);
  console.log(`\n✅ Fichier créé : ${outPath}`);
  console.log(`   Feuilles : FR (${allRows.length} lignes) | EN | FR↔EN | Réfs uniques (${uniqueRefs.length}) | Anomalies (${ANOMALIES.length}) | Comptage`);
}

generate().catch(err => { console.error('Erreur:', err); process.exit(1); });
