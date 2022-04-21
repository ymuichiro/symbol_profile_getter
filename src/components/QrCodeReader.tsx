import Modal from "@mui/material/Modal/Modal";
import Typography from "@mui/material/Typography/Typography";
import QrReader from "react-qr-reader";
import { useRecoilState } from "recoil";
import { QRCodeType } from "symbol-qr-library";
import { QRJson } from "../models/QrJson";
import { AccountStore, MyAccountStore } from "../store/Account";

type Props = {
  isOwn: "my" | "you";
  isRunQrReader: boolean;
  setIsRunQrReader: React.Dispatch<React.SetStateAction<boolean>>;
};

export function QrCodeReader(props: Props) {
  const [state, setState] = useRecoilState(AccountStore);
  const [myState, setMyState] = useRecoilState(MyAccountStore);

  const handleClose = () => {
    props.setIsRunQrReader(false);
  };

  const onReadQr = (result: string | null) => {

    if (result !== null && result !== undefined) {
      const json = JSON.parse(result) as QRJson;
      if (json.type === QRCodeType.ExportAddress) {
        if (props.isOwn === "my") {
          console.log("my", json);
          setMyState({ ...myState, address: json.data.address });
          handleClose();
        } else {
          console.log("you", json);
          setState({ ...state, ...json.data });
          handleClose();
        }
      } else {
        alert("読み取ったQRコードの形式が正しくありません。アドレス用のQRコードを表示してください");
        handleClose();
        return;
      }
    }
  };

  return <Modal open={props.isRunQrReader} onClose={handleClose}>
    <div onClick={handleClose} style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div>
        <Typography variant="h5" align="center" color="white">
          Symbolのアドレス用QRコードを読み取ってください
        </Typography>
        <QrReader onScan={onReadQr} onError={console.error} />
      </div>
    </div>
  </Modal>;

}