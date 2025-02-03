"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { uploadToPinata } from "../../utils/ipfsUtils";
import { initializeEAS, createInstitutionAttestation } from "../../utils/eas";

const Onboard = () => {
  const [instituteName, setInstituteName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { account } = await initializeEAS();
        setAccount(account);
      } catch (err) {
        console.error(err);
        setError("Error al conectar con MetaMask");
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instituteName || !description || !logoFile) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const ipfsHash = await uploadToPinata(logoFile);
      await createInstitutionAttestation({
        recipient: account,
        InstituteName: instituteName,
        Description: description,
        IPFSHash: ipfsHash,
      });
      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Error al registrar la institución.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de Institución</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre de la Institución:</label>
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
    </div>
  );
};

export default Onboard;
