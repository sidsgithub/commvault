import React, { Fragment, useState } from "react";
import List from "./list";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import Form from "../common/form/form";
import {NotificationContainer} from 'react-notifications';

const Home = () => {
  const [modal, openModal] = useState(false);
  const [triggerList, setTriggerList] = useState(false);
  return (
    <Fragment>
      <Button variant="contained" onClick={() => openModal(true)} className="add-server-btn">
        Add New Server
      </Button>
      <List triggerList={triggerList} setTriggerList={setTriggerList} />
      <Modal
        open={modal}
        onClose={() => openModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Form
          openModal={openModal}
          triggerList={triggerList}
          setTriggerList={setTriggerList}
        />
      </Modal>
      <NotificationContainer/>
    </Fragment>
  );
};

export default Home;
