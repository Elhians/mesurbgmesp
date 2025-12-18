import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Calendar, Ruler, FileText, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client, measurementLabels, measurementUnits, Measurements } from "@/types/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientDetailProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientDetail = ({ client, isOpen, onClose, onEdit, onDelete }: ClientDetailProps) => {
  if (!client) return null;

  const filledMeasurements = Object.entries(client.measurements).filter(
    ([_, value]) => value !== null && value !== undefined
  );

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
            <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl gradient-gold shadow-gold">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-foreground">
                      {client.prenom} {client.nom}
                    </h2>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {client.telephone}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Dates */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Créé le {format(client.createdAt, "d MMMM yyyy", { locale: fr })}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Modifié le {format(client.updatedAt, "d MMMM yyyy", { locale: fr })}
                </span>
              </div>

              {/* Mesures */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Ruler className="h-5 w-5" />
                  <h3 className="font-display text-lg font-medium">Mesures</h3>
                </div>
                
                {filledMeasurements.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(client.measurements).map(([key, value]) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-xl border p-4 text-center transition-colors ${
                          value !== null
                            ? "border-primary/30 bg-primary/5"
                            : "border-border bg-secondary/30"
                        }`}
                      >
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {measurementLabels[key as keyof Measurements]}
                        </p>
                        <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                          {value !== null ? (
                            <>
                              {value}
                              <span className="text-sm font-body text-muted-foreground ml-1">
                                {measurementUnits[key as keyof Measurements]}
                              </span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-secondary/30 p-8 text-center">
                    <Ruler className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      Aucune mesure enregistrée
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <FileText className="h-5 w-5" />
                    <h3 className="font-display text-lg font-medium">Notes</h3>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="text-foreground whitespace-pre-wrap">{client.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
                <Button variant="gold" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientDetail;
