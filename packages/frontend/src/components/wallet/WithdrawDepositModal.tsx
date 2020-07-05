import { Modal, Link, Text, Input, Spinner } from "@zeit-ui/react";
import QRCode from "qrcode.react";

import useBalances, { Balance } from "../../containers/balances/use-balances";
import useProxy from "../../containers/web3/use-proxy";
import useWithdraw from "../../containers/balances/use-withdraw";
import { OperationType, Assets } from "../../utils/constants";
import { useState } from "react";

export interface SelectedRow {
  label: string;
  address: string;
  amount: number;
  operation: OperationType;
}

export default (props) => {
  const { getBalances, balances } = useBalances.useContainer();
  const { proxyAddress } = useProxy.useContainer();
  const { setVisible } = props;

  const selectedRow: SelectedRow = props.selectedRow;

  const { withdraw, isWithdrawing } = useWithdraw.useContainer();
  const [inputAmount, setInputAmount] = useState("");

  return (
    <Modal {...props}>
      <Modal.Title>
        {selectedRow.label !== Assets.ETH ? (
          <Link
            color
            href={`https://etherscan.io/address/${selectedRow.address}`}
          >
            {selectedRow.label}
          </Link>
        ) : (
          selectedRow.label
        )}
      </Modal.Title>
      <Modal.Content>
        {selectedRow.operation === OperationType.Deposit ? (
          <div style={{ textAlign: "center" }}>
            <Text size={20}>Deposit {selectedRow.label} to</Text>
            <QRCode value={proxyAddress} />
            <Text size={14} type="secondary">
              {proxyAddress}
            </Text>
          </div>
        ) : null}
        {selectedRow.operation === OperationType.Withdraw ? (
          <>
            <Text p>
              Amount of {selectedRow.label} to withdraw.{" "}
              <Link
                href="#"
                color
                onClick={(e) => {
                  e.preventDefault();

                  // Get balance
                  const bal: Balance = balances.filter(
                    (x) => x.label === selectedRow.label
                  )[0];

                  setInputAmount(bal.amount);
                }}
              >
                Max&nbsp;&nbsp;
                {isWithdrawing ? (
                  <Spinner style={{ display: "inline-block" }} />
                ) : null}
              </Link>
            </Text>
            <Input
              value={inputAmount}
              width="100%"
              onChange={(e) => setInputAmount(e.target.value)}
            />
          </>
        ) : null}
      </Modal.Content>
      <Modal.Action passive onClick={() => setVisible(false)}>
        Close
      </Modal.Action>
      {selectedRow.operation === OperationType.Withdraw ? (
        <Modal.Action
          disabled={isWithdrawing}
          onClick={async () => {
            await withdraw({ asset: selectedRow.label, amount: inputAmount });
            setVisible(false);
            setInputAmount("");
            await getBalances();
          }}
        >
          Withdraw
        </Modal.Action>
      ) : null}
    </Modal>
  );
};
