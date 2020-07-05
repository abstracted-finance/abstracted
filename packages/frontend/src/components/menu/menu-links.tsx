import React from 'react'
import { useTheme, Spacer } from '@zeit-ui/react'
import LogoIcon from '../icons/logo'
import Controls from './controls'

const MenuLinks = () => {
  const theme = useTheme()

  return (
    <nav>
      <div className="site-name">
        <span title={'Go Home'} onClick={() => {}}>
          <LogoIcon />
        </span>
        <Spacer x={0.25} />
        <a href="/">
          <span title={'Go Home'}>ABSTRACTED</span>
        </a>
      </div>
      <div className="links">
        <Controls />
      </div>
      <style jsx>{`
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1000px;
          user-select: none;
          position: relative;
          margin: 0 auto;
          padding: 0 ${theme.layout.gap};
          height: 60px;
        }
        .site-name {
          display: flex;
          align-items: center;
        }
        span {
          color: ${theme.palette.accents_7};
          font-size: 0.75rem;
          display: inline-flex;
          text-transform: capitalize;
        }
      `}</style>
    </nav>
  )
}

export default MenuLinks
