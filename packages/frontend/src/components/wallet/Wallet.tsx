import {
  Card,
  Checkbox,
  Text,
  Table,
  Link,
  Loading,
  Spacer,
  Button,
  Tooltip,
  Grid,
  useModal,
} from "@zeit-ui/react";
import { useState } from "react";
import { ethers } from "ethers";

import useSettings from "../../containers/settings/useSettings";
import useWeb3 from "../../containers/web3/useWeb3";
import useProxy from "../../containers/web3/useProxy";
import useBalances from "../../containers/balances/useBalances";

import { RefreshIcon } from "../common/Icons";
import { OperationType } from "../../utils/constants";
import WithdrawDepositModal, { SelectedRow } from "./WithdrawDepositModal";

import useLocalStorageState from "use-local-storage-state";

export default () => {
  const { connect, signer, ethAddress } = useWeb3.useContainer();
  const { isCreatingProxy, createProxy, hasProxy } = useProxy.useContainer();
  const { getBalances, isRetrievingBal, balances } = useBalances.useContainer();
  const { settings } = useSettings.useContainer();
  const currency = settings.currency.toUpperCase();

  const [selectedRow, setSelectedRow] = useState<SelectedRow>({
    label: "",
    address: ethers.constants.AddressZero,
    amount: 0,
    operation: OperationType.Deposit,
  });
  const { visible, setVisible, bindings } = useModal();

  const [showZeroBal, setShowZeroBal] = useLocalStorageState<boolean>(
    "showZeroBal",
    false
  );

  const filteredBal = showZeroBal
    ? balances
    : balances.filter((x) => {
        const f = parseFloat(x.amount);
        return f !== 0 && !isNaN(f);
      });

  const sortedBal = filteredBal.sort((a, b) => {
    const [aL, bL] = [a.label, b.label].map((x) => x.toLowerCase());
    if (aL < bL) return -1;
    if (bL < aL) return 1;
    return 0;
  });

  const finalBal = isRetrievingBal
    ? sortedBal.map((x) => {
        return {
          ...x,
          amount: "...",
          price: "...",
        };
      })
    : sortedBal;

  const withdrawOperation = (actions, { rowValue }) => {
    const { amount, address, label } = rowValue;
    return (
      <Button
        onClick={() => {
          setVisible(true);
          setSelectedRow({
            amount,
            address,
            label,
            operation: OperationType.Withdraw,
          });
        }}
        auto
        type="secondary"
        ghost
      >
        Withdraw
      </Button>
    );
  };

  const depositOperation = (actions, { rowValue }) => {
    const { amount, address, label } = rowValue;
    return (
      <Button
        onClick={() => {
          setVisible(true);
          setSelectedRow({
            amount,
            address,
            label,
            operation: OperationType.Deposit,
          });
        }}
        auto
        type="secondary"
      >
        Deposit
      </Button>
    );
  };

  const finalBalWithOperations = finalBal.map((x) => {
    return {
      ...x,
      withdrawOperation,
      depositOperation,
    };
  });

  const totalAssetValue = finalBalWithOperations.reduce((acc, x) => {
    const curAmount = x.price * parseFloat(x.amount);
    return acc + (isNaN(curAmount) ? 0 : curAmount);
  }, 0);

  if (signer === null || ethAddress === null) {
    return (
      <Text blockquote>
        Please{" "}
        <Link
          underline
          href="#"
          onClick={(e) => {
            e.preventDefault();
            connect();
          }}
          color
        >
          connect
        </Link>{" "}
        to a wallet to continue
      </Text>
    );
  }

  if (signer !== null && ethAddress !== null && !hasProxy) {
    if (isCreatingProxy) {
      return (
        <Text blockquote>
          <Loading />
        </Text>
      );
    }

    return (
      <Text blockquote>
        Please{" "}
        <Link
          underline
          href="#"
          onClick={(e) => {
            e.preventDefault();
            createProxy();
          }}
          color
        >
          create
        </Link>{" "}
        a smart wallet to continue
      </Text>
    );
  }

  return (
    <>
      <Grid.Container gap={2} justify="center" style={{ textAlign: "center" }}>
        <Grid xs={24} md={7}>
          <Card>
            <Text small>Net Worth</Text>
            <Text h3>
              {currency}
              {` `}
              {isRetrievingBal ? "..." : `${totalAssetValue.toFixed(4)}`}
            </Text>
          </Card>
        </Grid>
        <Grid xs={24} md={7}>
          <Card>
            <Text small>Assets</Text>
            <Text h3>
              {currency}
              {` `}
              {isRetrievingBal ? "..." : `${totalAssetValue.toFixed(4)}`}
            </Text>
          </Card>
        </Grid>
        <Grid xs={24} md={7}>
          <Card>
            <Text small>Debt</Text>
            <Text h3>
              {currency}
              {` `}0
            </Text>
          </Card>
        </Grid>
      </Grid.Container>

      <Spacer y={1} />
      <div style={{ width: "100%", height: "20px" }}>
        <div style={{ float: "right" }}>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Tooltip text={"Refresh balance"}>
            <RefreshIcon onClick={getBalances} size={18} />
          </Tooltip>
        </div>

        <Checkbox
          checked={showZeroBal}
          onChange={(e) => setShowZeroBal(e.target.checked)}
          style={{ float: "right" }}
          size="medium"
        >
          Show zero balances
        </Checkbox>
      </div>
      <Spacer y={0.5} />
      <div style={{ overflowX: "auto" }}>
        <Table data={finalBalWithOperations}>
          <Table.Column prop="label" label="Asset" />
          <Table.Column prop="price" label={`Price (${currency})`} />
          <Table.Column prop="amount" label="Amount" />
          <Table.Column prop="withdrawOperation" label="Withdraw" width={200} />
          <Table.Column prop="depositOperation" label="Deposit" width={200} />
        </Table>
      </div>
      <Button auto>Add</Button>
      <WithdrawDepositModal
        {...bindings}
        visible={visible}
        setVisible={setVisible}
        selectedRow={selectedRow}
      />
    </>
  );
};
