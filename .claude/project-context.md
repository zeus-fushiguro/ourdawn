# WARMLYST - Boutique Shopify Niche (Accessoires Hiver Cocooning)

## MISSION
Transformer le thème Dawn en expérience premium pour accessoires d'hiver avec focus sur le cocooning et le confort.

## CONTRAINTES TECHNIQUES
- Shopify Dawn theme (forké)
- Liquid + HTML/CSS/JS vanilla
- Développement local avec Shopify CLI
- Sprint de 3 jours
- Équipe de 3 personnes

## STANDARDS DE CODE
### Liquid
- Utiliser les sections avec `{% schema %}` pour la flexibilité
- Préférer les snippets pour la réutilisabilité
- Toujours inclure des settings dans le schema JSON
- Utiliser les blocks pour le contenu dynamique
- Nommer les fichiers en kebab-case : `hero-cocooning.liquid`

### CSS
- Mobile-first
- Utiliser les CSS variables Dawn existantes
- Classes BEM : `.section-name__element--modifier`
- Animations subtiles pour le côté premium
- Palette chaude : oranges, beiges, browns

### Performance
- Lazy loading images obligatoire
- Sprites SVG pour icônes
- CSS critique inline
- JS vanilla (pas de jQuery)

## SECTIONS PRIORITAIRES (Ordre de création)
1. Hero avec ambiance cocooning (CTA fort)
2. Collection grid avec filtres
3. Product showcase avec hover effects premium
4. FAQ accordéon
5. Testimonials carousel
6. Newsletter avec popup intention exit
7. Footer riche avec reassurance

## UX/UI GUIDELINES
- Typographie : Police serif pour titres (élégante), sans-serif pour body
- Espacement généreux (air, respiration)
- Micro-interactions au hover
- Badges de confiance (livraison, garantie, eco-friendly)
- Urgence subtile (stock limité) sans être agressif
- Imagerie : tons chauds, textures douces, ambiance hygge

## FICHIERS IMPORTANTS
- `config/settings_schema.json` : Configuration globale
- `sections/*.liquid` : Sections réutilisables
- `snippets/*.liquid` : Composants atomiques
- `assets/theme.css` : Styles principaux
- `layout/theme.liquid` : Structure HTML de base

## VALIDATION
Chaque section créée doit :
- Avoir un schema complet avec presets
- Être responsive (mobile, tablet, desktop)
- Inclure des settings de personnalisation
- Utiliser les standards d'accessibilité (a11y)
- Être testable dans l'éditeur de thème Shopify
