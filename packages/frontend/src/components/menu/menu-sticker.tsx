import React, { useEffect } from 'react'
import { useCurrentState, Tabs, useTheme } from '@zeit-ui/react'
import Router from 'next/router'

import Metadata from '../data'
import useAppContext from '../../containers/settings/use-app-context'

const MenuSticker = () => {
  const theme = useTheme()
  const { tabbar: currentUrlTabValue, locale } = useAppContext.useContainer()
  const [tabValue, setTabValue, tabValueRef] = useCurrentState<string>('')
  const [fixed, setFixed, fixedRef] = useCurrentState<boolean>(false)

  const tabbarData = Metadata[locale]

  useEffect(() => setTabValue(currentUrlTabValue), [currentUrlTabValue])
  useEffect(() => {
    const scrollHandler = () => {
      const shouldFixed = document.documentElement.scrollTop > 60
      if (shouldFixed === fixedRef.current) return
      setFixed(shouldFixed)
    }
    document.addEventListener('scroll', scrollHandler)
    return () => document.removeEventListener('scroll', scrollHandler)
  }, [])

  useEffect(() => {
    const shouldRedirectDefaultPage = currentUrlTabValue !== tabValueRef.current
    if (!shouldRedirectDefaultPage) return
    const defaultPath = `/${locale}/${tabValueRef.current}`
    Router.push(defaultPath)
  }, [tabValue, currentUrlTabValue])

  return (
    <>
      <div className={`nav-fill ${fixed ? 'active' : ''}`} />
      <nav className={fixed ? 'fixed' : ''}>
        <div className="sticker">
          <div className="inner">
            <Tabs value={tabValue} onChange={(val) => setTabValue(val)}>
              {tabbarData
                ? tabbarData.map((tab, index) => (
                    <Tabs.Item
                      label={tab.name}
                      value={tab.name}
                      key={`${tab.name}-${index}`}
                    />
                  ))
                : null}
            </Tabs>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .nav-fill {
          width: 0;
          height: 0;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          background-color: ${theme.palette.background};
        }
        .nav-fill.active {
          height: 48px;
          visibility: visible;
        }
        nav {
          position: relative;
          width: 100%;
          height: 48px;
          background-color: ${theme.palette.background};
        }
        nav.fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1500;
          background-color: ${theme.palette.background};
          box-shadow: rgba(0, 0, 0, 0.1) 0 0 15px 0;
        }
        .sticker {
          position: relative;
          height: 100%;
          width: 100%;
        }
        .sticker:before {
          position: absolute;
          content: '';
          height: 1px;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${theme.palette.border};
        }
        .inner {
          max-width: ${theme.layout.pageWidth};
          padding: 0 ${theme.layout.gap};
          width: 100%;
          display: flex;
          align-items: flex-end;
          height: 100%;
          overflow: auto;
          z-index: 900;
          margin: 0 auto;
        }
        .inner :global(.content) {
          display: none;
        }
        .inner :global(.tabs),
        .inner :global(header) {
          height: 100%;
          border: none;
        }
        .inner :global(.tab) {
          height: calc(100% - 2px);
          padding-top: 0;
          padding-bottom: 0;
          color: ${theme.palette.accents_5};
          font-size: 0.875rem;
        }
        .inner :global(.tab):hover {
          color: ${theme.palette.foreground};
        }
        .inner :global(.active) {
          color: ${theme.palette.foreground};
        }
      `}</style>
    </>
  )
}

export default MenuSticker
