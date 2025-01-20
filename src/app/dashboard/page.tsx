'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { FiLoader, FiRefreshCw, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { getUserAttestations } from '../../utils/eas';

interface Attestation {
  institute: string;
  course: string;
  firstName: string;
  lastName: string;
  recipient: string;
  txHash: string;
}

export default function DashboardPage() {
  const { user, authenticated, login, ready } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Declarar handleCheckAttestations con useCallback
  const handleCheckAttestations = useCallback(async () => {
    if (!user?.wallet?.address) return;

    setIsLoading(true);
    setError(null);

    try {
      const result: Attestation[] = await getUserAttestations(user.wallet.address);
      setAttestations(result);
    } catch (err) {
      console.error('Error fetching attestations:', err);
      setError('Failed to fetch attestations.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.wallet?.address]);

  useEffect(() => {
    if (authenticated && user?.wallet?.address && ready) {
      handleCheckAttestations();
    }
  }, [authenticated, user?.wallet?.address, ready, handleCheckAttestations]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Attestations Dashboard</h1>
      <Button onClick={handleCheckAttestations} disabled={isLoading} variant="outline">
        <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>

      {isLoading ? (
        <div className="text-center mt-8">
          <FiLoader className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Loading attestations...</p>
        </div>
      ) : attestations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mt-8">
          {attestations.map((attestation, index) => (
            <Card key={index} className="p-4">
              <p><strong>Institute:</strong> {attestation.institute}</p>
              <p><strong>Course:</strong> {attestation.course}</p>
              <p><strong>Recipient:</strong> {attestation.recipient}</p>
              <p><strong>Transaction:</strong> {attestation.txHash}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">
          <FiXCircle className="h-8 w-8 mx-auto text-red-500" />
          <p className="mt-2 text-muted-foreground">No attestations found.</p>
        </div>
      )}

      {error && (
        <Card className="mt-4 p-4 bg-red-100 text-red-500">
          {error}
        </Card>
      )}
    </div>
  );
}
