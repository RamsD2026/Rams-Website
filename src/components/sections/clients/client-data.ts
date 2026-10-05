/**
 * The customer portfolio.
 *
 * Names and logos are RAMS's own, taken from the clients logo wall the
 * company supplied. 90 organisations, 74 of them with a mark; the rest are
 * listed by name, which is better than inventing a logo for a real company.
 *
 * Sorted alphabetically here rather than in the component, so the wall reads
 * the same on the server and the client and does not depend on the order the
 * source document happened to use.
 */

export type Client = {
  name: string;
  /** Path under /public/clients, where one exists. */
  logo?: string;
};

export const CLIENTS: Client[] = [
  { name: "ABB India Limited", logo: "/clients/abb.png" },
  { name: "Aditya Birla Fashion and Retail Limited", logo: "/clients/aditya-birla.png" },
  { name: "Amalgamations Valeo Clutch Private Limited", logo: "/clients/valeo.png" },
  { name: "Armacell India Pvt Ltd", logo: "/clients/armacell.png" },
  { name: "Ashok Leyland Ltd.", logo: "/clients/ashok-leyland.png" },
  { name: "Asian Paints Pvt Ltd", logo: "/clients/asian-paints.png" },
  { name: "Belimo Automation India" },
  { name: "Birdview Warehousing and Distribution Pvt Ltd", logo: "/clients/75.png" },
  { name: "Bosch", logo: "/clients/17.png" },
  { name: "Brightlife Care Pvt Ltd" },
  { name: "Caterpillar India Private Limited", logo: "/clients/caterpillar.png" },
  { name: "Cipla Limited", logo: "/clients/cipla.png" },
  { name: "Coca Cola", logo: "/clients/coca-cola.png" },
  { name: "Continental Automotive Components Pvt Ltd", logo: "/clients/continental.png" },
  { name: "Copeland India Pvt Ltd", logo: "/clients/copeland.png" },
  { name: "Coromandel", logo: "/clients/coromandel.png" },
  { name: "Cummins India Limited", logo: "/clients/cummins.png" },
  { name: "DHL Supply Chain Pvt Ltd", logo: "/clients/3.png" },
  { name: "Domo Engineering Plastics India Ltd", logo: "/clients/domo.png" },
  { name: "ElringKlinger Automotive Components (India) Pvt. Ltd", logo: "/clients/elringklinger.png" },
  { name: "Emirates Logistics India Pvt Ltd", logo: "/clients/emirates-logistics.png" },
  { name: "Exide Industries Limited", logo: "/clients/exide.png" },
  { name: "Ferrero Bharat Pvt. Ltd.", logo: "/clients/ferrero.png" },
  { name: "Fleetguard Filters Private Limited", logo: "/clients/fleetguard.png" },
  { name: "Flipkart", logo: "/clients/flipkart.png" },
  { name: "FLYJAC Logistics Pvt Ltd", logo: "/clients/flyjac.png" },
  { name: "Forbes Marshall Pvt Ltd", logo: "/clients/forbes-marshall.png" },
  { name: "FORVIA Faurecia India Pvt Ltd", logo: "/clients/forvia.png" },
  { name: "Garrett", logo: "/clients/garrett.png" },
  { name: "GE Vernova", logo: "/clients/ge-vernova.png" },
  { name: "GKN Driveline India Ltd", logo: "/clients/gkn.png" },
  { name: "GMR", logo: "/clients/gmr.png" },
  { name: "GRAIN 'N' GRACE Food Ingredients Manufacturing Pvt Ltd", logo: "/clients/39.png" },
  { name: "Grundfos Pumps India Private Limited", logo: "/clients/grundfos.png" },
  { name: "Heubach Colorants India Pvt Ltd", logo: "/clients/heubach.png" },
  { name: "Hindustan Unilever Limited", logo: "/clients/37.png" },
  { name: "HSI Auto" },
  { name: "Huhtamaki India Limited", logo: "/clients/38.png" },
  { name: "Ingram Micro India Pvt Ltd", logo: "/clients/ingram-micro.png" },
  { name: "Instakart Services Private Limited" },
  { name: "IPCA Laboratories", logo: "/clients/ipca.png" },
  { name: "ITC Limited", logo: "/clients/itc.png" },
  { name: "JCB India Limited", logo: "/clients/jcb.png" },
  { name: "JM Baxi Ports & Logistics Pvt Ltd", logo: "/clients/jm-baxi.png" },
  { name: "KD Supply Chain Solutions Pvt. Ltd.", logo: "/clients/12.png" },
  { name: "Kintetsu World Express (India) Pvt. Ltd.", logo: "/clients/kintetsu-world-express.png" },
  { name: "Koerber Supply Chain Limited", logo: "/clients/14.png" },
  { name: "L'Oréal India Pvt Ltd", logo: "/clients/loreal.png" },
  { name: "Liladhar Pasoo", logo: "/clients/liladhar-pasoo.png" },
  { name: "LM Windpower", logo: "/clients/lm-wind-power.png" },
  { name: "Logisteed India Pvt Ltd", logo: "/clients/13.png" },
  { name: "M/S Delhi International Airport Limited", logo: "/clients/78.png" },
  { name: "Mahindra Logistics Limited", logo: "/clients/mahindra-logistics.png" },
  { name: "Myntra" },
  { name: "Nestle Guwahati", logo: "/clients/nestle.png" },
  { name: "Ognibene India Pvt. Ltd", logo: "/clients/28.png" },
  { name: "Parallel Track MHE Pvt. Ltd. (Mezzanine Structure)" },
  { name: "Pixel Logistics" },
  { name: "Qwik Supply Chain Pvt Ltd", logo: "/clients/15.png" },
  { name: "Reckitt Benckiser India Pvt. Ltd.", logo: "/clients/reckitt.png" },
  { name: "Renewsys India Pvt Ltd", logo: "/clients/renewsys.png" },
  { name: "Rentomojo (Edunetwork Pvt Ltd)", logo: "/clients/rentomojo.png" },
  { name: "Rhenus Contract Logistics India Pvt Ltd MUF23", logo: "/clients/rhenus-logistics.png" },
  { name: "Rossari Biotech Limited", logo: "/clients/rossari.png" },
  { name: "RSA Global", logo: "/clients/rsa-global.png" },
  { name: "Rubicon Research Limited", logo: "/clients/rubicon-research.png" },
  { name: "S.N. ENTERPRISES" },
  { name: "Saint Gobain Pvt Ltd", logo: "/clients/saint-gobain.png" },
  { name: "SAP Print Solutions Pvt. Ltd." },
  { name: "SFS Group India Pvt Ltd (Sharvari Associates)", logo: "/clients/30.png" },
  { name: "Shree Mahavira Enterprises" },
  { name: "Siemens Limited", logo: "/clients/siemens.png" },
  { name: "Sonepar India" },
  { name: "Southco India Pvt. Ltd.", logo: "/clients/southco.png" },
  { name: "Supreme Petrochem Ltd", logo: "/clients/supreme-petrochem.png" },
  { name: "Tarz Distribution India Pvt Ltd" },
  { name: "Theorem Solutions Pvt. Ltd" },
  { name: "Tirupati Enterprises" },
  { name: "Union Warehousing", logo: "/clients/74.png" },
  { name: "Unitop Chemicals Pvt Ltd", logo: "/clients/unitop.png" },
  { name: "V Logis" },
  { name: "Vishay Components India Pvt Ltd.", logo: "/clients/vishay.png" },
  { name: "Volvo", logo: "/clients/volvo.png" },
  { name: "Wal Mart India Pvt Ltd", logo: "/clients/57.png" },
  { name: "WE3 Supply Chain Solutions Pvt Ltd", logo: "/clients/76.png" },
  { name: "WIPRO PARI Pvt. Ltd.", logo: "/clients/wipro-pari.png" },
  { name: "Yamazaki Mazak Machine Tools Pvt. Ltd.", logo: "/clients/mazak.png" },
  { name: "YAPP India Automotive Systems Private Limited", logo: "/clients/29.png" },
  { name: "ZFW Hospitality Pvt Ltd" },
  { name: "Zippee", logo: "/clients/zippee.png" },
];


