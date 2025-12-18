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
      className="flex flex-col items-center justify-center py-12 sm:py-20 px-4"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-xl sm:rounded-2xl gradient-gold shadow-gold">
          <Scissors className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
        </div>
      </div>
      
      <h2 className="mt-6 sm:mt-8 font-display text-xl sm:text-2xl font-semibold text-foreground text-center">
        Aucun client pour le moment
      </h2>
      <p className="mt-2 max-w-sm sm:max-w-md text-center text-sm sm:text-base text-muted-foreground">
        Commencez par ajouter votre premier client et enregistrez ses mesures.
      </p>
      
      <Button variant="gold" size="lg" className="mt-6 sm:mt-8 h-11 sm:h-12" onClick={onAddClient}>
        <Plus className="h-5 w-5" />
        Ajouter votre premier client
      </Button>
    </motion.div>
  );
};

export default EmptyState;
