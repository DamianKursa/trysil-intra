// components/UI/InstallPromptModal.tsx
import React, { useEffect, useState } from "react"

const InstallPromptModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if device is iOS
    const userAgent = window.navigator.userAgent
    const ios = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
    setIsIOS(ios)

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
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
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response: ${outcome}`)
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  // If not showing prompt and not on iOS, return null
  if (!showPrompt && !isIOS) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4'>
      <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-sm'>
        <h2 className='text-xl font-bold mb-4'>Install App</h2>
        {isIOS ? (
          <>
            <p className='mb-4'>
              To install this app on your iPhone, tap the share button in Safari
              and then select "Add to Home Screen".
            </p>
            <button
              onClick={() => setShowPrompt(false)}
              className='w-full bg-blue-600 text-white py-2 rounded'
            >
              Close
            </button>
          </>
        ) : (
          <>
            <p className='mb-4'>
              For a better experience, add this app to your home screen.
            </p>
            <button
              onClick={handleInstallClick}
              className='w-full bg-blue-600 text-white py-2 rounded'
            >
              Install
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default InstallPromptModal
