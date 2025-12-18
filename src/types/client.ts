export interface Measurements {
  epaule: number | null;
  masse: number | null;
  longueurPantalon: number | null;
  longueurChemise: number | null;
  cuisse: number | null;
  tourDeBras: number | null;
  ceinture: number | null;
  poitrine: number | null;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  measurements: Measurements;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const measurementLabels: Record<keyof Measurements, string> = {
  epaule: "Épaule",
  masse: "Masse",
  longueurPantalon: "Longueur Pantalon",
  longueurChemise: "Longueur Chemise",
  cuisse: "Cuisse",
  tourDeBras: "Tour de Bras",
  ceinture: "Ceinture",
  poitrine: "Poitrine",
};

export const measurementUnits: Record<keyof Measurements, string> = {
  epaule: "cm",
  masse: "cm",
  longueurPantalon: "cm",
  longueurChemise: "cm",
  cuisse: "cm",
  tourDeBras: "cm",
  ceinture: "cm",
  poitrine: "cm",
};
