import { Text, Link, Loading } from '@zeit-ui/react'

import useWeb3 from '../../containers/web3/use-web3'
import useProxy from '../../containers/web3/use-proxy'

export default () => {
  const { connect, signer, ethAddress } = useWeb3.useContainer()
  const {
    isCreatingProxy,
    createProxy,
    hasProxy,
    hasProxyFactory,
  } = useProxy.useContainer()

  if (!signer || !ethAddress) {
    return (
      <Text blockquote>
        Please{' '}
        <Link
          underline
          href="#"
          onClick={(e) => {
            e.preventDefault()
            connect()
          }}
          color
        >
          connect
        </Link>{' '}
        to a wallet to continue
      </Text>
    )
  }

  if (!hasProxyFactory) {
    return (
      <Text blockquote>
        Unable to find deployed contracts. Are you on mainnet?
      </Text>
    )
  }

  if (isCreatingProxy) {
    return (
      <Text blockquote>
        <Loading />
      </Text>
    )
  }

  if (!hasProxy) {
    return (
      <Text blockquote>
        Please{' '}
        <Link
          underline
          href="#"
          onClick={(e) => {
            e.preventDefault()
            createProxy()
          }}
          color
        >
          create
        </Link>{' '}
        a smart wallet to continue
      </Text>
    )
  }

  return <></>
}
