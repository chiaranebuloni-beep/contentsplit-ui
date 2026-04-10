# ContentSplit â Guida Integrazione Nuova UI

## Panoramica

Questa cartella contiene tutti i file necessari per integrare la nuova interfaccia utente nel progetto ContentSplit. I file vanno copiati nella cartella `web/src/` del repo.

## Design System

### Palette precedente â Nuova palette

| Elemento | Prima (warm) | Dopo (indigo/violet) |
|----------|-------------|---------------------|
| Background | `#FAF6F1` cream | `#f0f4ff â #faf5ff â #fff1f2` gradient |
| CTA | `#2C2419` brown | `#6366f1 â #a855f7` gradient indigo/violet |
| Text primary | `#2C2419` | `#1e293b` |
| Text secondary | `#8B7D6B` | `#64748b` |
| Card border | `#E8DFD3` | `#e2e8f0` |
| Input bg | `#F5F0E8` | `#f8fafc` |
| Tag bg | `#EDE7DD` | `#eef2ff` |
| Tag text | `#5C4F3C` | `#4338ca` |
| Accent | `#8B6914` gold | `#6366f1` indigo |

## File Nuovi (da aggiungere)

### `lib/client-types.ts`
Definizioni TypeScript per il profilo cliente, brand kit Canva, palette colori, opzioni font, modalitÃ  di generazione (Gemini/Canva) e dimensioni immagine.

### `contexts/client-context.tsx`
Context React per la gestione dei clienti. Fornisce:
- Lista clienti con persistenza in localStorage
- CRUD completo (add, update, delete)
- Ricerca e filtro
- Client selezionato

### `components/sidebar.tsx`
Sidebar fissa a sinistra (260px) con:
- Logo ContentSplit
- Barra di ricerca clienti
- Lista clienti con avatar colorato
- Bottone "Nuovo cliente"

### `components/add-client-form.tsx`
Form di creazione cliente in griglia 2Ã2:
1. **Informazioni base** â nome, settore, tono, target, descrizione, post/mese, campagne
2. **Logo & Visual Identity** â upload logo, palette colori (6 preset), colore custom HEX
3. **Font & Stile** â font, Canva Brand Kit (47 kit reali), stile Canva, brand guidelines
4. **Social & Contatti** â Instagram, Facebook, sito web, Google Drive

## File Aggiornati (da sostituire)

### `app/globals.css`
Nuova palette indigo/violet con tutti i design token aggiornati.

### `app/layout.tsx`
Aggiunto `ClientProvider` nel tree dei provider. Lang impostata su `it`.

### `components/header.tsx`
Header con top bar sticky, nome cliente selezionato, bottone "Aggiungi cliente" gradient.

### `components/brand-url-input.tsx`
Stesso componente, restilizzato con CTA gradient e input con focus indigo.

### `components/content-generator.tsx`
Aggiornato con:
- **Selettore modalitÃ  generazione**: Gemini 2.5 Pro (AI) vs Template Canva
- **Gemini mode**: dimensioni immagine, immagini per post, tutte le opzioni originali
- **Canva mode**: selezione tipo template (Post Feed, Story, Carosello, Reel Cover)
- Campo "Quanti contenuti" (numero)
- Campo "Informazioni aggiuntive" (textarea per brief/contesto)
- Bottone generazione dinamico che cambia in base alla modalitÃ 

## Come Integrare

### 1. Copia i file
Copia tutta la cartella `web/src/` sopra la cartella `web/src/` del repo:

```bash
cp -r web/src/* /path/to/contentsplit/web/src/
```

### 2. Aggiorna page.tsx
Il file `page.tsx` principale va aggiornato per usare il nuovo layout con sidebar. Vedi la preview HTML per la struttura:
- Sidebar a sinistra (sempre visibile)
- Area principale con margine sinistro di 260px
- Header sticky in alto
- Contenuto: form aggiungi cliente OPPURE flusso ContentSplit (URL â Review â Genera)

### 3. Dipendenze
Non servono nuove dipendenze npm. Tutto usa le librerie giÃ  presenti nel progetto:
- `lucide-react` per le icone
- `tailwindcss` v4 per lo stile
- React 19 per i componenti

### 4. Brand Kit Canva
I 47 brand kit sono hardcoded in `lib/client-types.ts`. Per renderli dinamici, implementare una chiamata API a Canva per recuperarli al login.

### 5. Generazione con Gemini
La modalitÃ  "Genera con AI (Gemini 2.5 Pro)" usa il backend esistente di ContentSplit. I parametri aggiuntivi (extraInfo, numPosts) vanno passati all'API di generazione.

### 6. Generazione con Template Canva
La modalitÃ  "Template Canva" richiede integrazione con le Canva Connect API per:
1. Recuperare i template del Brand Kit del cliente
2. Creare una copia del template
3. Aggiornare il testo generato dall'AI
4. Esportare il design finale

## Note Tecniche

- Tutti i componenti usano `"use client"` per React 19 client components
- Il ClientProvider persiste i dati in `localStorage` con chiave `contentsplit_clients`
- I colori custom usano CSS custom properties con `oklch()` per Tailwind CSS v4
- La sidebar ha `position: fixed` e `z-index: 50`
- Il main content ha `margin-left: 260px` per lasciare spazio alla sidebar
