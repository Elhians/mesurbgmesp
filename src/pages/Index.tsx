import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ClientCard from "@/components/ClientCard";
import ClientForm from "@/components/ClientForm";
import ClientDetail from "@/components/ClientDetail";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import { useClients } from "@/hooks/useClients";
import { Client } from "@/types/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { exportClientsToExcel } from "@/lib/exportExcel";

const Index = () => {
  const { clients, isLoading, error, addClient, updateClient, deleteClient, getClient } = useClients();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const selectedClient = selectedClientId ? getClient(selectedClientId) : null;

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.nom.toLowerCase().includes(query) ||
        client.prenom.toLowerCase().includes(query) ||
        client.telephone.includes(query)
    );
  }, [clients, searchQuery]);

  const handleAddClient = async (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      await addClient(clientData);
      setIsFormOpen(false);
      toast({
        title: "Client ajouté",
        description: `${clientData.prenom} ${clientData.nom} a été ajouté avec succès.`,
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le client.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClient = async (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    if (selectedClientId) {
      try {
        await updateClient(selectedClientId, clientData);
        setIsEditing(false);
        setIsDetailOpen(true);
        toast({
          title: "Client modifié",
          description: `${clientData.prenom} ${clientData.nom} a été modifié avec succès.`,
        });
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le client.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteClient = async () => {
    if (selectedClientId) {
      const client = getClient(selectedClientId);
      try {
        await deleteClient(selectedClientId);
        setIsDeleteDialogOpen(false);
        setIsDetailOpen(false);
        setSelectedClientId(null);
        
        toast({
          title: "Client supprimé",
          description: `${client?.prenom} ${client?.nom} a été supprimé.`,
        });
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le client.",
          variant: "destructive",
        });
      }
    }
  };

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsDetailOpen(true);
  };

  const handleEditClick = () => {
    setIsDetailOpen(false);
    setIsEditing(true);
  };

  const handleExport = () => {
    if (clients.length > 0) {
      exportClientsToExcel(clients);
      toast({
        title: "Export réussi",
        description: `${clients.length} client(s) exporté(s) vers Excel.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAddClient={() => setIsFormOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Chargement des clients...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAddClient={() => setIsFormOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-destructive">Erreur: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAddClient={() => setIsFormOpen(true)} 
        onExport={handleExport}
        canExport={clients.length > 0}
      />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {clients.length > 0 ? (
          <div className="space-y-4 sm:space-y-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              totalClients={filteredClients.length}
            />
            
            {filteredClients.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
              >
                {filteredClients.map((client, index) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    index={index}
                    onClick={() => handleClientClick(client.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 sm:py-20 text-center"
              >
                <p className="text-sm sm:text-base text-muted-foreground">
                  Aucun client trouvé pour "{searchQuery}"
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          <EmptyState onAddClient={() => setIsFormOpen(true)} />
        )}
      </main>

      {/* Add/Edit Form */}
      <ClientForm
        isOpen={isFormOpen || isEditing}
        onClose={() => {
          setIsFormOpen(false);
          setIsEditing(false);
        }}
        onSave={isEditing ? handleUpdateClient : handleAddClient}
        initialData={isEditing ? selectedClient || undefined : undefined}
      />

      {/* Client Detail */}
      <ClientDetail
        client={selectedClient}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedClientId(null);
        }}
        onEdit={handleEditClick}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Supprimer ce client ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les mesures et informations de{" "}
              <span className="font-semibold text-foreground">
                {selectedClient?.prenom} {selectedClient?.nom}
              </span>{" "}
              seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
