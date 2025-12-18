import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Ruler, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Client, Measurements, measurementLabels, measurementUnits } from "@/types/client";
import { useToast } from "@/hooks/use-toast";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: Client;
}

const emptyMeasurements: Measurements = {
  epaule: null,
  masse: null,
  longueurPantalon: null,
  longueurChemise: null,
  cuisse: null,
  tourDeBras: null,
  ceinture: null,
  poitrine: null,
};

const ClientForm = ({ isOpen, onClose, onSave, initialData }: ClientFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: initialData?.nom || "",
    prenom: initialData?.prenom || "",
    telephone: initialData?.telephone || "",
    notes: initialData?.notes || "",
    measurements: initialData?.measurements || { ...emptyMeasurements },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.telephone.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom, prénom et téléphone.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      telephone: formData.telephone.trim(),
      notes: formData.notes.trim() || undefined,
      measurements: formData.measurements,
    });
  };

  const handleMeasurementChange = (key: keyof Measurements, value: string) => {
    setFormData((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: value === "" ? null : parseFloat(value),
      },
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-elevated"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-6 py-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {initialData ? "Modifier le Client" : "Nouveau Client"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {initialData ? "Modifiez les informations du client" : "Ajoutez un nouveau client et ses mesures"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <User className="h-5 w-5" />
                  <h3 className="font-display text-lg font-medium">Informations Personnelles</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Prénom <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Prénom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nom <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Téléphone <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="+33 6 12 34 56 78"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>
              </div>

              {/* Mesures */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Ruler className="h-5 w-5" />
                  <h3 className="font-display text-lg font-medium">Mesures</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(measurementLabels).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {label}
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={formData.measurements[key as keyof Measurements] ?? ""}
                          onChange={(e) => handleMeasurementChange(key as keyof Measurements, e.target.value)}
                          className="pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {measurementUnits[key as keyof Measurements]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-display text-lg font-medium">Notes Supplémentaires</h3>
                </div>
                <Textarea
                  placeholder="Ajoutez des détails supplémentaires sur le client ou ses préférences..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" variant="gold">
                  <Save className="h-4 w-4" />
                  {initialData ? "Enregistrer" : "Ajouter le Client"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientForm;
