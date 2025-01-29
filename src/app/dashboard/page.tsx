'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { getInstitutionMetrics } from '../../utils/eas';

interface InstitutionMetrics {
  totalCertificates: number;
  totalParticipants: number;
}

export default function InstitutionDashboardPage() {
  const { user, authenticated, login, ready } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<InstitutionMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!user?.wallet?.address) {
      setError("No wallet address found.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const metrics = await getInstitutionMetrics(user.wallet.address);
      setData(metrics);
    } catch (err) {
      console.error('Error loading institution data:', err);
      setError('Failed to load institution data.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.wallet?.address]);

  useEffect(() => {
    if (authenticated && ready) {
      loadDashboardData();
    }
  }, [authenticated, ready, loadDashboardData]);

  if (!authenticated || !ready) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-4">Please connect your wallet to view your dashboard</p>
          <Button onClick={() => login()}>Connect Wallet</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-4 bg-red-100 text-red-500">{error}</Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">No data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Institution Dashboard</h1>
      <Card className="p-4 mt-4">
        <p><strong>Total Certificates:</strong> {data.totalCertificates}</p>
        <p><strong>Total Participants:</strong> {data.totalParticipants}</p>
      </Card>
    </div>
  );
}
