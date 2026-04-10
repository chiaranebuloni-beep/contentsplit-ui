'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ClientProfile } from '@/lib/client-types';

interface ClientContextType {
  clients: ClientProfile[];
  selectedClient: ClientProfile | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectClient: (client: ClientProfile | null) => void;
  addClient: (client: ClientProfile) => void;
  updateClient: (id: string, updates: Partial<ClientProfile>) => void;
  deleteClient: (id: string) => void;
  filteredClients: ClientProfile[];
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

const STORAGE_KEY = 'contentsplit_clients';

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch {}
  }, [clients]);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectClient = (client: ClientProfile | null) => {
    setSelectedClient(client);
  };

  const addClient = (client: ClientProfile) => {
    setClients((prev) => [...prev, client]);
    setSelectedClient(client);
  };

  const updateClient = (id: string, updates: Partial<ClientProfile>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (selectedClient?.id === id) setSelectedClient(null);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        selectedClient,
        searchQuery,
        setSearchQuery,
        selectClient,
        addClient,
        updateClient,
        deleteClient,
        filteredClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClients must be used within ClientProvider');
  return ctx;
}
