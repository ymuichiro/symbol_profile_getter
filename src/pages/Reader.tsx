import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { QrCodeReader } from "../components/QrCodeReader";
import { useRecoilState } from "recoil";
import { AccountStore, MyAccountStore } from "../store/Account";
import Node from "../infrastructure/node";
import { NetworkType } from "symbol-sdk";
import { SystemError } from "../infrastructure/error";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Typography from "@mui/material/Typography/Typography";
import AccountScripts from "../infrastructure/account";
import Grid from "@mui/material/Grid/Grid";
import Card from "@mui/material/Card/Card";
import CardContent from "@mui/material/CardContent/CardContent";
import CardHeader from "@mui/material/CardHeader/CardHeader";

const LOCALA_STRAGE_KEY_OWNER_ADDRESS = "LOCALA_STRAGE_KEY_OWNER_ADDRESS";

/**
 * QRコードリーダーの読み込みを行う
 */
export function Reader(): JSX.Element {
  const [isOwn, setIsOwn] = useState<"my" | "you">("my");
  const [isRunQrReader, setIsRunQrReader] = useState<boolean>(false);
  const [node, setNode] = useState<string>("");
  const [state, setState] = useRecoilState(AccountStore);
  const [myState, setMyState] = useRecoilState(MyAccountStore);
  const [isDelegater, setIsDelegater] = useState<boolean>(false);

  const handleLoadNode = async () => {
    try {
      setNode((await Node.getRandomNode(NetworkType.MAIN_NET)).url);
    } catch (e) {
      alert((e as SystemError).viewMessage);
    }
  };

  const handleLoadOwnerInfo = () => {
    const ownerAddress = localStorage.getItem(LOCALA_STRAGE_KEY_OWNER_ADDRESS);
    if (ownerAddress !== null) {
      setMyState({ ...myState, address: ownerAddress });
      onLoadSymbolAddress();
    }
  };

  const onClickMyQrReadStart = () => {
    setIsOwn("my");
    setIsRunQrReader(true);
  };

  const onClickYouQrReadStart = () => {
    setIsOwn("you");
    setIsRunQrReader(true);
  };

  const onLoadSymbolAddress = async () => {

    // delegeteNodeを取得
    if (myState.address !== "" && myState.address !== "---") {
      localStorage.setItem(LOCALA_STRAGE_KEY_OWNER_ADDRESS, myState.address);
      const accountInfo = await AccountScripts.createAccountInfoFromAddress(node, myState.address);
      const nodeUrl = await fetch(`https://symbol.services/nodes/nodePublicKey/${accountInfo.account.supplementalPublicKeys.node.publicKey}`);
      const json = await nodeUrl.json();
      setMyState({ ...myState, delegateNode: json.apiStatus.restGatewayUrl });
      if (state.delegateNode !== "") {
        setIsDelegater(json.apiStatus.restGatewayUrl === state.delegateNode);
      }
    }

    if (state.address !== "" && state.address !== "---") {
      const accountInfo = await AccountScripts.createAccountInfoFromAddress(node, state.address);
      const mosaics = await AccountScripts.getBalanceFromAddress(state.address, node);
      const nodeUrl = await fetch(`https://symbol.services/nodes/nodePublicKey/${accountInfo.account.supplementalPublicKeys.node.publicKey}`);
      const json = await nodeUrl.json();
      setState({
        ...state,
        delegateNode: json.apiStatus.restGatewayUrl,
        importance: accountInfo.account.importance,
        mosaics: mosaics,
      });
      if (myState.delegateNode !== "") {
        setIsDelegater(json.apiStatus.restGatewayUrl === myState.delegateNode);
      }
    }

  };

  useEffect(() => {
    handleLoadOwnerInfo();
    handleLoadNode();
  }, []);

  useEffect(() => {
    onLoadSymbolAddress();
  }, [isRunQrReader]);

  return <div style={{ width: "100%", alignItems: "center" }}>
    {isRunQrReader && <QrCodeReader isOwn={isOwn} isRunQrReader={isRunQrReader} setIsRunQrReader={setIsRunQrReader} />}
    <Container maxWidth="md">
      {
        node === ""
          ? <div style={{ height: "80vh", width: "100vw", display: "flex", justifyContent: "center", alignContent: "center" }}>
            <div>
              <Typography variant="body1" color="gray">読み込み中...</Typography>
              <CircularProgress />
            </div>
          </div>
          :
          <Grid container direction="row" spacing={3} style={{ marginTop: "10px" }}>
            <Grid item xs={12}>
              <Typography variant="h4" align="center">委任チェッカー</Typography>
            </Grid>
            <Grid item xs={12}>
              <Card style={{ height: "100%" }}>
                <CardHeader title={"あなたの情報"} style={{ textAlign: "center" }} />
                <CardContent>
                  <Typography variant="h6">アドレス</Typography>
                  <Typography variant="body2">{myState.address}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h6">ノードURL</Typography>
                  <Typography variant="body2">{myState.delegateNode}</Typography>
                </CardContent>
                <CardContent>
                  <Button onClick={onClickMyQrReadStart} fullWidth variant="contained">自分のアドレスQRを読込</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card style={{ height: "100%" }}>
                <CardHeader title={"相手の情報"} style={{ textAlign: "center" }} />
                <CardContent>
                  <Typography variant="h6">アドレス</Typography>
                  <Typography variant="body2">{state.address}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h6">ノードURL</Typography>
                  <Typography variant="body2">{state.delegateNode}</Typography>
                  <Typography variant="body2">{state.address !== "---" ? (isDelegater ? "OK" : "NG") : ""}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h6">保有MOSAIC</Typography>
                  {state.mosaics.map(e => <Typography variant="body2">{e.id + " : " + e.amount}</Typography>)}
                </CardContent>
                <CardContent></CardContent>
                <CardContent>
                  <Button onClick={onClickYouQrReadStart} fullWidth variant="contained">相手のアドレスQRを読込</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      }
    </Container>
  </div>;
}
