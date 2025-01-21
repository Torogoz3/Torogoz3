'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { getUserRole, getInstitutionMetrics, getUserCertificates } from '../../utils/eas';

interface Attestation {
  institute: string;
  course: string;
  firstName: string;
  lastName: string;
  recipient: string;
  txHash: string;
}

interface InstitutionMetrics {
  totalCertificates: number;
  totalParticipants: number;
}

export default function DashboardPage() {
  const { user, authenticated, login, ready } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState<Attestation[] | InstitutionMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los datos del dashboard
  const loadDashboardData = useCallback(async () => {
    if (!user?.wallet?.address) {
      setError("No wallet address found.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userRole = await getUserRole(user.wallet.address);
      setRole(userRole);

      if (userRole === 'institution') {
        const metrics = await getInstitutionMetrics(user.wallet.address);
        setData(metrics);
      } else if (userRole === 'student') {
        const certificates = await getUserCertificates(user.wallet.address);
        setData(certificates);
      } else {
        throw new Error('Invalid role');
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.wallet?.address]);

  useEffect(() => {
    if (authenticated && ready) {
      loadDashboardData();
    }
  }, [authenticated, ready, loadDashboardData]);

  // Renderizado del dashboard
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
      {role === 'institution' ? (
        <InstitutionDashboard data={data as InstitutionMetrics} />
      ) : role === 'student' ? (
        <StudentDashboard data={data as Attestation[]} />
      ) : (
        <p className="text-center text-muted-foreground">Invalid role.</p>
      )}
    </div>
  );
}

// Componente para el dashboard de instituciones
function InstitutionDashboard({ data }: { data: InstitutionMetrics }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Institution Dashboard</h1>
      <Card className="p-4 mt-4">
        <p><strong>Total Certificates:</strong> {data.totalCertificates}</p>
        <p><strong>Total Participants:</strong> {data.totalParticipants}</p>
      </Card>
    </div>
  );
}

// Componente para el dashboard de estudiantes
function StudentDashboard({ data }: { data: Attestation[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Your Certificates</h1>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {data.map((certificate, index) => (
            <Card key={index} className="p-4">
              <p><strong>Institute:</strong> {certificate.institute}</p>
              <p><strong>Course:</strong> {certificate.course}</p>
              <p><strong>Transaction Hash:</strong> {certificate.txHash}</p>
              <Button className="mt-2" variant="outline">Download</Button>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No certificates found.</p>
      )}
    </div>
  );
}
