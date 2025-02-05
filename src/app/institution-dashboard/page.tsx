"use client";

import { useEffect, useState } from "react";
import { initializeEAS } from "../../utils/eas";
import InstitutionAttestation from "../../components/InstitutionAttestation";

const InstitutionDashboard = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    (async () => {
      const { account } = await initializeEAS();
      setAccount(account);
    })();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Institución</h1>
      {account && <InstitutionAttestation account={account} />}
    </div>
  );
};

export default InstitutionDashboard;
