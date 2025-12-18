import { motion } from "framer-motion";
import { Scissors, Plus, Download, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onAddClient: () => void;
  onExport?: () => void;
  canExport?: boolean;
}

const Header = ({ onAddClient, onExport, canExport = false }: HeaderProps) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl gradient-gold shadow-gold flex-shrink-0">
              <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-2xl font-semibold text-foreground truncate">
                Atelier<span className="text-gradient-gold">Mesure</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Gestion de mesures sur-mesure
              </p>
            </div>
          </div>
          
          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {canExport && onExport && (
              <Button variant="outline" size="lg" onClick={onExport}>
                <Download className="h-5 w-5" />
                Exporter Excel
              </Button>
            )}
            <Button variant="gold" size="lg" onClick={onAddClient}>
              <Plus className="h-5 w-5" />
              Nouveau Client
            </Button>
          </div>

          {/* Mobile buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <Button variant="gold" size="sm" onClick={onAddClient} className="px-3">
              <Plus className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Nouveau</span>
            </Button>
            {canExport && onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
