export interface ClientProfile {
  id: string;
  name: string;
  sector: string;
  tone: string;
  target: string;
  description: string;
  postsPerMonth: number;
  campaigns: string;
  logoUrl: string;
  colorPalette: string | null;
  customColor: string;
  font: string;
  canvaBrandKitId: string;
  canvaBrandKitName: string;
  canvaStyle: string;
  instagram: string;
  facebook: string;
  website: string;
  driveFolder: string;
  createdAt: string;
}

export interface CanvaBrandKit {
  id: string;
  name: string;
}

export const CANVA_BRAND_KITS: CanvaBrandKit[] = [
  { id: 'kAEvPRUSyOo', name: 'Regaly' },
  { id: 'kAEvPeMyjzQ', name: 'Prosign' },
  { id: 'kAEvPfDt-oM', name: 'Prenota Tampone' },
  { id: 'kAEvPwb1A2Q', name: 'BizBull' },
  { id: 'kAEyirbTRPQ', name: 'Beauty Store' },
  { id: 'kAE1uDoucog', name: 'Fidilink' },
  { id: 'kAE1_rJr2zs', name: 'Medical Center Velasca' },
  { id: 'kAE3Ze2-w04', name: 'Studio Resta' },
  { id: 'kAE3w_DK3co', name: 'Emmy Boo' },
  { id: 'kAE39tVR4mU', name: 'DOTT. DEBITO' },
  { id: 'kAE3-GKITD4', name: 'Mancini Market' },
  { id: 'kAE5E2HQJnE', name: 'Greater Gloater' },
  { id: 'kAE5Qq7OpOQ', name: 'Soft Sushi' },
  { id: 'kAE5Qh86m6U', name: 'Merceria creativa' },
  { id: 'kAE50WqdZyw', name: 'FIDUERRE' },
  { id: 'kAE6AT1tJI0', name: 'LodBar' },
  { id: 'kAE6f70zLYg', name: 'Mi Delizio' },
  { id: 'kAE93S1cvBA', name: 'Stefania Lusi' },
  { id: 'kAE_iqmT_kE', name: 'Cerasella' },
  { id: 'kAFBFasjCLw', name: 'clm' },
  { id: 'kAFBhvzL0h0', name: 'System' },
  { id: 'kAFBzkg5oLU', name: 'Adele Immobiliare' },
  { id: 'kAFB4J7sIKo', name: 'Lanterna' },
  { id: 'kAFCXMM-fRc', name: 'Fatty Patty' },
  { id: 'kAFDkBVfB-c', name: 'BLOCKERAS' },
  { id: 'kAFET8pBBYA', name: 'FOODI SHOP' },
  { id: 'kAFFcY8utSo', name: 'B&P' },
  { id: 'kAFFvqFrmLM', name: 'ITKonsulting' },
  { id: 'kAFLdByr_Ao', name: 'Io For The Nature' },
  { id: 'kAFRfgo8oXo', name: 'Lybra Tech' },
  { id: 'kAFV4dZ8pBE', name: 'IBF' },
  { id: 'kAFYyF4VAT8', name: 'VV LAB' },
  { id: 'kAFai9dUpcU', name: 'La Panetteria' },
  { id: 'kAFdEF6BbXM', name: 'Universo Docente' },
  { id: 'kAFdV-G7B4c', name: 'Beauty Well' },
  { id: 'kAFdXcEo5eA', name: 'Creditime' },
  { id: 'kAFhNh4CUsw', name: 'Maida del zotto' },
  { id: 'kAFw3EgOAHY', name: 'Meraviglia' },
  { id: 'kAF1pyKtW4s', name: 'Vetroscena' },
  { id: 'kAHFyGdZDyM', name: 'Fairfit' },
  { id: 'kAHFzEaaM0A', name: 'Estetica Mente' },
  { id: 'kAHGKIdhgcM', name: 'Oleificio Tiber' },
  { id: 'kAHGKaOM-ok', name: 'Fit Balance' },
  { id: 'kAHGLWqFDNo', name: 'Aqua Dry' },
  { id: 'kAHGLvm92vQ', name: 'Nutryon.ai' },
];

export const COLOR_PALETTES = [
  { name: 'Ocean', colors: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8'] },
  { name: 'Sunset', colors: ['#F94144', '#F3722C', '#F9C74F', '#90BE6D'] },
  { name: 'Forest', colors: ['#2D6A4F', '#40916C', '#52B788', '#95D5B2'] },
  { name: 'Berry', colors: ['#7B2CBF', '#9D4EDD', '#C77DFF', '#E0AAFF'] },
  { name: 'Minimal', colors: ['#212529', '#495057', '#ADB5BD', '#F8F9FA'] },
  { name: 'Coral', colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCB77'] },
];

export const FONT_OPTIONS = [
  'Inter', 'Poppins', 'Montserrat', 'Playfair Display',
  'Roboto', 'Lato', 'Open Sans', 'Raleway'
];

export type GenerationMode = 'gemini' | 'canva';

export type ImageSize =
  | 'auto'
  | '1080x1080'
  | '1080x1350'
  | '1080x1920'
  | '1200x675'
  | '1200x630';

export const IMAGE_SIZE_OPTIONS: { value: ImageSize; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: '1080x1080', label: '1080Ã1080 Square' },
  { value: '1080x1350', label: '1080Ã1350 Portrait' },
  { value: '1080x1920', label: '1080Ã1920 Story' },
  { value: '1200x675', label: '1200Ã675 Twitter' },
  { value: '1200x630', label: '1200Ã630 OG' },
];
