'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Calendar, CheckCircle, XCircle, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

interface ProjectSidebarProps {
  projectId: string;
  refreshTrigger: number;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ projectId, refreshTrigger }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}/sessions`);
        const data = await res.json();
        if (data.success) {
          setSessions(data.data);
          // Auto-open the most recent session on first load
          if (data.data.length > 0) {
            setOpenId(data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [projectId, refreshTrigger]);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="w-64 border-r border-[var(--border-default)] bg-[var(--bg-primary)] p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Import History</h3>
        {[...Array(3)].map((_, i) => (
          <Card key={i} padding="md" className="h-16 animate-pulse bg-[var(--bg-secondary)]">
            <div />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-[var(--border-default)] bg-[var(--bg-primary)] flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-[var(--border-default)] sticky top-0 bg-[var(--bg-primary)] z-10">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Import History</h3>
        <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
        </p>
      </div>

      <div className="p-3 flex flex-col gap-2">
        {sessions.length === 0 ? (
          <div className="text-center py-10">
            <FileText size={22} className="mx-auto text-[var(--text-tertiary)] mb-2" />
            <p className="text-xs text-[var(--text-secondary)]">No previous imports</p>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">Upload a CSV to get started</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isOpen = openId === session._id;
            const successRate = session.successRate ?? 0;
            const date = new Date(session.createdAt);

            return (
              <div
                key={session._id}
                className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-200"
                style={{ boxShadow: isOpen ? '0 0 0 1.5px var(--color-primary)' : undefined }}
              >
                {/* Clickable header row */}
                <button
                  type="button"
                  onClick={() => toggle(session._id)}
                  className="w-full flex items-start justify-between gap-2 p-3 text-left hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate" title={session.sessionName}>
                      {session.sessionName}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                      <Calendar size={9} />
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <span className="mt-0.5 text-[var(--text-tertiary)] flex-shrink-0">
                    {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-[var(--border-default)] px-3 py-2.5 flex flex-col gap-2">
                    <div>
                      <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1">
                        <span className="flex items-center gap-1"><TrendingUp size={9} /> Success rate</span>
                        <span className="font-semibold text-[var(--text-primary)]">{successRate}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${successRate}%`,
                            backgroundColor: successRate >= 75 ? '#10b981' : successRate >= 40 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    </div>


                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="rounded-md bg-[var(--bg-primary)] p-1.5 text-center">
                        <p className="text-[10px] text-[var(--text-tertiary)]">Total</p>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{session.totalRecords}</p>
                      </div>
                      <div className="rounded-md bg-emerald-500/10 p-1.5 text-center">
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                          <CheckCircle size={8} /> OK
                        </p>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{session.importedCount}</p>
                      </div>
                      <div className="rounded-md bg-red-500/10 p-1.5 text-center">
                        <p className="text-[10px] text-red-500 flex items-center justify-center gap-0.5">
                          <XCircle size={8} /> Skip
                        </p>
                        <p className="text-xs font-bold text-red-500">{session.skippedCount}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
