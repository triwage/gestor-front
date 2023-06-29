import { useState } from 'react'
import { useNavigate } from 'react-router'

import { FormResetPassword } from '../../components/Pages/Login/FormResetPassword'
import { FormSendEmail } from '../../components/Pages/Login/FormSendEmail'
import { FormValidateCode } from '../../components/Pages/Login/FormValidateCode'
import { LeftBar } from '../../components/Pages/Login/LeftBar'

export default function ResetPassword() {
  const [stage, setStage] = useState(1)
  const [email, setEmail] = useState<null | string>(null)
  const [codigoValidacao, setCodigoValidacao] = useState<null | string>(null)

  const router = useNavigate()

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-linear-login">
      <div className="grid h-2/3 w-2/3 grid-cols-2 rounded-lg bg-white drop-shadow-2xl">
        {/* Left  */}
        <LeftBar />

        {/* Right */}
        {stage === 1 && (
          <FormSendEmail
            onResponse={(res) => {
              setStage(res.value)
              setEmail(res.email)
            }}
          />
        )}
        {stage === 2 && email && (
          <FormValidateCode
            onResponse={(res) => {
              setStage(res.value)
              setCodigoValidacao(res.codigoValidacao)
            }}
            email={email}
          />
        )}

        {stage === 3 && email && codigoValidacao && (
          <FormResetPassword
            onResponse={(res) => {
              if (res) {
                router(-1)
              }
            }}
            email={email}
            codigoValidacao={codigoValidacao}
          />
        )}
      </div>
    </div>
  )
}
