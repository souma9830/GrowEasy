'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Calendar, CheckCircle } from 'lucide-react';

interface ProjectSidebarProps {
  projectId: string;
  refreshTrigger: number;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ projectId, refreshTrigger }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/sessions`);
        const data = await res.json();
        if (data.success) {
          setSessions(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [projectId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="w-64 border-r border-[var(--border-default)] bg-[var(--bg-primary)] p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Import History</h3>
        {[...Array(3)].map((_, i) => (
          <Card key={i} padding="md" className="h-20 animate-pulse bg-[var(--bg-secondary)]">
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
        <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Previous files</p>
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={24} className="mx-auto text-[var(--text-tertiary)] mb-2" />
            <p className="text-xs text-[var(--text-secondary)]">No previous imports</p>
          </div>
        ) : (
          sessions.map((session) => (
            <Card key={session._id} padding="md" className="hover:border-[var(--text-tertiary)] transition-colors">
              <h4 className="text-xs font-medium text-[var(--text-primary)] truncate mb-2" title={session.sessionName}>
                {session.sessionName}
              </h4>
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] mb-1">
                <Calendar size={10} />
                {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <FileText size={10} /> {session.totalRecords}
                </span>
                <span className="flex items-center gap-1 text-emerald-500 font-medium">
                  <CheckCircle size={10} /> {session.importedCount}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
