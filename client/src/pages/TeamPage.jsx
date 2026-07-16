import React from 'react';
import { useParams } from 'react-router-dom';
import AdvisoryBoard from './team/AdvisoryBoard';
import CenterTeam from './team/CenterTeam';
import Faculty from './team/Faculty';
import ResearchScholars from './team/ResearchScholars';

export default function TeamPage() {
  const { category } = useParams();

  switch (category) {
    case 'advisory-board':
      return <AdvisoryBoard />;
    case 'center-team':
      return <CenterTeam />;
    case 'faculty':
      return <Faculty />;
    case 'research-scholars':
      return <ResearchScholars />;
    default:
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-7xl font-bold text-foreground">404</h1>
            <h2 className="mt-4 text-xl font-semibold text-foreground">Team not found</h2>
            <p className="mt-2 text-sm text-muted-foreground">The team category you're looking for doesn't exist.</p>
          </div>
        </div>
      );
  }
}
