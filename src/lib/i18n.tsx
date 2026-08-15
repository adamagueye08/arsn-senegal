import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

type Dict = Record<string, string>;
type Translations = Record<Lang, Dict>;

// Central dictionary. Keep keys stable; values are the visible copy.
export const translations: Translations = {
  fr: {
    // Top bar
    "topbar.location": "DAKAR, SÉNÉGAL",
    "topbar.phone": "+221 33 832 55 50",
    "topbar.email": "INFO@ARSN.GOUV.SN",

    // Nav
    "nav.home": "Accueil",
    "nav.arsn": "L'ARSN",
    "nav.regulation": "Réglementation",
    "nav.authorization": "Autorisations",
    "nav.inspection": "Inspections",
    "nav.dosimetry": "Dosimétrie",
    "nav.information": "Information",
    "nav.videotheque": "Vidéothèque",
    "nav.contact": "Contact",
    "nav.account": "Autorisations",
    "nav.services": "Services en ligne",
    "nav.publications": "Publications",
    "nav.articles": "Articles & actualités",
    "nav.hero.reqAuth": "Demander une autorisation",
    "nav.hero.reportIncident": "Déclarer un incident",
    "nav.hero.downloadForm": "Télécharger un formulaire",
    // Home hero
    "home.hero.tag": "Communiqué Officiel",
    "home.hero.title.1": "Renforcement de la surveillance du",
    "home.hero.title.emph": "parc radiologique",
    "home.hero.title.2": "national",
    "home.hero.desc":
      "L'ARSN publie son rapport annuel sur l'état de la sûreté nucléaire et de la radioprotection au Sénégal. Une analyse rigoureuse des installations médicales et industrielles du pays.",
    "home.hero.cta": "Consulter le rapport complet",

    // Sections
    "home.taxonomy.section": "SECTION",
    "home.news.title": "Actualités Récentes",
    "home.news.viewAll": "Voir tout",
    "home.decisions.title": "Avis & Décisions",
    "home.decisions.cta": "Consulter le registre",
    "home.downloads.title": "Téléchargements",

    // Taxonomy cards
    "tax.regulation.desc": "Cadre juridique et textes constitutifs de l'autorité.",
    "tax.inspection.desc": "Suivi des installations et rapports de conformité.",
    "tax.dosimetry.desc": "Surveillance de l'exposition professionnelle.",
    "tax.videotheque.desc": "Ressources pédagogiques et archives média.",

    // News items
    "news.1.date": "17 JUILLET 2026",
    "news.1.title": "Conférence internationale sur les systèmes de réglementation nucléaire et radiologique",
    "news.1.excerpt":
      "L'ARSN participe à la conférence internationale de l'AIEA sur les cadres réglementaires en matière de sûreté nucléaire...",
    "news.2.date": "08 JUILLET 2026",
    "news.2.title": "Visite du CICO à l'ARSN : coopération renforcée en matière de sûreté et sécurité nucléaire",
    "news.2.excerpt":
      "Le Comité Interministériel de Coordination Opérationnelle a échangé avec les équipes de l'ARSN sur la protection nationale...",
    "news.3.date": "22 AVRIL 2026",
    "news.3.title": "Mission ORPAS de l'AIEA au Sénégal : évaluation indépendante de la radioprotection",
    "news.3.excerpt":
      "Évaluation indépendante par les pairs de la radioprotection des travailleurs dans les installations sénégalaises.",
    "news.4.date": "15 AVRIL 2026",
    "news.4.title": "Rencontre avec l'Association Sénégalaise des Professionnels de l'Équipement (ASPEM)",
    "news.4.excerpt":
      "Dialogue sur les bonnes pratiques d'importation et de maintenance des équipements émetteurs de rayonnements ionisants.",

    // Decisions
    "dec.1.ref": "RÉF : DÉCISION 2023-001-ARSN",
    "dec.1.text": "Décision du 22 août 2023 relative à la radioprotection des patients.",
    "dec.2.ref": "RÉF : DÉCISION 2024-001-ARSN",
    "dec.2.text": "Décision du 07 mars 2024 relative à la radioprotection des travailleurs.",

    // Reports
    "rep.1.title": "Résumé Exécutif — Rapport annuel 2023",
    "rep.1.meta": "Publication officielle • 3.8 MB",
    "rep.2.title": "Guide de Radioprotection Médicale",
    "rep.2.meta": "Mise à jour Fév 2024 • 4.2 MB",

    // Pages
    "page.arsn.title": "L'ARSN",
    "page.arsn.subtitle": "Autorité Sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires",
    "page.arsn.mission.title": "Nos missions",
    "page.arsn.mission.body":
      "L'ARSN est une autorité administrative indépendante créée par la loi n° 2021-44 du 31 décembre 2021, rattachée à la Présidence de la République. Elle est chargée de la réglementation, du contrôle et de la surveillance en matière de radioprotection, de sûreté nucléaire et de sécurité des sources de rayonnements ionisants au Sénégal.",
    "page.arsn.org.title": "Organisation",
    "page.arsn.org.body":
      "L'Autorité est dirigée par un Directeur Général, assisté d'un Secrétaire Général et de directions techniques : Direction de la Réglementation et des Autorisations, Direction du Contrôle et de l'Inspection, Direction de la Dosimétrie, Direction de la Communication et de la Coopération Internationale.",
    "page.arsn.texts.title": "Textes constitutifs",
    "page.arsn.texts.1": "Loi n° 2021-44 du 31 décembre 2021 portant création de l'ARSN",
    "page.arsn.texts.2": "Décret d'application n° 2022-1548",
    "page.arsn.texts.3": "Arrêtés relatifs à l'organisation interne",

    "page.reg.title": "Réglementation",
    "page.reg.subtitle": "Cadre juridique de la radioprotection et de la sûreté nucléaire au Sénégal",
    "page.reg.intro":
      "L'ARSN élabore et met en œuvre la réglementation nationale en conformité avec les standards internationaux de l'AIEA. Toute activité mettant en œuvre des rayonnements ionisants est soumise à ce cadre.",
    "page.reg.cat.laws": "Lois",
    "page.reg.cat.decrees": "Décrets",
    "page.reg.cat.orders": "Arrêtés",
    "page.reg.cat.decisions": "Décisions",

    "page.auth.title": "Autorisation",
    "page.auth.subtitle": "Régime d'autorisation des activités nucléaires et radiologiques",
    "page.auth.intro":
      "Toute personne physique ou morale exerçant une activité impliquant des sources de rayonnements ionisants doit être titulaire d'une autorisation délivrée par l'ARSN.",
    "page.auth.steps.title": "Étapes de la demande",
    "page.auth.step.1": "Retirer et compléter le formulaire d'autorisation",
    "page.auth.step.2": "Constituer le dossier technique (spécifications, plan de radioprotection)",
    "page.auth.step.3": "Dépôt du dossier au siège de l'ARSN",
    "page.auth.step.4": "Instruction et inspection préalable éventuelle",
    "page.auth.step.5": "Délivrance de l'autorisation ou notification motivée",

    "page.insp.title": "Inspection",
    "page.insp.subtitle": "Contrôle sur site et surveillance de la conformité",
    "page.insp.intro":
      "Les inspecteurs de l'ARSN assermentés effectuent des visites régulières et inopinées dans toutes les installations autorisées afin de vérifier le respect des exigences réglementaires.",
    "page.insp.types.title": "Types d'inspections",
    "page.insp.type.1": "Inspection initiale préalable à l'autorisation",
    "page.insp.type.2": "Inspection périodique programmée",
    "page.insp.type.3": "Inspection inopinée ou de suivi",
    "page.insp.type.4": "Inspection suite à incident ou plainte",

    "page.dosi.title": "Dosimétrie",
    "page.dosi.subtitle": "Surveillance dosimétrique des travailleurs exposés",
    "page.dosi.intro":
      "Le service de dosimétrie de l'ARSN assure le suivi individuel de l'exposition professionnelle des travailleurs manipulant des rayonnements ionisants au Sénégal.",
    "page.dosi.services.title": "Prestations",
    "page.dosi.svc.1": "Fourniture et lecture de dosimètres passifs (TLD/OSL)",
    "page.dosi.svc.2": "Suivi trimestriel et rapports individuels",
    "page.dosi.svc.3": "Registre national d'exposition professionnelle",
    "page.dosi.svc.4": "Étalonnage et conseils techniques",

    "page.info.title": "Information",
    "page.info.subtitle": "Actualités, communiqués et événements de l'ARSN",

    "page.video.title": "Vidéothèque",
    "page.video.subtitle": "Ressources vidéo pédagogiques et institutionnelles",
    "page.video.empty":
      "Les vidéos institutionnelles, tutoriels et enregistrements de conférences seront prochainement mis en ligne.",

    "page.contact.title": "Contact",
    "page.contact.subtitle": "Nous joindre",
    "page.contact.address.title": "Siège",
    "page.contact.address.body": "L/14 Scat Urbam Mariste, Espace Résidence Hann, Dakar, Sénégal",
    "page.contact.phone.title": "Téléphone",
    "page.contact.email.title": "Courriel",
    "page.contact.hours.title": "Horaires",
    "page.contact.hours.body": "Lundi — Vendredi\n08:00 — 17:00",

    // Footer
    "footer.about":
      "Autorité administrative indépendante rattachée à la Présidence de la République, chargée d'assurer la protection des personnes et de l'environnement contre les effets nocifs des rayonnements ionisants.",
    "footer.partners": "Partenaires Internationaux",
    "footer.contact": "Contact",
    "footer.hours.days": "Lundi — Vendredi",
    "footer.hours.time": "08:00 — 17:00",
    "footer.rights": "© 2026 ARSN SÉNÉGAL — TOUS DROITS RÉSERVÉS",
    "footer.legal": "Mentions Légales",
    "footer.sitemap": "Plan du site",
    "footer.a11y": "Accessibilité",
  },
  en: {
    "topbar.location": "DAKAR, SENEGAL",
    "topbar.phone": "+221 33 832 55 50",
    "topbar.email": "INFO@ARSN.GOUV.SN",

    "nav.home": "Home",
    "nav.arsn": "About",
    "nav.regulation": "Regulation",
    "nav.authorization": "Licensing",
    "nav.inspection": "Inspection",
    "nav.dosimetry": "Dosimetry",
    "nav.information": "News",
    "nav.videotheque": "Video Library",
    "nav.contact": "Contact",
    "nav.services": "Online Services",
    "nav.publications": "Publications",
    "nav.articles": "Articles & News",
    "nav.hero.reqAuth": "Apply for a licence",
    "nav.hero.reportIncident": "Report an incident",
    "nav.hero.downloadForm": "Download a form",
    "nav.account": "Applicant Area",
    "home.hero.tag": "Official Statement",
    "home.hero.title.1": "Strengthening oversight of the national",
    "home.hero.title.emph": "radiological infrastructure",
    "home.hero.title.2": "",
    "home.hero.desc":
      "ARSN publishes its annual report on the state of nuclear safety and radiation protection in Senegal — a rigorous review of the country's medical and industrial installations.",
    "home.hero.cta": "Read the full report",

    "home.taxonomy.section": "SECTION",
    "home.news.title": "Latest News",
    "home.news.viewAll": "See all",
    "home.decisions.title": "Notices & Decisions",
    "home.decisions.cta": "Open the registry",
    "home.downloads.title": "Downloads",

    "tax.regulation.desc": "Legal framework and founding texts of the Authority.",
    "tax.inspection.desc": "Facility oversight and compliance reports.",
    "tax.dosimetry.desc": "Monitoring of occupational exposure.",
    "tax.videotheque.desc": "Educational resources and media archives.",

    "news.1.date": "JULY 17, 2026",
    "news.1.title": "International conference on nuclear and radiological regulatory systems",
    "news.1.excerpt":
      "ARSN takes part in the IAEA international conference on regulatory frameworks for nuclear safety...",
    "news.2.date": "JULY 8, 2026",
    "news.2.title": "CICO visit to ARSN: strengthened cooperation on nuclear safety and security",
    "news.2.excerpt":
      "The Interministerial Operational Coordination Committee met with ARSN teams on national protection matters...",
    "news.3.date": "APRIL 22, 2026",
    "news.3.title": "IAEA ORPAS mission to Senegal: independent evaluation of radiation protection",
    "news.3.excerpt":
      "Independent peer review of occupational radiation protection in Senegalese installations.",
    "news.4.date": "APRIL 15, 2026",
    "news.4.title": "Meeting with the Senegalese Association of Equipment Professionals (ASPEM)",
    "news.4.excerpt":
      "Dialogue on best practices for importing and maintaining ionising radiation equipment.",

    "dec.1.ref": "REF: DECISION 2023-001-ARSN",
    "dec.1.text": "Decision of 22 August 2023 on patient radiation protection.",
    "dec.2.ref": "REF: DECISION 2024-001-ARSN",
    "dec.2.text": "Decision of 07 March 2024 on worker radiation protection.",

    "rep.1.title": "Executive Summary — 2023 Annual Report",
    "rep.1.meta": "Official publication • 3.8 MB",
    "rep.2.title": "Medical Radiation Protection Guide",
    "rep.2.meta": "Updated Feb 2024 • 4.2 MB",

    "page.arsn.title": "About ARSN",
    "page.arsn.subtitle": "Senegalese Authority for Radiation Protection, Nuclear Safety and Security",
    "page.arsn.mission.title": "Our missions",
    "page.arsn.mission.body":
      "ARSN is an independent administrative authority established by Law No. 2021-44 of 31 December 2021, reporting to the Presidency of the Republic. It is responsible for regulation, oversight and monitoring of radiation protection, nuclear safety and security of ionising radiation sources in Senegal.",
    "page.arsn.org.title": "Organisation",
    "page.arsn.org.body":
      "The Authority is led by a Director General, assisted by a Secretary General and technical directorates: Regulation and Licensing, Inspection and Oversight, Dosimetry, Communication and International Cooperation.",
    "page.arsn.texts.title": "Founding texts",
    "page.arsn.texts.1": "Law No. 2021-44 of 31 December 2021 establishing ARSN",
    "page.arsn.texts.2": "Implementing decree No. 2022-1548",
    "page.arsn.texts.3": "Orders on internal organisation",

    "page.reg.title": "Regulation",
    "page.reg.subtitle": "Legal framework for radiation protection and nuclear safety in Senegal",
    "page.reg.intro":
      "ARSN develops and enforces national regulation in line with IAEA international standards. Any activity involving ionising radiation is subject to this framework.",
    "page.reg.cat.laws": "Laws",
    "page.reg.cat.decrees": "Decrees",
    "page.reg.cat.orders": "Orders",
    "page.reg.cat.decisions": "Decisions",

    "page.auth.title": "Licensing",
    "page.auth.subtitle": "Authorisation regime for nuclear and radiological activities",
    "page.auth.intro":
      "Any natural or legal person carrying out an activity involving ionising radiation sources must hold an authorisation issued by ARSN.",
    "page.auth.steps.title": "Application steps",
    "page.auth.step.1": "Obtain and complete the authorisation form",
    "page.auth.step.2": "Compile the technical file (specifications, radiation protection plan)",
    "page.auth.step.3": "Submit the file at ARSN headquarters",
    "page.auth.step.4": "Review and possible prior inspection",
    "page.auth.step.5": "Issuance of the authorisation or reasoned refusal",

    "page.insp.title": "Inspection",
    "page.insp.subtitle": "On-site oversight and compliance monitoring",
    "page.insp.intro":
      "Sworn ARSN inspectors carry out regular and unannounced visits to all authorised installations to verify compliance with regulatory requirements.",
    "page.insp.types.title": "Inspection types",
    "page.insp.type.1": "Initial inspection prior to authorisation",
    "page.insp.type.2": "Scheduled periodic inspection",
    "page.insp.type.3": "Unannounced or follow-up inspection",
    "page.insp.type.4": "Inspection following an incident or complaint",

    "page.dosi.title": "Dosimetry",
    "page.dosi.subtitle": "Dosimetric monitoring of exposed workers",
    "page.dosi.intro":
      "The ARSN dosimetry service ensures individual monitoring of occupational exposure for workers handling ionising radiation in Senegal.",
    "page.dosi.services.title": "Services",
    "page.dosi.svc.1": "Supply and reading of passive dosimeters (TLD/OSL)",
    "page.dosi.svc.2": "Quarterly monitoring and individual reports",
    "page.dosi.svc.3": "National register of occupational exposure",
    "page.dosi.svc.4": "Calibration and technical advice",

    "page.info.title": "News",
    "page.info.subtitle": "ARSN news, statements and events",

    "page.video.title": "Video Library",
    "page.video.subtitle": "Institutional and educational video resources",
    "page.video.empty":
      "Institutional videos, tutorials and conference recordings will be published here soon.",

    "page.contact.title": "Contact",
    "page.contact.subtitle": "Get in touch",
    "page.contact.address.title": "Headquarters",
    "page.contact.address.body": "L/14 Scat Urbam Mariste, Espace Résidence Hann, Dakar, Senegal",
    "page.contact.phone.title": "Phone",
    "page.contact.email.title": "Email",
    "page.contact.hours.title": "Office hours",
    "page.contact.hours.body": "Monday — Friday\n08:00 — 17:00",

    "footer.about":
      "Independent administrative authority reporting to the Presidency of the Republic, responsible for protecting people and the environment from the harmful effects of ionising radiation.",
    "footer.partners": "International Partners",
    "footer.contact": "Contact",
    "footer.hours.days": "Monday — Friday",
    "footer.hours.time": "08:00 — 17:00",
    "footer.rights": "© 2026 ARSN SENEGAL — ALL RIGHTS RESERVED",
    "footer.legal": "Legal Notice",
    "footer.sitemap": "Sitemap",
    "footer.a11y": "Accessibility",
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("arsn-lang");
      if (stored === "fr" || stored === "en") setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("arsn-lang", l);
      document.documentElement.lang = l;
    } catch {
      /* ignore */
    }
  };

  const t = (key: string) => translations[lang][key] ?? key;

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
