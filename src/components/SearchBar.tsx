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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un client..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-11"
        />
      </div>
      
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="text-sm">
          {totalClients} client{totalClients !== 1 ? "s" : ""}
        </span>
      </div>
    </motion.div>
  );
};

export default SearchBar;
