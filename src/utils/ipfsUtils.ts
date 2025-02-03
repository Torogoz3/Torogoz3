// utils/ipfsUtils.ts
import axios from "axios";

export async function uploadToPinata(file: File): Promise<string> {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(url, formData, {
    maxBodyLength: Infinity,
    headers: {
      // El header de content-type lo maneja axios si no lo fijas, pero lo dejamos simple.
      pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
      pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
    },
  });

  // Devuelve el hash IPFS que genera Pinata
  return res.data.IpfsHash;
}
