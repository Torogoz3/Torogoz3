"use client";

import { useEffect, useState } from "react";
import { initializeEAS, getAttestationsBySchema } from "../../utils/eas";
import Image from "next/image";

interface InstitutionAttestation {
  InstituteName?: string;
  Description?: string;
  IPFSHash?: string;
  // otros campos que quieras agregar...
}

const InstitutionDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [account, setAccount] = useState("");
  const [institution, setInstitution] = useState<InstitutionAttestation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { account } = await initializeEAS();
        setAccount(account);
        const institutionAttestations = await getAttestationsBySchema("institution", account);
        if (institutionAttestations.length > 0) {
          // Asumimos que la primera atestación es la que queremos mostrar
          setInstitution(institutionAttestations[0]);
        } else {
          setError("No se encontró información de la institución.");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error al obtener datos de la institución.");
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!institution)
    return <p>No se encontró la institución. Por favor, regístrala en Onboard.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Institución</h1>
      <div className="mb-8 border p-4 rounded">
        <h2 className="text-xl font-semibold">Información de la Institución</h2>
        <p>
          <strong>Nombre:</strong> {institution.InstituteName}
        </p>
        <p>
          <strong>Descripción:</strong> {institution.Description}
        </p>
        <div className="mt-4">
          <strong>Logo / Imagen:</strong>
          <br />
          <Image
            src={`https://gateway.pinata.cloud/ipfs/${institution.IPFSHash}`}
            alt="Logo de la Institución"
            className="w-24 h-24 object-contain mt-2"
          />
        </div>
      </div>
      {/* Aquí puedes agregar otros componentes, por ejemplo, opciones para editar la info o ver estadísticas */}
    </div>
  );
};

export default InstitutionDashboard;
