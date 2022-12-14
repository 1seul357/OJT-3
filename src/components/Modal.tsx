import { useState, ChangeEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LocalStorage from "../utils/localStorage";
import "../css/modal.css";

export interface propType {
  setName: Function;
}

const Modal = ({ setName }: propType) => {
  const [textValue, setTextValue] = useState<String>("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };
  const onSubmit = () => {
    setName(true);
    LocalStorage.setItem("name", textValue);
  };

  return (
    <div className="modal">
      <div className="modalWrapper">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 5, width: "35ch" },
          }}
          noValidate
          autoComplete="off">
          <TextField
            label="Name"
            id="standard-size-normal"
            defaultValue="Normal"
            variant="standard"
            value={textValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          />
        </Box>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off">
          <Button
            color="warning"
            variant="outlined"
            size="large"
            onClick={onSubmit}>
            submit
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Modal;
