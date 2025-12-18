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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-elevated"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4">
              <div>
                <h2 className="font-display text-lg sm:text-2xl font-semibold text-foreground">
                  {initialData ? "Modifier le Client" : "Nouveau Client"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {initialData ? "Modifiez les informations" : "Ajoutez un nouveau client"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10">
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Informations personnelles */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  <h3 className="font-display text-base sm:text-lg font-medium">Informations Personnelles</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-foreground">
                      Prénom <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Prénom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-foreground">
                      Nom <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    Téléphone <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="+221 77 123 45 67"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    type="tel"
                  />
                </div>
              </div>

              {/* Mesures */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Ruler className="h-4 w-4 sm:h-5 sm:w-5" />
                  <h3 className="font-display text-base sm:text-lg font-medium">Mesures</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  {Object.entries(measurementLabels).map(([key, label]) => (
                    <div key={key} className="space-y-1 sm:space-y-2">
                      <label className="text-[10px] sm:text-sm font-medium text-foreground line-clamp-1">
                        {label}
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={formData.measurements[key as keyof Measurements] ?? ""}
                          onChange={(e) => handleMeasurementChange(key as keyof Measurements, e.target.value)}
                          className="pr-8 sm:pr-10 h-9 sm:h-11 text-sm sm:text-base"
                        />
                        <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-sm text-muted-foreground">
                          {measurementUnits[key as keyof Measurements]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  <h3 className="font-display text-base sm:text-lg font-medium">Notes</h3>
                </div>
                <Textarea
                  placeholder="Détails supplémentaires..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="text-sm sm:text-base resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={onClose} className="h-10 sm:h-11">
                  Annuler
                </Button>
                <Button type="submit" variant="gold" className="h-10 sm:h-11">
                  <Save className="h-4 w-4" />
                  {initialData ? "Enregistrer" : "Ajouter"}
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
