import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { operatingSystem } from "../../features/utils";
import axios from "axios";
import _ from 'lodash';
import { NotificationManager} from 'react-notifications';

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fitContent",
  height: "400px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Form = (props) => {
  const { openModal, triggerList, setTriggerList, updateForm, data } = props;
  const [values, setValues] = useState({
    id: _.get(data, 'id',Math.floor(Math.random() * 1000 + 1)),
    name: _.get(data,'name', ""),
    ipAddress: _.get(data,'ipAddress', ""),
    operatingSystem: _.get(data,'operatingSystem', ""),
    softwareVersion: _.get(data,'softwareVersion', "")
  });

  const onSubmitHandler = () => {
    if (updateForm) {
      axios
        .put(`http://localhost:3000/fileServers/${data.id}`, values)
        .then((res) => {
            NotificationManager.success('Servers Updated', 'Success');
          openModal(false);
          setTriggerList(!triggerList);
        })
        .catch(function (error) {
            NotificationManager.error('Something went wrong', 'Error', 5000, () => {
                alert('callback');
              });
        });
    } else {
      axios
        .post("http://localhost:3000/fileServers", values)
        .then((res) => {
            NotificationManager.success('Server created', 'Success');
          openModal(false);
          setTriggerList(!triggerList);
        })
        .catch(function (error) {
            console.log(error);
            NotificationManager.error('Something went wrong', 'Error', 5000, () => {
                alert('callback');
              });
        });
    }
  };

  return (
    <Box sx={style} component="form" autoComplete="off" noValidate>
      <TextField
        id="outlined-basic"
        label="Name"
        variant="outlined"
        name="name"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
      />
      <TextField
        id="outlined-basic"
        label="Ip Address"
        variant="outlined"
        name="ipAddress"
        value={values.ipAddress}
        onChange={(e) => setValues({ ...values, ipAddress: e.target.value })}
      />
      <TextField
        select
        name="operatingSystem"
        value={values.operatingSystem}
        onChange={(e) =>
          setValues({ ...values, operatingSystem: e.target.value })
        }
        id="outlined-basic"
        variant="outlined"
        label="Operating System"
        fullWidth
      >
        {operatingSystem.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="softwareVersion"
        id="outlined-basic"
        label="Software Version"
        variant="outlined"
        value={values.softwareVersion}
        onChange={(e) =>
          setValues({ ...values, softwareVersion: e.target.value })
        }
      />
      <Button variant="text" onClick={onSubmitHandler}>
        Submit
      </Button>
    </Box>
  );
};

export default Form;
