'use client';

import { useState } from 'react';
import { Sparkles, Globe, BookOpen, Zap, Plus, AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { AddClientForm } from '@/components/add-client-form';
import { BrandUrlInput } from '@/components/brand-url-input';
import { BrandReview } from '@/components/brand-review';
import { ContentGenerator } from '@/components/content-generator';
import { ResultsPanel } from '@/components/results-panel';
import { ProtectedRoute } from '@/components/protected-route';
import { useClients } from '@/contexts/client-context';
import type { ClientProfile } from '@/lib/client-types';

function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: { id: number; label: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="mb-8 flex items-center justify-center gap-0">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <button
            onClick={() => onStepClick(s.id)}
            className="flex items-center gap-2"
          >
            <div
              className={`flex size-[30px] items-center justify-center rounded-full text-[13px] font-bold transition-all ${
                currentStep >= s.id
                  ? 'bg-gradient-to-br from-indigo to-violet text-white'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-[13px] ${
                currentStep === s.id
                  ? 'font-semibold text-text-primary'
                  : 'text-text-muted'
              }`}
            >
              {s.label}
            </span>
          </button>
          {i < steps.length - 1 && (
            <div
              className={`mx-3 h-0.5 w-10 rounded-full transition-colors ${
                currentStep > s.id ? 'bg-indigo' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ContentFlow({ client }: { client: ClientProfile }) {
  const hasWebsite = Boolean(client.website?.trim());
  const [step, setStep] = useState(hasWebsite ? 1 : 2);
  const [url, setUrl] = useState(client.website || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<{
    code: string;
    message: string;
  } | null>(null);
  const [brandData, setBrandData] = useState<any>(null);
  const [results, setResults] = useState<any>(null);

  const steps = hasWebsite
    ? [
        { id: 1, label: 'URL del brand' },
        { id: 2, label: 'Review brand' },
        { id: 3, label: 'Genera contenuti' },
      ]
    : [
        { id: 2, label: 'Profilo brand' },
        { id: 3, label: 'Genera contenuti' },
      ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalyzeError(null);
    try {
      // TODO: Call actual API to analyze brand from URL
      // const data = await analyzeBrand(url);
      // setBrandData(data);
      setTimeout(() => {
        setBrandData({
          name: client.name,
          sector: client.sector,
          tone: client.tone,
          target: client.target,
          description: client.description,
        });
        setIsAnalyzing(false);
        setStep(2);
      }, 1500);
    } catch (err: any) {
      setAnalyzeError({ code: 'ANALYZE_ERROR', message: err.message });
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[720px]">
      {/* Client header */}
      <div className="mb-7 text-center">
        <h2 className="text-xl font-bold text-text-primary">
          Genera contenuti per {client.name}
        </h2>
        <p className="mt-1 text-[13px] text-text-muted">
          {client.sector} â¢ {client.tone}
        </p>
        {!hasWebsite && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
            <AlertCircle className="size-3.5" />
            Nessun sito web â i post verranno generati dal profilo cliente
          </div>
        )}
      </div>

      {/* Steps */}
      <StepIndicator steps={steps} currentStep={step} onStepClick={setStep} />

      {/* Step 1: URL (only if client has website) */}
      {step === 1 && hasWebsite && (
        <BrandUrlInput
          url={url}
          onUrlChange={setUrl}
          onAnalyze={handleAnalyze}
          isLoading={isAnalyzing}
          error={analyzeError}
        />
      )}

      {/* Step 2: Brand Review / Profile */}
      {step === 2 && (
        <div className="rounded-2xl border border-card-border bg-surface p-7 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-pink-500/10">
              <BookOpen className="size-4 text-pink-500" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              {hasWebsite ? 'Brand Review' : 'Profilo Brand'}
            </h3>
            {!hasWebsite && (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                Da profilo cliente
              </span>
            )}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Nome', value: client.name || 'â' },
              { label: 'Settore', value: client.sector || 'â' },
              { label: 'Tono', value: client.tone || 'â' },
              { label: 'Target', value: client.target || 'â' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[10px] border border-card-border bg-input-bg p-3.5"
              >
                <div className="mb-1 text-[11px] font-semibold text-text-muted">
                  {item.label}
                </div>
                <div className="text-sm font-semibold text-text-primary">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {client.description && (
            <div className="mb-4 rounded-[10px] border border-card-border bg-input-bg p-3.5">
              <div className="mb-1 text-[11px] font-semibold text-text-muted">
                Descrizione
              </div>
              <div className="text-sm text-text-primary">
                {client.description}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {hasWebsite && (
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-card-border bg-surface py-3 text-sm font-semibold text-text-secondary hover:bg-slate-50"
              >
                â Indietro
              </button>
            )}
            <button
              onClick={() => setStep(3)}
              className="flex-[2] rounded-xl bg-gradient-to-r from-indigo to-violet py-3 text-sm font-bold text-white shadow-md shadow-indigo/25"
            >
              Continua â
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Content Generator */}
      {step === 3 && (
        <div>
          <ContentGenerator
            brandIdentity={{
              name: client.name,
              description: client.description,
              targetAudience: client.target,
              colors: [],
              fonts: [],
            }}
            onGenerate={(settings) => {
              // TODO: Call actual generation API
              console.log('Generate with settings:', settings);
            }}
            isGenerating={false}
          />
          <div className="mt-3 flex justify-start">
            <button
              onClick={() => setStep(2)}
              className="rounded-xl border border-card-border bg-surface px-6 py-2.5 text-sm font-semibold text-text-secondary hover:bg-slate-50"
            >
              â Indietro
            </button>
          </div>
        </div>
      )}

      {/* Results (if available) */}
      {results && (
        <div className="mt-6">
          <ResultsPanel results={results} />
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAddClient }: { onAddClient: () => void }) {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo to-violet shadow-lg shadow-indigo/25">
        <Sparkles className="size-7 text-white" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-text-primary">
        Benvenuto in ContentSplit
      </h2>
      <p className="mx-auto mb-6 max-w-sm text-sm text-text-secondary">
        Seleziona un cliente dalla sidebar per generare contenuti, oppure
        aggiungi un nuovo cliente.
      </p>
      <button
        onClick={onAddClient}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo to-violet px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo/30"
      >
        <Plus className="size-4" />
        Aggiungi il primo cliente
      </button>
    </div>
  );
}

function DashboardContent() {
  const { selectedClient, selectClient } = useClients();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNew = () => {
    setShowAddForm(true);
    selectClient(null);
  };

  const handleSelectClient = () => {
    setShowAddForm(false);
  };

  // When a client is selected from sidebar, hide add form
  const currentClient = selectedClient;
  if (currentClient && showAddForm) {
    setShowAddForm(false);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onAddNew={handleAddNew} />

      <main className="ml-[260px] min-h-screen flex-1">
        <Header
          showAddForm={showAddForm}
          selectedClientName={currentClient?.name || null}
          onAddClient={handleAddNew}
        />

        <div className="p-8">
          {showAddForm ? (
            <AddClientForm onCancel={() => setShowAddForm(false)} />
          ) : currentClient ? (
            <ContentFlow client={currentClient} />
          ) : (
            <EmptyState onAddClient={handleAddNew} />
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
