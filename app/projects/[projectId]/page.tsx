'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { PageShell } from '@/components/layout/page-shell';
import { PageTitle } from '@/components/layout/page-title';
import { Section } from '@/components/layout/section';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/states';
import { FileUpload } from '@/components/features/file-upload';
import { CsvPreview } from '@/components/features/csv-preview';
import { ProcessingState } from '@/components/features/processing-state';
import { ImportResults } from '@/components/features/import-results';
import { useImportFlow } from '@/hooks/use-import-flow';
import { parseCSV } from '@/lib/csv/parser';
import { apiClient } from '@/lib/api/client';
import { FileSpreadsheet, ArrowRight, Shield, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProjectSidebar } from '@/components/layout/project-sidebar';

export default function ProjectImportPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [projectName, setProjectName] = useState('Loading Project...');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    state,
    onCsvParsed,
    startImport,
    onImportSuccess,
    onImportFailure,
    reset,
  } = useImportFlow();

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProjectName(data.data.project_name);
          } else {
            router.push('/');
          }
        })
        .catch(() => router.push('/'));
    }
  }, [projectId, router]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        const parsed = await parseCSV(file);
        if (parsed.data.length === 0) {
          return;
        }
        onCsvParsed(parsed);
      } catch {
        onImportFailure('Failed to parse the CSV file. Please check the format and try again.');
      }
    },
    [onCsvParsed, onImportFailure]
  );

  const handleConfirmImport = useCallback(async () => {
    if (!state.csvData) return;
    startImport();

    try {
      const result = await apiClient.importRecords(projectId, state.csvData.data);
      onImportSuccess(result);
      setRefreshTrigger(prev => prev + 1);

      // Lightweight API call to increment project stats
      fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_imports: 1,
          total_records: result.stats.totalRecords,
          imported_records: result.stats.importedCount,
          skipped_records: result.stats.skippedCount,
        })
      }).catch(err => console.error('Failed to update project stats', err));
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Import failed. Please check your API key and try again.';
      onImportFailure(errorMessage);
    }
  }, [state.csvData, startImport, onImportSuccess, onImportFailure, projectId]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar projectId={projectId} refreshTrigger={refreshTrigger} />
        
        <div className="flex-1 overflow-y-auto">
          <PageShell>
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowLeft size={14} />
                Back to Projects
              </Link>
            </div>

            <PageTitle
              title={projectName}
              description="Upload a CSV file and let AI map your data into this project."
            />

            {state.step === 'upload' && (
              <>
                <Section>
                  <Card padding="lg">
                    <div className="mb-5">
                      <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                        Upload CSV
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Drag your file below or click to browse. We accept .csv files up to 10MB.
                      </p>
                    </div>
                    <FileUpload onFileSelect={handleFileSelect} />
                  </Card>
                </Section>

                <Section>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    How it works
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        icon: <FileSpreadsheet size={18} strokeWidth={1.5} />,
                        title: 'Upload',
                        description: "Drop any CSV file — headers, formats, and languages don't matter.",
                      },
                      {
                        icon: <Zap size={18} strokeWidth={1.5} />,
                        title: 'AI Extraction',
                        description: 'Our engine reads every row, infers fields, and normalizes the data.',
                      },
                      {
                        icon: <Shield size={18} strokeWidth={1.5} />,
                        title: 'Validated Import',
                        description: 'Review clean records, fix issues, and import into your CRM.',
                      },
                    ].map((step, i) => (
                      <Card key={i} padding="md" className="flex flex-col gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--gray-100)] text-[var(--text-secondary)]">
                          {step.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-medium text-[var(--text-primary)]">
                              {step.title}
                            </h3>
                            {i < 2 && (
                              <ArrowRight size={12} className="text-[var(--text-tertiary)] hidden sm:block" />
                            )}
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Section>

                <Section>
                  <Card padding="none">
                    <EmptyState
                      title="No import results yet"
                      description="Upload a CSV file above to get started. Your import results will appear here."
                    />
                  </Card>
                </Section>
              </>
            )}

            {state.step === 'preview' && state.csvData && (
              <Section>
                <CsvPreview
                  csvData={state.csvData}
                  onConfirmImport={handleConfirmImport}
                  isLoading={state.isLoading}
                  error={state.error}
                  onReset={reset}
                />
              </Section>
            )}

            {state.step === 'processing' && (
              <Section>
                <ProcessingState />
              </Section>
            )}

            {state.step === 'results' && state.result && (
              <Section>
                <ImportResults result={state.result} onReset={reset} />
              </Section>
            )}
          </PageShell>
        </div>
      </div>
    </div>
  );
}
