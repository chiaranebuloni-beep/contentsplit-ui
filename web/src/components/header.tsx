"use client";

import { Sparkles, Plus } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";

interface HeaderProps {
  showAddForm: boolean;
  selectedClientName: string | null;
  onAddClient: () => void;
}

export function Header({ showAddForm, selectedClientName, onAddClient }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-card-border bg-white/70 px-8 py-3.5 backdrop-blur-xl">
      <div className="text-sm text-text-secondary">
        {showAddForm
          ? 'Nuovo cliente'
          : selectedClientName
          ? selectedClientName
          : 'Seleziona un cliente dalla sidebar'}
      </div>
      {!showAddForm && (
        <button
          onClick={onAddClient}
          className="flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-indigo to-violet px-5 py-2 text-[13px] font-semibold text-white shadow-md shadow-indigo/20 transition-opacity hover:opacity-90"
        >
          <Plus className="size-3.5" />
          Aggiungi cliente
        </button>
      )}
    </header>
  );
}
