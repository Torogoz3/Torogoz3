'use client'

import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { CertificateForm } from '../../components/certificate_form'
import { FiUser, FiFileText, FiCheck } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { createCredentialAttestation } from '../../utils/eas'
//import { format } from 'path'
import { isAddress } from "ethers";


const steps = [
  { id: 'connect', title: 'Connect Wallet', icon: FiUser },
  { id: 'create', title: 'Create Certificate', icon: FiFileText },
  { id: 'complete', title: 'Complete', icon: FiCheck },
]

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState('connect')
  const { login, authenticated } = usePrivy()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Update step when authentication status changes
  useEffect(() => {
    if (authenticated && currentStep === 'connect') {
      setCurrentStep('create')
    }
  }, [authenticated, currentStep])


  interface CertificateFormData {
    institute: string
    course: string
    firstName: string
    lastName: string
    recipient: string
  }

  const handleCreateCertificate = async (formData: CertificateFormData) => {
    setIsLoading(true)
    setError(null)
  
    try {
      // Validar que todos los campos estén presentes
      if (!formData || !formData.institute || !formData.course || 
          !formData.firstName || !formData.lastName || !formData.recipient) {
        throw new Error("Todos los campos son requeridos")
      }

      // Validar que la dirección Ethereum sea válida
    if (!isAddress(formData.recipient)) {
      throw new Error("La dirección Ethereum proporcionada no es válida");
    }

      const attestationResult = await createCredentialAttestation({
        institute: formData.institute,
        course: formData.course,
        firstName: formData.firstName,
        lastName: formData.lastName,
        recipient: formData.recipient // Asegúrate de que este campo coincida con recipientAddress
      })

      if (attestationResult) {
        console.log('Attestation created successfully:', attestationResult)
        setCurrentStep('complete')
      } else {
        throw new Error("Error al crear la atestación")
      }
    } catch (err) {
      console.error('Error creating attestation:', err)
      setError(err instanceof Error ? err.message : 'Error al crear el certificado')
    } finally {
      setIsLoading(false)
    }
  }
  const handleComplete = () => {
    try {
      router.push('/dashboard')
    } catch (err) {
      console.error('Error navigating to dashboard:', err)
      setError('Error al navegar al dashboard')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Torogoz 3</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`flex flex-col items-center ${
                currentStep === step.id 
                  ? 'text-primary' 
                  : steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id)
                    ? 'text-primary/60'
                    : 'text-muted-foreground'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep === step.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </div>
          ))}
        </div>

        <Card className="p-6">
          {currentStep === 'connect' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="mb-4">Connect your wallet to get your Certificate</p>
              {authenticated ? (
                <Button onClick={() => setCurrentStep('create')}>Continue</Button>
              ) : (
                <Button onClick={() => login()}>Connect Wallet</Button>
              )}
            </div>
          )}

          {currentStep === 'create' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Create Your First Certificate</h2>
              <CertificateForm 
                onComplete={handleCreateCertificate} 
              />
              {isLoading && (
                <p className="mt-4 text-center text-muted-foreground">
                  Creating your certificate... Please wait.
                </p>
              )}
              {error && (
                <p className="mt-4 text-center text-red-600">
                  {error}
                </p>
              )}
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Onboarding Complete!</h2>
              <p className="mb-4">Congratulations! You have successfully created your first certificate.</p>
              <Button onClick={handleComplete} className="w-full">Go to Dashboard</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
