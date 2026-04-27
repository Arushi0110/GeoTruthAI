import { useState, useEffect } from 'react'

export const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setLoading(false)
      return
    }

    const handleSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
      setLoading(false)
    }

    const handleError = (err) => {
      console.warn('Geolocation error:', err)
      setError(err.message)
      setLoading(false)
      // Fallback: IP-based geo (call API)
      fetchIPGeolocation()
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError)

    const fallbackTimeout = setTimeout(() => {
      if (loading) fetchIPGeolocation()
    }, 10000)

    return () => clearTimeout(fallbackTimeout)
  }, [])

  const fetchIPGeolocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      setLocation({
        lat: data.latitude,
        lng: data.longitude,
      })
    } catch (err) {
      setError('Could not get location')
    } finally {
      setLoading(false)
    }
  }

  return { location, error, loading }
}

