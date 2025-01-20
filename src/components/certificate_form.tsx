'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
//import { uploadToIPFS } from '../utils/ipfsUtils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createCredentialAttestation } from '../utils/eas'
import Web3 from 'web3'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ethers } from 'ethers'


interface CertificateFormData {
  institute: string
  course: string
  firstName: string
  lastName: string
  recipient: string
}


interface CertificateFormProps {
  onComplete: (data:CertificateFormData) => void;
}

export function CertificateForm({ onComplete }: CertificateFormProps) {
  const [formData, setFormData] = useState<CertificateFormData>({
    institute: "",
    course: "",
    firstName: "",
    lastName: "",
    recipient: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user, ready } = usePrivy()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function validateEthereumAddress(address: string): boolean {
    return Web3.utils.isAddress(address)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validar que todos los campos tengan valor
      if (!Object.values(formData).every(value => value)) {
        throw new Error("Todos los campos son requeridos")
      }

      // Asegúrate de que todos los campos estén presentes
      const attestationData = {
        institute: formData.institute,
        course: formData.course,
        firstName: formData.firstName,
        lastName: formData.lastName,
        recipient: formData.recipient
      }

      // Validar que todos los campos tengan valor
      if (!Object.values(attestationData).every(value => value)) {
        throw new Error("Todos los campos son requeridos")
      }

      // Llamar a onComplete con los datos validados
      await onComplete(attestationData)
      setSuccess("Certificate created successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating certificate')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!user || !ready) {
    return <div>Please connect your wallet to issue a certificate.</div>
  }
  



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="institute">Institution Name</Label>
        <Input
          id="institute"
          name="institute"
          value={formData.institute}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="course">Course Name</Label>
        <Input
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="recipien">Recipient Ethereum Address</Label>
        <Input
          id="recipient"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Issuing...' : 'Issue Certificate'}
      </Button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </form>
  )
}