import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/l-arsn")({
  head: () => ({
    meta: [
      { title: "L'ARSN — Missions et Organisation" },
      {
        name: "description",
        content:
          "Missions, organisation et textes constitutifs de l'Autorité Sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires.",
      },
      { property: "og:title", content: "L'ARSN — Missions et Organisation" },
      {
        property: "og:description",
        content: "Autorité indépendante rattachée à la Présidence de la République du Sénégal.",
      },
    ],
  }),
  component: Page,
});

const FR = {
  hero: "À PROPOS DE L'ARSN",
  title: "Assurer et protéger : tel est le sens de l'action de l'ARSN",
  subtitle:
    "Autorité administrative indépendante, dotée de la personnalité juridique et de l'autonomie financière, rattachée à la Présidence de la République.",
  intro:
    "L'Autorité sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires (ARSN), est une autorité administrative indépendante, dotée de la personnalité juridique et de l'autonomie financière. Elle est rattachée à la Présidence de la République par la loi 2021-44 du 31 décembre 2021, qui abroge et remplace la loi n° 2009-14 relative à la sécurité en matière nucléaire et à la radioprotection et la loi n° 2004-17 du 15 juin 2004, relative à la protection contre les rayonnements ionisants. Elle est l'autorité compétente en matière de radioprotection, de sûreté et de sécurité nucléaires ainsi que de la mise en œuvre des garanties.",
  protectTitle:
    "Protéger les travailleurs, les patients, le public et l'environnement contre les effets néfastes des rayonnements ionisants",
  protectBody:
    "La mise en place de l'ARSN entre dans le cadre du respect par le Sénégal de ses engagements internationaux de mettre en place le cadre juridique correspondant à l'utilisation du nucléaire à des fins civiles dans des conditions de sûreté, de sécurité et d'intervention en cas d'accident radiologique ou nucléaire, ou d'événements liés à des actes malveillants impliquant les matières radioactives. Elle apporte son concours, donne des conseils et fournit des informations sur toute question de sûreté notamment dans les domaines suivants :",
  domains: [
    "Protection de l'environnement",
    "Santé publique et santé au travail",
    "Planification et préparation des situations d'urgence",
    "Gestion des déchets radioactifs (y compris la définition d'une politique nationale)",
    "Responsabilité civile (application des règlements nationaux et conventions internationales)",
    "Protection physique et garanties",
    "Utilisation de l'eau et alimentation",
    "Utilisation des sols",
    "Sûreté du transport des marchandises dangereuses",
  ],
  missionsTitle: "Missions",
  missionsBody:
    "L'Autorité sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires est chargée, au nom de l'État du Sénégal, du contrôle de la radioprotection ainsi que de la sûreté et la sécurité nucléaires pour protéger les travailleurs, les patients, le public et l'environnement, contre les risques liés aux activités nucléaires. Elle contribue également à l'information et à la sensibilisation des citoyens. Pour exercer le contrôle, l'ARSN procède à l'autorisation de toutes les pratiques et activités utilisant les rayonnements ionisants et à leur inspection, sur la base des principes fondamentaux qui régissent la radioprotection et la sûreté nucléaire ainsi que les recommandations de sécurité nucléaire, en veillant au respect des missions qui lui ont été assignées dans le cadre législatif et réglementaire défini par l'État.",
  orgTitle: "Organisation",
  orgBody:
    "Conformément à l'article 9 du décret 2010-893 portant organisation et fonctionnement de l'ARSN, l'ARSN est dirigée par un Directeur général, assisté d'un Comité des Experts, à titre consultatif. Selon les dispositions de l'article 14 du même décret, la Direction générale de l'ARSN comprend les directions suivantes :",
  directions: [
    "Direction des Ressources humaines et financières (DRHF)",
    "Direction de la Réglementation et des Autorisations (DRA)",
    "Direction des Inspections (DI)",
    "Direction de l'Information, de la Communication et de la Documentation (DICD)",
  ],
  committee:
    "Le Comité des Experts est l'organe de supervision des activités de l'ARSN. Il assiste par ses avis et recommandations le Directeur général dans l'exercice de sa mission. Il délibère sur les orientations générales du plan d'action de l'ARSN et sur le programme annuel d'activités. Il comprend cinq membres spécialistes dans les domaines des sciences et techniques nucléaires, du droit, de l'environnement et de l'énergie. Les directeurs sont nommés par décret sur proposition du Directeur général et avis du Comité des Experts. Le Directeur général désigne, après avis du Comité des Experts, les Inspecteurs de la sûreté nucléaire.",
  textsTitle: "Textes de référence",
  texts: [
    "Loi n° 2021-44 du 31 décembre 2021 relative à la radioprotection, la sûreté et la sécurité nucléaires et aux garanties",
    "Décret n° 2010-893 portant organisation et fonctionnement de l'ARSN",
    "Loi abrogée n° 2009-14 relative à la sécurité en matière nucléaire et à la radioprotection",
    "Loi abrogée n° 2004-17 du 15 juin 2004 relative à la protection contre les rayonnements ionisants",
  ],
};

