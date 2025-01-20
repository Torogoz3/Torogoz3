import { BrowserProvider } from "ethers";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

// Función para inicializar el contrato EAS con el proveedor de MetaMask
export const initializeEAS = async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask no está instalado.");
    }

    // Conecta MetaMask usando BrowserProvider de ethers.js
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();

    // Inicializa el contrato EAS con el firmante
    const eas = new EAS(EASContractAddress);
    eas.connect(signer);

    return { eas, account };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error("Usuario rechazó la conexión a MetaMask.");
    }
    throw error;
  }
};

// Función para emitir una atestación
export const createCredentialAttestation = async ({
  institute,
  course,
  firstName,
  lastName,
  recipient,
}) => {
  if (!institute || !course || !firstName || !lastName || !recipient) {
    throw new Error("Todos los campos son requeridos.");
  }

  const { eas } = await initializeEAS();

  // UID del esquema registrado en EAS
  const schemaUID =
    "0x934fa076992c05c87e7a574767c4328cdde72b064891ce620c5f3126b046f4c4";

  try {
    const schemaEncoder = new SchemaEncoder(
      "string Institute,string Course,string FirstName,string LastName"
    );
    const encodedData = schemaEncoder.encodeData([
      { name: "Institute", value: institute, type: "string" },
      { name: "Course", value: course, type: "string" },
      { name: "FirstName", value: firstName, type: "string" },
      { name: "LastName", value: lastName, type: "string" },
    ]);

    // Enviar la transacción para crear la atestación
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient, // Dirección del destinatario
        expirationTime: 0, // Sin expiración
        revocable: true, // Revocable
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000", // Sin referencia
        data: encodedData,
      },
    });

    // Espera la confirmación de la transacción
    const txReceipt = await tx.wait();
    return txReceipt;
  } catch (error) {
    console.error("Error al crear la atestación: " + error.message);
    throw error;
  }
};

// Función para recuperar las atestaciones de un usuario
export const getUserAttestations = async (recipientAddress) => {
  try {
    const { eas } = await initializeEAS();

    // Recupera las atestaciones asociadas a la dirección del usuario
    const attestations = await eas.getAttestations({
      recipient: recipientAddress,
    });

    // Mapear las atestaciones para extraer datos relevantes
    return attestations.map((attestation) => ({
      institute: attestation.data.Institute,
      course: attestation.data.Course,
      firstName: attestation.data.FirstName,
      lastName: attestation.data.LastName,
      recipient: attestation.recipient,
      txHash: attestation.txHash,
    }));
  } catch (error) {
    console.error("Error al obtener las atestaciones: " + error.message);
    throw error;
  }
};
