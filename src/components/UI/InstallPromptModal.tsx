// components/InstallPromptModal.tsx
import React, { useEffect, useState } from "react"

const InstallPromptModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      // Save the event so it can be triggered later.
      setDeferredPrompt(e)
      setShowButton(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      )
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    // Show the install prompt
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response: ${outcome}`)
    // Hide the button after the prompt is shown
    setShowButton(false)
    setDeferredPrompt(null)
  }

  if (!showButton) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm'>
        <h2 className='text-xl font-bold mb-4'>Install App</h2>
        <p className='mb-4'>
          For a better experience, add this app to your home screen.
        </p>
        <button
          onClick={handleInstallClick}
          className='w-full bg-blue-600 text-white py-2 rounded'
        >
          Install
        </button>
      </div>
    </div>
  )
}

export default InstallPromptModal
