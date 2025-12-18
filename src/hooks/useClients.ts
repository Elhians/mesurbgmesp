import { useState, useEffect, useCallback } from "react";
import { Client, Measurements } from "@/types/client";
import { supabase } from "@/lib/supabase";

interface DbClient {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  notes: string | null;
  epaule: number | null;
  masse: number | null;
  longueur_pantalon: number | null;
  longueur_chemise: number | null;
  cuisse: number | null;
  tour_de_bras: number | null;
  ceinture: number | null;
  poitrine: number | null;
  created_at: string;
  updated_at: string;
}

const mapDbToClient = (dbClient: DbClient): Client => ({
  id: dbClient.id,
  nom: dbClient.nom,
  prenom: dbClient.prenom,
  telephone: dbClient.telephone,
  notes: dbClient.notes || undefined,
  measurements: {
    epaule: dbClient.epaule,
    masse: dbClient.masse,
    longueurPantalon: dbClient.longueur_pantalon,
    longueurChemise: dbClient.longueur_chemise,
    cuisse: dbClient.cuisse,
    tourDeBras: dbClient.tour_de_bras,
    ceinture: dbClient.ceinture,
    poitrine: dbClient.poitrine,
  },
  createdAt: new Date(dbClient.created_at),
  updatedAt: new Date(dbClient.updated_at),
});

const mapClientToDb = (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => ({
  nom: client.nom,
  prenom: client.prenom,
  telephone: client.telephone,
  notes: client.notes || null,
  epaule: client.measurements.epaule,
  masse: client.measurements.masse,
  longueur_pantalon: client.measurements.longueurPantalon,
  longueur_chemise: client.measurements.longueurChemise,
  cuisse: client.measurements.cuisse,
  tour_de_bras: client.measurements.tourDeBras,
  ceinture: client.measurements.ceinture,
  poitrine: client.measurements.poitrine,
});

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setClients((data as DbClient[]).map(mapDbToClient));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = async (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      setError(null);
      const dbData = mapClientToDb(client);

      const { data, error: insertError } = await supabase
        .from("clients")
        .insert(dbData)
        .select()
        .single();

      if (insertError) throw insertError;

      const newClient = mapDbToClient(data as DbClient);
      setClients((prev) => [newClient, ...prev]);
      return newClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
      console.error("Error adding client:", err);
      throw err;
    }
  };

  const updateClient = async (
    id: string,
    updates: Partial<Omit<Client, "id" | "createdAt">>
  ) => {
    try {
      setError(null);

      const updateData: Record<string, unknown> = {};

      if (updates.nom !== undefined) updateData.nom = updates.nom;
      if (updates.prenom !== undefined) updateData.prenom = updates.prenom;
      if (updates.telephone !== undefined) updateData.telephone = updates.telephone;
      if (updates.notes !== undefined) updateData.notes = updates.notes || null;

      if (updates.measurements) {
        updateData.epaule = updates.measurements.epaule;
        updateData.masse = updates.measurements.masse;
        updateData.longueur_pantalon = updates.measurements.longueurPantalon;
        updateData.longueur_chemise = updates.measurements.longueurChemise;
        updateData.cuisse = updates.measurements.cuisse;
        updateData.tour_de_bras = updates.measurements.tourDeBras;
        updateData.ceinture = updates.measurements.ceinture;
        updateData.poitrine = updates.measurements.poitrine;
      }

      const { data, error: updateError } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedClient = mapDbToClient(data as DbClient);
      setClients((prev) =>
        prev.map((c) => (c.id === id ? updatedClient : c))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      console.error("Error updating client:", err);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      console.error("Error deleting client:", err);
      throw err;
    }
  };

  const getClient = (id: string) => {
    return clients.find((c) => c.id === id);
  };

  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    refetch: fetchClients,
  };
};
