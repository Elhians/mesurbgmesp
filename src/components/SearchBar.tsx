import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalClients: number;
}

const SearchBar = ({ value, onChange, totalClients }: SearchBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
    >
      <div className="relative flex-1 max-w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher un client..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
        />
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-2 rounded-lg self-start sm:self-auto">
        <Users className="h-4 w-4" />
        <span className="font-medium">{totalClients}</span>
        <span className="hidden xs:inline">client{totalClients !== 1 ? "s" : ""}</span>
      </div>
    </motion.div>
  );
};

export default SearchBar;
