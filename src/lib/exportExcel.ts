import * as XLSX from "xlsx";
import { Client, measurementLabels } from "@/types/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const exportClientsToExcel = (clients: Client[]) => {
  const data = clients.map((client) => ({
    "Prénom": client.prenom,
    "Nom": client.nom,
    "Téléphone": client.telephone,
    [measurementLabels.epaule + " (cm)"]: client.measurements.epaule ?? "",
    [measurementLabels.masse + " (cm)"]: client.measurements.masse ?? "",
    [measurementLabels.longueurPantalon + " (cm)"]: client.measurements.longueurPantalon ?? "",
    [measurementLabels.longueurChemise + " (cm)"]: client.measurements.longueurChemise ?? "",
    [measurementLabels.cuisse + " (cm)"]: client.measurements.cuisse ?? "",
    [measurementLabels.tourDeBras + " (cm)"]: client.measurements.tourDeBras ?? "",
    [measurementLabels.ceinture + " (cm)"]: client.measurements.ceinture ?? "",
    [measurementLabels.poitrine + " (cm)"]: client.measurements.poitrine ?? "",
    "Notes": client.notes ?? "",
    "Date de création": format(client.createdAt, "dd/MM/yyyy", { locale: fr }),
    "Dernière modification": format(client.updatedAt, "dd/MM/yyyy", { locale: fr }),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, 15),
  }));
  worksheet["!cols"] = colWidths;

  const fileName = `clients_ateliermesure_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