/** RAMS's published footprint. These figures are the company's own. */
export const FOOTPRINT = [
  { value: "85+", label: "Enterprise clients" },
  { value: "300+", label: "Warehouses supported" },
  { value: "3M+", label: "Sq ft inspected" },
  { value: "23+", label: "States across India" },
];

export const SECTORS = [
  "Logistics",
  "Manufacturing",
  "FMCG",
  "Pharma",
  "Automotive",
  "Retail",
  "Industrial",
  "Food & beverage",
];

/**
 * The twelve marks in the hero grid — six across, two rows.
 *
 * This is the set from the clients document, in its order. They read from
 * `/clients-on-dark`, the colour artwork reversed for this dark hero, so the
 * companies keep their own colours rather than the white knockouts the
 * moving strip uses.
 *
 * The `/clients` originals keep every white enclosed by the mark, which
 * showed here as white patches (Bosch's circle, IPCA's letters, Supreme
 * Petrochem's roundel). `scripts/gen-on-dark-clients.mjs` cuts those whites,
 * turns black and grey ink white and lifts colours too dark for the ground.
 * Add a mark here and add its slug to that script.
 *
 * Ekart stands in as Flipkart: the portfolio lists Instakart Services, the
 * Flipkart entity, and there is no Ekart mark in the asset pack. Swap it the
 * moment one exists.
 */
export const HERO_GRID: Client[] = [
  { name: "Mahindra Logistics", logo: "/clients-on-dark/mahindra-logistics.png" },
  { name: "DHL", logo: "/clients-on-dark/dhl.png" },
  { name: "Bosch", logo: "/clients-on-dark/bosch.png" },
  { name: "Ferrero", logo: "/clients-on-dark/ferrero.png" },
  { name: "IPCA Laboratories", logo: "/clients-on-dark/ipca.png" },
  { name: "Flipkart", logo: "/clients-on-dark/flipkart.png" },
  { name: "LM Windpower", logo: "/clients-on-dark/lm-wind-power.svg" },
  { name: "Exide", logo: "/clients-on-dark/exide.png" },
  { name: "KD Supply Chain", logo: "/clients-on-dark/kd-supply-chain.png" },
  { name: "Continental", logo: "/clients-on-dark/continental.png" },
  { name: "Nestlé", logo: "/clients-on-dark/nestle.png" },
  { name: "Supreme Petrochem", logo: "/clients-on-dark/supreme-petrochem.png" },
];
