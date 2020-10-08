import { useState, useCallback, useEffect } from 'react'

export default () => {
  const [options, setOptions] = useState()

  //Fetch public options
  const getPublicOptions = useCallback(async () => {
    const response = await fetch(`http://localhost:3030/options/public`)
    let data = await response.json()
    setOptions(data.options)
  }, [])

  useEffect(() => {
    getPublicOptions()
  }, [getPublicOptions])

  return options
}
