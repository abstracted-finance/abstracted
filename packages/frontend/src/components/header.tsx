import React from 'react'
import Head from 'next/head'

export interface Meta {
  title: string
}

const toCapitalize = (name: string) => {
  const [first, ...rest] = name
  return `${first.toUpperCase()}${rest.join('')}`
}

export default ({ meta }: { meta: Meta } = { meta: { title: null } }) => (
  <Head>
    <title>
      {meta.title ? `${toCapitalize(meta.title)} | ` : ''}Abstracted
    </title>
  </Head>
)
