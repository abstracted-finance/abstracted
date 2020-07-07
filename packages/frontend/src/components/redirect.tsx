import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

export interface Props {
  metaRedirect?: boolean
}

const redirect = (destination: string) => {
  const Home: NextPage<Props> = ({ metaRedirect }) => {
    if (!metaRedirect) return <></>

    return (
      <Head>
        <meta httpEquiv="refresh" content={`0; url=${destination}`} />
        <script></script>
      </Head>
    )
  }

  Home.getInitialProps = async ({ res }): Promise<Props> => {
    if (res && res.writeHead) {
      res.writeHead(302, { Location: destination })
      res.end()
      return {}
    }

    if (typeof window !== 'undefined') {
      const router = useRouter()
      await router.push(destination)
    }

    return { metaRedirect: true }
  }

  return Home
}

export default redirect
