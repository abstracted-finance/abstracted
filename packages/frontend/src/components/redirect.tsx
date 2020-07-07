import { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'

const redirect = (destination: string) => {
  const Home: NextPage = ({}) => {
    return (
      <Head>
        <meta httpEquiv="refresh" content={`0; url=${destination}`} />
      </Head>
    )
  }

  Home.getInitialProps = async ({ res }) => {
    if (res && res.writeHead) {
      res.writeHead(302, { Location: destination })
      res.end()
    } else if (typeof window !== 'undefined') {
      try {
        await Router.push(destination)
      } catch (e) {}
    }

    return {}
  }

  return Home
}

export default redirect
