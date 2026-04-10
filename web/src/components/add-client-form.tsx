'use client';

import { useState } from 'react';
import { User, Image, Type, Share2, Upload, X } from 'lucide-react';
import { useClients } from '@/contexts/client-context';
import {
  CANVA_BRAND_KITS,
  COLOR_PALETTES,
  FONT_OPTIONS,
  type ClientProfile,
} from '@/lib/client-types';

export function AddClientForm({ onCancel }: { onCancel: () => void }) {
  const { addClient } = useClients();
  const [form, setForm] = useState({
    name: '',
    sector: '',
    tone: '',
    target: '',
    description: '',
    postsPerMonth: 4,
    campaigns: '',
    logoUrl: '',
    colorPalette: null as string | null,
    customColor: '#6366f1',
    font: 'Inter',
    canvaBrandKitId: '',
    canvaBrandKitName: '',
    canvaStyle: '',
    instagram: '',
    facebook: '',
    website: '',
    driveFolder: '',
  });

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return alert('Inserisci il nome del cliente');
    const client: ClientProfile = {
      id: crypto.randomUUID(),
      name: form.name,
      sector: form.sector,
      tone: form.tone,
      target: form.target,
      description: form.description,
      postsPerMonth: form.postsPerMonth,
      campaigns: form.campaigns,
      logoUrl: form.logoUrl,
      colorPalette: form.colorPalette,
      customColor: form.customColor,
      font: form.font,
      canvaBrandKitId: form.canvaBrandKitId,
      canvaBrandKitName: form.canvaBrandKitName,
      canvaStyle: form.canvaStyle,
      instagram: form.instagram,
      facebook: form.facebook,
      website: form.website,
      driveFolder: form.driveFolder,
      createdAt: new Date().toISOString(),
    };
    addClient(client);
    onCancel();
  };

  const handleBrandKitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const kit = CANVA_BRAND_KITS.find((b) => b.id === e.target.value);
    set('canvaBrandKitId', kit?.id || '');
    set('canvaBrandKitName', kit?.name || '');
  };

  const inputCls =
    'w-full rounded-[10px] border border-card-border bg-input-bg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/20';

  const labelCls = 'mb-1.5 block text-xs font-semibold text-text-secondary';

  return (
    <div className="mx-auto max-w-[960px]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-text-primary">
            Aggiungi nuovo cliente
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Compila le informazioni per creare un nuovo profilo cliente
          </p>
        </div>
        <button
          onClick={onCancel}
          className="rounded-lg border border-card-border bg-surface px-4 py-2 text-[13px] font-medium text-text-secondary hover:bg-slate-50"
        >
          <X className="inline size-3.5 mr-1" />
          Annulla
        </button>
      </div>

      {/* 2x2 Grid */}
      <div className="mb-6 grid grid-cols-2 gap-5">
        {/* Section 1: Informazioni base */}
        <div className="rounded-2xl border border-card-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo/10">
              <User className="size-4 text-indigo" />
            </div>
            <h3 className="text-[15px] font-bold text-text-primary">
              Informazioni base
            </h3>
          </div>
          <div className="space-y-3.5">
            <div>
              <label className={labelCls}>Nome cliente *</label>
              <input className={inputCls} placeholder="Es. Regaly" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Settore</label>
              <input className={inputCls} placeholder="Es. Luxury / Gioielli" value={form.sector} onChange={(e) => set('sector', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Tono di voce</label>
              <select className={inputCls} value={form.tone} onChange={(e) => set('tone', e.target.value)}>
                <option value="">Seleziona...</option>
                <option>Professionale</option>
                <option>Elegante</option>
                <option>Dinamico</option>
                <option>Amichevole</option>
                <option>Istituzionale</option>
                <option>Creativo</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Target</label>
              <input className={inputCls} placeholder="Es. Donne 25-45, alto potere d'acquisto" value={form.target} onChange={(e) => set('target', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Descrizione</label>
              <textarea className={`${inputCls} min-h-[70px] resize-y`} placeholder="Breve descrizione del brand..." value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>N. post / mese</label>
                <input type="number" className={inputCls} value={form.postsPerMonth} onChange={(e) => set('postsPerMonth', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelCls}>Campagne attive</label>
                <input className={inputCls} placeholder="Es. Spring 2026" value={form.campaigns} onChange={(e) => set('campaigns', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Logo & Visual Identity */}
        <div className="rounded-2xl border border-card-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-pink-500/10">
              <Image className="size-4 text-pink-500" />
            </div>
            <h3 className="text-[15px] font-bold text-text-primary">
              Logo & Visual Identity
            </h3>
          </div>
          <div className="space-y-3.5">
            <div>
              <label className={labelCls}>Logo (URL o upload)</label>
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-card-border bg-input-bg p-6 text-center transition-colors hover:border-indigo/30">
                <Upload className="mx-auto mb-2 size-8 text-text-muted" />
                <div className="text-[13px] text-text-secondary">Trascina un file o clicca per caricare</div>
                <div className="mt-1 text-[11px] text-text-muted">PNG, JPG, SVG â max 5MB</div>
              </div>
            </div>
            <div>
              <label className={labelCls}>Palette colori</label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PALETTES.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => set('colorPalette', p.name)}
                    className={`rounded-[10px] p-2.5 text-center transition-all ${
                      form.colorPalette === p.name
                        ? 'border-2 border-indigo bg-indigo/5'
                        : 'border border-card-border bg-surface'
                    }`}
                  >
                    <div className="mb-1.5 flex justify-center gap-1">
                      {p.colors.map((c, i) => (
                        <div key={i} className="size-[18px] rounded" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="text-[11px] font-medium text-text-secondary">{p.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Colore personalizzato (HEX)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.customColor}
                  onChange={(e) => set('customColor', e.target.value)}
                  className="size-10 cursor-pointer rounded-lg border border-card-border p-0.5"
                />
                <input className={`${inputCls} flex-1`} value={form.customColor} onChange={(e) => set('customColor', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Font & Stile */}
        <div className="rounded-2xl border border-card-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Type className="size-4 text-amber-500" />
            </div>
            <h3 className="text-[15px] font-bold text-text-primary">
              Font & Stile
            </h3>
          </div>
          <div className="space-y-3.5">
            <div>
              <label className={labelCls}>Font principale</label>
              <select className={inputCls} value={form.font} onChange={(e) => set('font', e.target.value)}>
                {FONT_OPTIONS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Canva Brand Kit</label>
              <select className={inputCls} value={form.canvaBrandKitId} onChange={handleBrandKitChange}>
                <option value="">Seleziona brand kit...</option>
                {CANVA_BRAND_KITS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Stile Canva</label>
              <input className={inputCls} placeholder="Es. Moderno, Minimalista" value={form.canvaStyle} onChange={(e) => set('canvaStyle', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>File brand guidelines</label>
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-card-border bg-input-bg p-5 text-center">
                <Upload className="mx-auto mb-1.5 size-6 text-text-muted" />
                <div className="text-xs text-text-secondary">Carica PDF o documento</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Social & Contatti */}
        <div className="rounded-2xl border border-card-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10">
              <Share2 className="size-4 text-green-500" />
            </div>
            <h3 className="text-[15px] font-bold text-text-primary">
              Social & Contatti
            </h3>
          </div>
          <div className="space-y-3.5">
            <div>
              <label className={labelCls}>Instagram</label>
              <input className={inputCls} placeholder="@handle" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Facebook</label>
              <input className={inputCls} placeholder="URL pagina Facebook" value={form.facebook} onChange={(e) => set('facebook', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Sito web</label>
              <input className={inputCls} placeholder="https://..." value={form.website} onChange={(e) => set('website', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Cartella Google Drive</label>
              <input className={inputCls} placeholder="Link alla cartella Drive" value={form.driveFolder} onChange={(e) => set('driveFolder', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Save buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-xl border border-card-border bg-surface px-7 py-3 text-sm font-semibold text-text-secondary hover:bg-slate-50"
        >
          Annulla
        </button>
        <button
          onClick={handleSave}
          className="rounded-xl bg-gradient-to-r from-indigo to-violet px-9 py-3 text-sm font-bold text-white shadow-lg shadow-indigo/25 transition-opacity hover:opacity-90"
        >
          Salva cliente
        </button>
      </div>
    </div>
  );
}
