"use client";

import { useEffect, useState } from "react";
import { getAttestationsBySchema } from "../utils/eas";
import Image from "next/image";

interface InstitutionAttestationProps {
  account: string;
}

const InstitutionAttestation: React.FC<InstitutionAttestationProps> = ({ account }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [institution, setInstitution] = useState<any | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const institutionAttestations = await getAttestationsBySchema("institution", account);
        if (institutionAttestations.length > 0) {
          setInstitution(institutionAttestations[0]);
        } else {
          setError("No se encontró información de la institución.");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los datos de la institución.");
        setLoading(false);
      }
    })();
  }, [account]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (!institution) {
    return <p>No se encontró la institución. Por favor, regístrala de nuevo.</p>;
  }

  return (
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
          width={100}
          height={100}
          className="w-24 h-24 object-contain mt-2"
        />
      </div>
    </div>
  );
};

export default InstitutionAttestation;
