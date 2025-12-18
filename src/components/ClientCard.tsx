import { motion } from "framer-motion";
import { User, Phone, Calendar, ChevronRight } from "lucide-react";
import { Client, measurementLabels, measurementUnits, Measurements } from "@/types/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientCardProps {
  client: Client;
  onClick: () => void;
  index: number;
}

const ClientCard = ({ client, onClick, index }: ClientCardProps) => {
  const filledMeasurements = Object.entries(client.measurements).filter(
    ([_, value]) => value !== null && value !== undefined
  ).length;
  const totalMeasurements = Object.keys(client.measurements).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-border/50 bg-card p-6 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-elevated"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-primary transition-all duration-300 group-hover:gradient-gold group-hover:text-primary-foreground">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              {client.prenom} {client.nom}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{client.telephone}</span>
            </div>
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      
      <div className="mt-5 flex flex-wrap gap-2">
        {Object.entries(client.measurements)
          .filter(([_, value]) => value !== null)
          .slice(0, 4)
          .map(([key, value]) => (
            <span
              key={key}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              {measurementLabels[key as keyof Measurements]}: {value}
              {measurementUnits[key as keyof Measurements]}
            </span>
          ))}
        {filledMeasurements > 4 && (
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            +{filledMeasurements - 4} mesures
          </span>
        )}
      </div>
      
      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Modifié le {format(client.updatedAt, "d MMM yyyy", { locale: fr })}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {filledMeasurements}/{totalMeasurements} mesures
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientCard;
