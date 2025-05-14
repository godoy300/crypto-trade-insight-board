
import React from 'react';
import Dashboard from '../components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-3 px-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Crypto Trade Analysis</h1>
          <p className="text-muted-foreground">Track, analyze and optimize your trading performance</p>
        </div>
      </header>
      
      <main className="py-6">
        <Dashboard />
      </main>
      
      <footer className="bg-card border-t border-border py-4 mt-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Crypto Trade Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
