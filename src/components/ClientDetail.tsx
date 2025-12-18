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
            <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-lg sm:rounded-xl gradient-gold shadow-gold flex-shrink-0">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg sm:text-2xl font-semibold text-foreground truncate">
                      {client.prenom} {client.nom}
                    </h2>
                    <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{client.telephone}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-5 sm:space-y-8">
              {/* Dates */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Créé le {format(client.createdAt, "d MMM yyyy", { locale: fr })}
                </span>
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Modifié le {format(client.updatedAt, "d MMM yyyy", { locale: fr })}
                </span>
              </div>

              {/* Mesures */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Ruler className="h-4 w-4 sm:h-5 sm:w-5" />
                  <h3 className="font-display text-base sm:text-lg font-medium">Mesures</h3>
                </div>
                
                {filledMeasurements.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    {Object.entries(client.measurements).map(([key, value]) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-lg sm:rounded-xl border p-3 sm:p-4 text-center transition-colors ${
                          value !== null
                            ? "border-primary/30 bg-primary/5"
                            : "border-border bg-secondary/30"
                        }`}
                      >
                        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide line-clamp-1">
                          {measurementLabels[key as keyof Measurements]}
                        </p>
                        <p className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold text-foreground">
                          {value !== null ? (
                            <>
                              {value}
                              <span className="text-xs sm:text-sm font-body text-muted-foreground ml-0.5 sm:ml-1">
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
                  <div className="rounded-lg sm:rounded-xl border border-border bg-secondary/30 p-6 sm:p-8 text-center">
                    <Ruler className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
                    <p className="mt-3 sm:mt-4 text-sm text-muted-foreground">
                      Aucune mesure enregistrée
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                    <h3 className="font-display text-base sm:text-lg font-medium">Notes</h3>
                  </div>
                  <div className="rounded-lg sm:rounded-xl border border-border bg-secondary/30 p-3 sm:p-4">
                    <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap">{client.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground h-10 sm:h-11"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
                <Button variant="gold" onClick={onEdit} className="h-10 sm:h-11">
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
