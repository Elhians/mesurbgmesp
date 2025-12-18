import { motion } from "framer-motion";
import { Scissors, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddClient: () => void;
}

const Header = ({ onAddClient }: HeaderProps) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-gold shadow-gold">
              <Scissors className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Atelier<span className="text-gradient-gold">Mesure</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestion de mesures sur-mesure
              </p>
            </div>
          </div>
          
          <Button variant="gold" size="lg" onClick={onAddClient}>
            <Plus className="h-5 w-5" />
            Nouveau Client
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
