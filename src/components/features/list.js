import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { TableContainer, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { operatingSystem } from "./utils";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Form from "../common/form/form";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { NotificationManager} from 'react-notifications';

const List = (props) => {
  const { triggerList, setTriggerList } = props;
  const [rows, setRows] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [serverName, setServerName] = useState();
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState();

  // pagination on change handler
  const handlePaginationOnChange = (event, value) => {
    if (value) {
      setPage(value);
    }
  };

  const deleteHandler = () => {
    if (serverName === selectedRow.name) {
      axios
        .delete(`http://localhost:3000/fileServers/${selectedRow.id}`)
        .then((res) => {
            NotificationManager.success('Server deleted', 'Success');
          setDeleteModal(false);
          setTriggerList(!triggerList);
        })
        .catch(function (error) {
            NotificationManager.error('Something went wrong', 'Error', 5000, () => {
                alert('callback');
              });
        });
    } else {
      setError(true);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // calling the get servers api
  useEffect(() => {
    axios.get("http://localhost:3000/fileServers").then((res) => {
      setRows(res.data);
      setCount(res.data.length);
    });
  }, [triggerList]);

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">IP Address</TableCell>
              <TableCell align="right">Operating systems</TableCell>
              <TableCell align="right">Software versions</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.length > 0 &&
              rows.slice((page - 1) * 10, page * 10).map((rw) => (
                <TableRow
                  key={rw.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link to={`details/${rw.id}`} className="link" >{rw.name}</Link>
                  </TableCell>
                  <TableCell align="right">{rw.ipAddress}</TableCell>
                  <TableCell align="right">
                    {
                      operatingSystem.find(
                        (os) => os.value === rw.operatingSystem
                      ).label
                    }
                  </TableCell>
                  <TableCell align="right">{rw.softwareVersion}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="success"
                      variant="text"
                      onClick={() => {
                        setUpdateModal(true);
                        setSelectedRow(rw);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => {
                        setDeleteModal(true);
                        setSelectedRow(rw);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

          {selectedRow && (
            <Modal
              open={updateModal}
              onClose={() => setUpdateModal(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Form
                updateForm
                openModal={setUpdateModal}
                data={selectedRow}
                triggerList={triggerList}
                setTriggerList={setTriggerList}
              />
            </Modal>
          )}
          <Modal
            open={deleteModal}
            onClose={() => setDeleteModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h3">
                Do you want to delete the server ( Please type the server name
                to proceed ) ?
              </Typography>
              <br />
              <TextField
                error={error}
                helperText={error ? "Invalid Entry" : ""}
                fullWidth
                id="outlined-basic"
                variant="outlined"
                name="name"
                onChange={(e) => setServerName(e.target.value)}
              />
              <br />
              <Button color="error" variant="text" onClick={deleteHandler}>
                Delete
              </Button>
            </Box>
          </Modal>
        </Table>
      </TableContainer>
      <Pagination
      className="pagination"
        count={Math.ceil(count / 10)}
        onChange={handlePaginationOnChange}
        page={page}
        variant="outlined"
      />
    </Fragment>
  );
};

export default List;
