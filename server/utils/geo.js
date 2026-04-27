// Module 4: Geolocation utils
export const getGeoFromIP = async (ip) => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    return {
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude)
    }
  } catch (error) {
    console.error('IP Geo error:', error)
    // Default to India center
    return { lat: 20.5937, lng: 78.9629 }
  }
}

