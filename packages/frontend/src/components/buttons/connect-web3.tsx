import React from "react";
import { Tooltip, useTheme } from "@zeit-ui/react";

import useWeb3 from '../../containers/web3/use-web3'
import { Tool } from "@zeit-ui/react-icons";

export default () => {
    const theme = useTheme();
    const { connect, ethAddress, connected } = useWeb3.useContainer()

    return (
        <>
            <Tooltip placement="bottom" text={connected ? `Connected to ${ethAddress}` : 'Connect to web3'}>
                <span onClick={connected ? () => { } : connect}>{
                    connected ? 'Connected' : 'Connect'
                }</span>
            </Tooltip>
            <style jsx>{`
            span {
                border: 1px solid ${theme.palette.accents_7};
                border-radius: 3px;
                padding: 5px 10px;
                color: ${theme.palette.accents_7};
                cursor: ${connected ? 'default' : 'pointer'};
                font-size: 0.75rem;
            }
            `}</style>
        </>
    )
}