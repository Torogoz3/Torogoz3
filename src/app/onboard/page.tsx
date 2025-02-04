"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadToPinata } from "../../utils/ipfsUtils";
import { 
  initializeEAS, 
  createInstitutionAttestation, 
  getAttestationsBySchema 
} from "../../utils/eas";

const Onboard = () => {
  const [instituteName, setInstituteName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  // Al montar, obtenemos la cuenta y verificamos si la institución ya está registrada.
  useEffect(() => {
    (async () => {
      try {
        const { account } = await initializeEAS();
        setAccount(account);
        const institutionAttestations = await getAttestationsBySchema("institution", account);
        if (institutionAttestations.length > 0) {
          setVerified(true);
        }
      } catch (err) {
        console.error(err);
        setError("Error conectando a MetaMask o consultando atestaciones.");
      }
    })();
  }, []);

  // Función simple de polling: reintenta consultar las atestaciones hasta cierto número de reintentos.
  const pollVerification = async (retries = 5, interval = 5000) => {
    for (let i = 0; i < retries; i++) {
      const institutionAttestations = await getAttestationsBySchema("institution", account);
      console.log(`Polling attempt ${i + 1}: found ${institutionAttestations.length} attestations for account ${account}`);
      if (institutionAttestations.length > 0) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instituteName || !description || !logoFile) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      setLoading(true);
      // Sube el logo a Pinata y obtén el IPFS hash.
      const ipfsHash = await uploadToPinata(logoFile);
      // Crea la atestación de la institución.
      await createInstitutionAttestation({
        recipient: account,
        InstituteName: instituteName,
        Description: description,
        IPFSHash: ipfsHash,
      });

      // esto es para que  la atestación se indexe
      const verifiedResult = await pollVerification(50, 5000); // 10 intentos, 5 segundos cada uno
      if (verifiedResult) {
        setVerified(true);
      } else {
        setError("No se pudo confirmar la verificación en el tiempo esperado.");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error al registrar la institución.");
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/institution-dashboard");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Verificación de Institución</h1>
      {verified ? (
        // Si la institución ya está verificada, mostramos el mensaje y botón para continuar.
        <div>
          <p className="mb-4 text-green-600">
            Congratulations, for your verification, continue to your dashboard!
          </p>
          <button 
            onClick={handleContinue}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Continue to Dashboard
          </button>
        </div>
      ) : (
        // Si no esta verificada, se muestra el formulario.
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">
              Nombre de la Institución:
            </label>
            <input
              type="text"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Descripción:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Logo / Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
              className="border p-2 w-full"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Registrando..." : "Registrar Institución"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Onboard;
