// utils/eas.ts
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider, Interface, LogDescription, Contract } from "ethers";

// Dirección del contrato EAS
const EASContractAddress = "0x4200000000000000000000000000000000000021";

// Esquemas definidos para cada tipo de atestación
const SCHEMA_UIDS = {
  institution:
    "0x3f8b05c271eb156a432f2ed3c0aecded8906acbe1ca2423518aac49271a99a68",
  certificate:
    "0xc45af53f0c5c6aa1c6f5b722917ea962ade9c5a5ebd0b8b451ddcb8b565513eb",
};

// ABI del contrato EAS (se incluye el parámetro "data" para decodificar la atestación)
const EAS_ABI = [
  "event Attested(address indexed recipient, bytes32 indexed uid, bytes32 indexed schema, bytes data)",
];

// Tipo para las atestaciones decodificadas
export interface DecodedAttestation {
  recipient: string;
  uid: string;
  schema: string;
  txHash: string;
  timestamp?: number;
  // Campos para la atestación de institución
  InstituteName?: string;
  Description?: string;
  // Campos para la atestación de certificación
  Institute?: string;
  Course?: string;
  FirstName?: string;
  LastName?: string;
  IPFSHash?: string;
}

// Inicializa EAS, conecta a MetaMask y crea el contrato para leer eventos
export async function initializeEAS() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask no está instalado.");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const account = await signer.getAddress();

  const eas = new EAS(EASContractAddress);
  await eas.connect(signer);

  // Instancia el contrato para leer eventos desde la blockchain
  const contract = new Contract(EASContractAddress, EAS_ABI, provider);

  return { eas, account, signer, provider, contract };
}

// Crea la atestación de institución usando el esquema: 
// "string InstituteName,string Description,string IPFSHash"
export async function createInstitutionAttestation(data: {
  recipient: string;
  InstituteName: string;
  Description: string;
  IPFSHash: string;
}) {
  const { eas } = await initializeEAS();
  const schemaUID = SCHEMA_UIDS.institution;

  const schemaEncoder = new SchemaEncoder(
    "string InstituteName,string Description,string IPFSHash"
  );

  const encodedData = schemaEncoder.encodeData([
    { name: "InstituteName", value: data.InstituteName, type: "string" },
    { name: "Description", value: data.Description, type: "string" },
    { name: "IPFSHash", value: data.IPFSHash, type: "string" },
  ]);

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: data.recipient,
      expirationTime: BigInt(0),
      revocable: true,
      data: encodedData,
    },
  });

  return await tx.wait();
}

// Crea la atestación de certificación usando el esquema: 
// "string Institute,string Course,string FirstName,string LastName,string IPFSHash"
export async function createCertificateAttestation(data: {
  recipient: string;
  Institute: string;
  Course: string;
  FirstName: string;
  LastName: string;
  IPFSHash: string;
}) {
  const { eas } = await initializeEAS();
  const schemaUID = SCHEMA_UIDS.certificate;

  const schemaEncoder = new SchemaEncoder(
    "string Institute,string Course,string FirstName,string LastName,string IPFSHash"
  );

  const encodedData = schemaEncoder.encodeData([
    { name: "Institute", value: data.Institute, type: "string" },
    { name: "Course", value: data.Course, type: "string" },
    { name: "FirstName", value: data.FirstName, type: "string" },
    { name: "LastName", value: data.LastName, type: "string" },
    { name: "IPFSHash", value: data.IPFSHash, type: "string" },
  ]);

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: data.recipient,
      expirationTime: BigInt(0),
      revocable: true,
      data: encodedData,
    },
  });

  return await tx.wait();
}

// Obtiene las atestaciones de un esquema específico para una dirección dada
export async function getAttestationsBySchema(
  schemaType: "institution" | "certificate",
  address: string
): Promise<DecodedAttestation[]> {
  if (!SCHEMA_UIDS[schemaType]) {
    throw new Error("El tipo de esquema especificado no es válido.");
  }

  const { contract } = await initializeEAS();
  const schemaUID = SCHEMA_UIDS[schemaType];

  // Filtrar atestaciones por la dirección y el esquema
  const filter = contract.filters.Attested(address, null, schemaUID);

  try {
    
    const fromBlock = 21423350;
    const toBlock = "latest";
    const logs = await contract.queryFilter(filter, fromBlock, toBlock);
    const iface = new Interface(EAS_ABI);

    const schemaStr =
      schemaType === "institution"
        ? "string InstituteName,string Description,string IPFSHash"
        : "string Institute,string Course,string FirstName,string LastName,string IPFSHash";

    const schemaEncoder = new SchemaEncoder(schemaStr);
    const attestations: DecodedAttestation[] = [];

    for (const log of logs) {
      let parsedLog: LogDescription | null = null;
      try {
        parsedLog = iface.parseLog(log);
      } catch (error) {
        console.warn("Error al parsear log:", log, error);
        continue;
      }

      if (!parsedLog) {
        console.warn("Log no parseado:", log);
        continue;
      }

      const decodedData = schemaEncoder.decodeData(parsedLog.args.data);
      const block = await log.getBlock();
      const blockTimestamp = block.timestamp;

      attestations.push({
        recipient: parsedLog.args.recipient,
        uid: parsedLog.args.uid,
        schema: parsedLog.args.schema,
        txHash: log.transactionHash,
        timestamp: blockTimestamp,
        ...Object.fromEntries(decodedData.map((item) => [item.name, item.value])),
      });
    }

    return attestations;
  } catch (error) {
    console.error("Error al obtener atestaciones:", error);
    throw error;
  }
}

// Verifica si una atestación es válida a partir de su hash
export async function verifyAttestation(hash: string): Promise<boolean> {
  if (!hash) {
    throw new Error("El hash de la atestación es requerido.");
  }

  const { eas } = await initializeEAS();

  try {
    return await eas.isAttestationValid(hash);
  } catch (error) {
    console.error("Error al verificar la atestación:", error);
    throw error;
  }
}
