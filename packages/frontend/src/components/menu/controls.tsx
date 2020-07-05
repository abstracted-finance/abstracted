import React, { useMemo } from 'react'
import { Button, Spacer, useTheme } from '@zeit-ui/react'
import MoonIcon from '@zeit-ui/react-icons/moon'
import SunIcon from '@zeit-ui/react-icons/sun'

import ConnectWeb3 from '../buttons/connect-web3'
import useAppContext from '../../containers/settings/use-app-context'

export default () => {
  const theme = useTheme()
  const { themeChangeHandler } = useAppContext.useContainer()
  const isDark = useMemo(() => theme.type === 'dark', [theme.type])
  const switchThemes = (type: 'dark' | 'light') => {
    themeChangeHandler({ type })
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem('theme', type)
  }

  return (
    <div className="controls">
      <div className="tools">
        <ConnectWeb3 />
        <Spacer x={1} />
        <span
          className="theme-toggler"
          onClick={() => switchThemes(isDark ? 'light' : 'dark')}
        >
          {isDark ? <MoonIcon size={14} /> : <SunIcon size={14} />}
        </span>
      </div>
      <style jsx>{`
        .theme-toggler {
          cursor: pointer;
        }
        .controls {
          height: 100%;
          display: flex;
          margin: 0;
          position: relative;
        }
        .controls :global(.select) {
          width: min-content;
          min-width: unset;
        }
        .select-content {
          width: auto;
          height: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .select-content :global(svg) {
          margin-right: 0.5rem;
        }
        .tools {
          display: flex;
          height: 2.5rem;
          box-sizing: border-box;
          align-items: center;
        }
        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          .controls {
            display: none;
            pointer-events: none;
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  )
}
