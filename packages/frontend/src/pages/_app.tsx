import Head from 'next/head'
import { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { CssBaseline, ZeitProvider, useTheme } from '@zeit-ui/react'

import AppContextContainer from '../containers/settings/use-app-context'
import WithdrawContainer from '../containers/balances/use-withdraw'
import CompoundEnteredContainer from '../containers/compound/use-compound-entered'
import SettingsContainer from '../containers/settings/use-settings'
import BalancesContainer from '../containers/balances/use-balances'
import ContractsContainer from '../containers/web3/use-contracts'
import ProxyContainer from '../containers/web3/use-proxy'
import Web3Container from '../containers/web3/use-web3'
import LegoContainer from '../containers/legos/use-legos'

import Menu from '../components/menu'

function App({ Component, pageProps }: AppProps) {
  const theme = useTheme()
  const [customTheme, setCustomTheme] = useState(theme)
  const themeChangeHandler = (theme) => {
    setCustomTheme(theme)
  }

  useEffect(() => {
    const theme = window.localStorage.getItem('theme')
    if (theme !== 'dark') return
    themeChangeHandler({ type: 'dark' })
  }, [])

  // Cleans DOM
  useEffect(() => {
    document.documentElement.removeAttribute('style')
    document.body.removeAttribute('style')
  }, [])

  return (
    <ZeitProvider theme={customTheme}>
      <CssBaseline>
        <AppContextContainer.Provider initialState={{ themeChangeHandler }}>
          <SettingsContainer.Provider>
            <Web3Container.Provider>
              <ContractsContainer.Provider>
                <ProxyContainer.Provider>
                  <CompoundEnteredContainer.Provider>
                    <BalancesContainer.Provider>
                      <WithdrawContainer.Provider>
                        <LegoContainer.Provider>
                          <Head>
                            <title>Abstracted</title>
                          </Head>
                          <Menu />
                          <Component {...pageProps} />
                        </LegoContainer.Provider>
                      </WithdrawContainer.Provider>
                    </BalancesContainer.Provider>
                  </CompoundEnteredContainer.Provider>
                </ProxyContainer.Provider>
              </ContractsContainer.Provider>
            </Web3Container.Provider>
          </SettingsContainer.Provider>
        </AppContextContainer.Provider>
      </CssBaseline>
    </ZeitProvider>
  )
}

export default App
