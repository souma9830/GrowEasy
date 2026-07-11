'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { PageShell } from '@/components/layout/page-shell';
import { PageTitle } from '@/components/layout/page-title';
import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { Plus } from 'lucide-react';
import { ProjectCard, CreateProjectModal } from '@/components/features';
import { Card } from '@/components/ui/card';

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = (newProject: any) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <PageShell>
        <div className="flex justify-between items-center mb-6">
          <PageTitle
            title="Projects"
            description="Manage and track your lead import projects"
          />
          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
            <Plus size={16} />
            <span>New Project</span>
          </Button>
        </div>

        <Section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} padding="lg" className="h-40 animate-pulse bg-[var(--bg-secondary)]">
                  <div />
                </Card>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Card padding="none">
              <EmptyState
                title="No projects yet"
                description="Create your first project to start importing leads"
                action={{
                  label: 'Create Project',
                  onClick: () => setIsModalOpen(true),
                }}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </Section>
      </PageShell>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
}
