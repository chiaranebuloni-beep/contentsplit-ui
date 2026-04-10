'use client';

import { useState } from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';
import { useClients } from '@/contexts/client-context';

export function Sidebar({ onAddNew }: { onAddNew: () => void }) {
  const {
    filteredClients,
    selectedClient,
    selectClient,
    searchQuery,
    setSearchQuery,
  } = useClients();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-card-border bg-surface shadow-sm">
      {/* Logo */}
      <div className="border-b border-card-border px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo to-violet shadow-md shadow-indigo/25">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-text-primary">
              ContentSplit
            </div>
            <div className="text-[11px] text-text-muted">
              AI Content Repurposing
            </div>
          </div>
        </div>
      </div>

      {/* Search + Client list */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {/* Search bar */}
        <div className="relative mb-3 px-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Cerca cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-card-border bg-input-bg py-2 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/20"
          />
        </div>

        <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Clienti ({filteredClients.length})
        </div>

        {filteredClients.map((c) => {
          const isSelected = selectedClient?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => selectClient(c)}
              className={`mb-1 flex w-full items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-left transition-all ${
                isSelected
                  ? 'border-indigo/30 bg-indigo/5'
                  : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <div
                className="flex size-[34px] flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: c.customColor || '#6366f1' }}
              >
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-text-primary">
                  {c.name}
                </div>
                <div className="truncate text-[11px] text-text-muted">
                  {c.sector}
                </div>
              </div>
            </button>
          );
        })}

        {filteredClients.length === 0 && (
          <div className="px-2 py-8 text-center text-xs text-text-muted">
            {searchQuery
              ? 'Nessun cliente trovato'
              : 'Nessun cliente ancora'}
          </div>
        )}
      </div>

      {/* Add client button */}
      <div className="border-t border-card-border p-4">
        <button
          onClick={onAddNew}
          className="flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-gradient-to-r from-indigo to-violet py-2.5 text-[13px] font-semibold text-white shadow-md shadow-indigo/25 transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Nuovo cliente
        </button>
      </div>
    </aside>
  );
}
