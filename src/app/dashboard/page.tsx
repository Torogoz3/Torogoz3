"use client";

import { useState, useEffect } from "react";
import { uploadToPinata } from "../../utils/ipfsUtils";
import {
  initializeEAS,
  getAttestationsBySchema,
  createCertificateAttestation,
} from "../../utils/eas";

const Dashboard = () => {
  const [account, setAccount] = useState("");
  const [institute, setInstitute] = useState(""); // Ahora es un string
  const [course, setCourse] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [certificates, setCertificates] = useState<any[]>([]); // Estado para las certificaciones

  // Al montar, obtenemos la cuenta y las certificaciones
  useEffect(() => {
    (async () => {
      try {
        const { account } = await initializeEAS();
        setAccount(account);
        const certs = await getAttestationsBySchema("certificate", account);
        setCertificates(certs);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !institute ||
      !course ||
      !firstName ||
      !lastName ||
      !recipientAddress ||
      !certificateFile
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      // Sube el archivo a Pinata
      const ipfsHash = await uploadToPinata(certificateFile);
      // Crea la atestación usando el nombre de la institución ingresado
      await createCertificateAttestation({
        recipient: recipientAddress,
        Institute: institute,
        Course: course,
        FirstName: firstName,
        LastName: lastName,
        IPFSHash: ipfsHash,
      });
      // Actualiza la lista de certificaciones
      const certs = await getAttestationsBySchema("certificate", account);
      setCertificates(certs);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error al crear la certificación.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Emitir Certificación</h2>
        <form onSubmit={handleCertificateSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nombre de Institución:</label>
            <input
              type="text"
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Curso:</label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">
              Nombre del Alumno/Empleado:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">
              Apellido del Alumno/Empleado:
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">
              Dirección del Destinatario:
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">
              Archivo de Certificación:
            </label>
            <input
              type="file"
              onChange={(e) =>
                e.target.files && setCertificateFile(e.target.files[0])
              }
              className="border p-2 w-full"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Creando Certificación..." : "Emitir Certificación"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Certificaciones Emitidas</h2>
        {certificates.length === 0 ? (
          <p>No hay certificaciones emitidas.</p>
        ) : (
          <ul className="space-y-2">
            {certificates.map((cert) => (
              <li key={cert.uid} className="border p-2 rounded">
                <p>
                  <strong>Institución:</strong> {cert.Institute}
                </p>
                <p>
                  <strong>Curso:</strong> {cert.Course}
                </p>
                <p>
                  <strong>Alumno:</strong> {cert.FirstName} {cert.LastName}
                </p>
                <p>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${cert.IPFSHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Ver Certificado
                  </a>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