const EN: typeof FR = {
  hero: "ABOUT ARSN",
  title: "Ensure and protect: this is the meaning of ARSN's action",
  subtitle:
    "Independent administrative authority with legal personality and financial autonomy, reporting to the Presidency of the Republic.",
  intro:
    "The Senegalese Authority for Radiation Protection, Nuclear Safety and Security (ARSN) is an independent administrative authority with legal personality and financial autonomy. It reports to the Presidency of the Republic under law 2021-44 of 31 December 2021, which repeals and replaces law 2009-14 on nuclear security and radiation protection and law 2004-17 of 15 June 2004 on protection against ionising radiation. It is the competent authority for radiation protection, nuclear safety and security, and the implementation of safeguards.",
  protectTitle:
    "Protecting workers, patients, the public and the environment against the harmful effects of ionising radiation",
  protectBody:
    "The establishment of ARSN is part of Senegal's compliance with its international commitments to put in place a legal framework for the civilian use of nuclear technology under conditions of safety, security and emergency response in case of a radiological or nuclear accident, or events linked to malicious acts involving radioactive materials. ARSN provides assistance, advice and information on any safety matter, in particular in the following areas:",
  domains: [
    "Protection of the environment",
    "Public health and occupational health",
    "Emergency planning and preparedness",
    "Radioactive waste management (including national policy definition)",
    "Civil liability (application of national regulations and international conventions)",
    "Physical protection and safeguards",
    "Water use and food",
    "Land use",
    "Safety of the transport of dangerous goods",
  ],
  missionsTitle: "Missions",
  missionsBody:
    "The Senegalese Authority for Radiation Protection, Nuclear Safety and Security is responsible, on behalf of the State of Senegal, for the control of radiation protection as well as nuclear safety and security to protect workers, patients, the public and the environment from risks related to nuclear activities. It also contributes to citizen information and awareness. To exercise this control, ARSN authorises all practices and activities using ionising radiation and inspects them, based on the fundamental principles governing radiation protection and nuclear safety as well as nuclear security recommendations, in compliance with the missions assigned to it by the legislative and regulatory framework defined by the State.",
  orgTitle: "Organisation",
  orgBody:
    "In accordance with article 9 of decree 2010-893 on the organisation and functioning of ARSN, the Authority is headed by a Director General, assisted by a Committee of Experts in an advisory capacity. Under article 14 of the same decree, the General Directorate of ARSN comprises the following directorates:",
  directions: [
    "Directorate of Human and Financial Resources (DRHF)",
    "Directorate of Regulation and Authorisations (DRA)",
    "Directorate of Inspections (DI)",
    "Directorate of Information, Communication and Documentation (DICD)",
  ],
  committee:
    "The Committee of Experts is the supervisory body of ARSN activities. Through its opinions and recommendations it assists the Director General. It deliberates on general orientations of the ARSN action plan and on the annual programme of activities. It comprises five members who are specialists in nuclear science and technology, law, the environment and energy. Directors are appointed by decree on the proposal of the Director General and the opinion of the Committee. The Director General designates, after the Committee's opinion, the Inspectors of nuclear safety.",
  textsTitle: "Reference texts",
  texts: [
    "Law 2021-44 of 31 December 2021 on radiation protection, nuclear safety and security and safeguards",
    "Decree 2010-893 on the organisation and functioning of ARSN",
    "Repealed law 2009-14 on nuclear security and radiation protection",
    "Repealed law 2004-17 of 15 June 2004 on protection against ionising radiation",
  ],
};

function Page() {
  const { lang } = useLang();
  const c = lang === "fr" ? FR : EN;
  return (
    <>
      <PageHero eyebrow={c.hero} title={c.title} subtitle={c.subtitle} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 space-y-12">
          <p className="text-lg text-muted-foreground leading-relaxed">{c.intro}</p>

          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">{c.protectTitle}</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">{c.protectBody}</p>
            <ol className="grid sm:grid-cols-2 gap-3 list-decimal list-inside text-sm">
              {c.domains.map((d) => (
                <li key={d} className="p-4 bg-white ring-1 ring-black/5">
                  {d}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">{c.missionsTitle}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{c.missionsBody}</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">{c.orgTitle}</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">{c.orgBody}</p>
            <ul className="space-y-2 mb-6">
              {c.directions.map((d) => (
                <li key={d} className="p-4 bg-white ring-1 ring-black/5 text-sm font-medium">
                  {d}
                </li>
              ))}
            </ul>
            <p className="text-base text-muted-foreground leading-relaxed">{c.committee}</p>
          </div>
        </section>

        <aside className="bg-foreground text-white p-8 rounded-sm h-fit">
          <h3 className="text-sm font-mono uppercase tracking-[0.2em] border-b border-white/10 pb-4 mb-6">
            {c.textsTitle}
          </h3>
          <ul className="space-y-4 text-sm">
            {c.texts.map((k) => (
              <li key={k} className="flex gap-3 items-start">
                <FileText className="w-4 h-4 shrink-0 text-arsn-yellow mt-0.5" />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
