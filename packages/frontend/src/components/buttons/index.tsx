import React from 'react'
import { Button } from '@zeit-ui/react'

export const FullWidthButton = (props) =>
  React.cloneElement(<Button />, {
    style: { width: '100%' },
    ...props,
  })
