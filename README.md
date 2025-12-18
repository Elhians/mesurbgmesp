# AtelierMesure - Gestion de Mesures Client

Une plateforme professionnelle de gestion de mesures clients pour tailleurs et couturiers. Enregistrez et visualisez facilement les mesures de vos clients.

## Fonctionnalités

- ✂️ **Gestion des clients** - Ajoutez, modifiez et supprimez des clients
- 📏 **Mesures complètes** - Enregistrez 8 types de mesures (épaule, masse, longueur pantalon, longueur chemise, cuisse, tour de bras, ceinture, poitrine)
- 🔍 **Recherche rapide** - Trouvez vos clients par nom, prénom ou téléphone
- 📝 **Notes personnalisées** - Ajoutez des détails supplémentaires pour chaque client
- ☁️ **Stockage cloud** - Données synchronisées avec Supabase

## Technologies utilisées

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (PostgreSQL)

## Installation

### Prérequis

- Node.js 18+ & npm - [installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Un compte [Supabase](https://supabase.com)

### Configuration

1. **Cloner le repository**

```sh
git clone <YOUR_GIT_URL>
cd my-measure-mate-main
```

2. **Installer les dépendances**

```sh
npm install
```

3. **Configurer Supabase**

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Créer la table dans Supabase**

Dans le SQL Editor de Supabase, exécutez le contenu du fichier `supabase-schema.sql` :

```sql
-- Drop existing tables with dependencies
DROP TABLE IF EXISTS measurements CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Create the clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  notes TEXT,
  epaule NUMERIC,
  masse NUMERIC,
  longueur_pantalon NUMERIC,
  longueur_chemise NUMERIC,
  cuisse NUMERIC,
  tour_de_bras NUMERIC,
  ceinture NUMERIC,
  poitrine NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_clients_nom ON clients(nom);
CREATE INDEX idx_clients_prenom ON clients(prenom);
CREATE INDEX idx_clients_telephone ON clients(telephone);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow all operations policy
CREATE POLICY "Allow all operations" ON clients
  FOR ALL USING (true) WITH CHECK (true);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

5. **Lancer le serveur de développement**

```sh
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |

## Structure des mesures

| Mesure | Description |
|--------|-------------|
| Épaule | Largeur des épaules |
| Masse | Tour de masse |
| Longueur Pantalon | Longueur du pantalon |
| Longueur Chemise | Longueur de la chemise |
| Cuisse | Tour de cuisse |
| Tour de Bras | Circonférence du bras |
| Ceinture | Tour de taille |
| Poitrine | Tour de poitrine |

## Licence

MIT
