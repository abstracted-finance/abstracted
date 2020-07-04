import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import MenuLinks from './menu-links'
import MenuSticker from './menu-sticker'

const Menu: React.FC<{}> = () => {
  const router = useRouter()
  const [showAfterRender, setShowAfterRender] = useState<boolean>(false)
  useEffect(() => setShowAfterRender(true), [])
  useEffect(() => {
    const prefetch = async () => {
      const urls = ['/en-us/guide/introduction', '/en-us/components/text', '/en-us/customization']
      await Promise.all(
        urls.map(async url => {
          await router.prefetch(url)
        }),
      )
    }
    prefetch()
      .then()
      .catch(err => console.log(err))
  }, [])

  if (!showAfterRender) return null
  return (
    <div>
      <MenuLinks />
      <MenuSticker />
    </div>
  )
}

export default Menu
