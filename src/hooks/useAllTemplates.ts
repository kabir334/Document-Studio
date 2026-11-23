import { useEffect, useMemo, useState } from 'react'
import { getAllTemplates } from '../templates'

export function useAllTemplates() {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const refresh = () => setVersion((v) => v + 1)
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return useMemo(() => getAllTemplates(), [version])
}