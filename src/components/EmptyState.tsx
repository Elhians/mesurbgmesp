import { motion } from "framer-motion";
import { Scissors, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddClient: () => void;
}

const EmptyState = ({ onAddClient }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl gradient-gold shadow-gold">
          <Scissors className="h-12 w-12 text-primary-foreground" />
        </div>
      </div>
      
      <h2 className="mt-8 font-display text-2xl font-semibold text-foreground">
        Aucun client pour le moment
      </h2>
      <p className="mt-2 max-w-md text-center text-muted-foreground">
        Commencez par ajouter votre premier client et enregistrez ses mesures pour une expérience sur-mesure.
      </p>
      
      <Button variant="gold" size="lg" className="mt-8" onClick={onAddClient}>
        <Plus className="h-5 w-5" />
        Ajouter votre premier client
      </Button>
    </motion.div>
  );
};

export default EmptyState;
