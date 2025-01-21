import { BrowserProvider, Contract, isAddress, getAddress } from "ethers";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

// Dirección del contrato EAS
const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

// ABI mínima necesaria para el contrato EAS
const EAS_ABI = [
  "event Attested(address indexed recipient, bytes32 indexed uid, bytes32 indexed schema)"
];

// Función para inicializar el contrato EAS con el proveedor de MetaMask
export const initializeEAS = async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask no está instalado.");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();

    const eas = new EAS(EASContractAddress);
    eas.connect(signer);

    const contract = new Contract(EASContractAddress, EAS_ABI, provider);

    return { eas, contract, account };
  } catch (error) {
    console.error("Error al inicializar EAS:", error);
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

  if (!isAddress(recipient)) {
    throw new Error("La dirección Ethereum proporcionada no es válida.");
  }

  const normalizedRecipient = getAddress(recipient);

  const { eas } = await initializeEAS();

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

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: normalizedRecipient,
        expirationTime: 0,
        revocable: true,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
    });

    return await tx.wait();
  } catch (error) {
    console.error("Error al crear la atestación:", error);
    throw error;
  }
};

// Función para recuperar las atestaciones de un usuario
export const getUserAttestations = async (recipientAddress) => {
  try {
    const { contract } = await initializeEAS();

    const filter = contract.filters.Attested(recipientAddress);

    const logs = await contract.queryFilter(filter);

    return logs.map((log) => {
      const { recipient, uid, schema } = log.args;

      return {
        recipient,
        uid,
        schema,
        txHash: log.transactionHash,
      };
    });
  } catch (error) {
    console.error("Error al obtener las atestaciones:", error);
    throw error;
  }
};

// Función para obtener el rol del usuario
export const getUserRole = async (walletAddress) => {
  try {
    if (walletAddress.endsWith("1")) {
      return "institution";
    }
    return "student";
  } catch (error) {
    console.error("Error al determinar el rol del usuario:", error);
    throw error;
  }
};

// Función para obtener métricas de una institución
export const getInstitutionMetrics = async (institutionAddress) => {
  try {
    const attestations = await getUserAttestations(institutionAddress);
    const totalCertificates = attestations.length;
    const totalParticipants = new Set(attestations.map((a) => a.recipient)).size;

    return {
      totalCertificates,
      totalParticipants,
    };
  } catch (error) {
    console.error("Error al obtener métricas de la institución:", error);
    throw error;
  }
};

// Función para obtener certificados de un estudiante
export const getUserCertificates = async (studentAddress) => {
  try {
    const attestations = await getUserAttestations(studentAddress);

    return attestations.map((attestation) => ({
      institute: attestation.schema,
      course: "Curso Genérico",
      firstName: "Nombre",
      lastName: "Apellido",
      recipient: attestation.recipient,
      txHash: attestation.txHash,
    }));
  } catch (error) {
    console.error("Error al obtener certificados del estudiante:", error);
    throw error;
  }
};
