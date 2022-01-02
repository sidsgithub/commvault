import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { operatingSystem } from "../features/utils";
import * as moment from "moment";
import OutlinedCard from "../common/card/card";
import _ from "lodash";
import { Link } from "react-router-dom";
import { NotificationManager} from 'react-notifications';

const DetailsPage = () => {
  let params = useParams();
  const [jobs, setJobs] = useState();
  const [servers, setServers] = useState();
  const [backup, setBackup] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/jobs?fileServerId=${params.serverId}`)
      .then((res) => {
        setJobs(res.data);
      }).catch(function (error) {
        NotificationManager.error('Something went wrong', 'Error', 5000, () => {
            alert('callback');
          });
    });;

    axios
      .get(`http://localhost:3000/fileServers/${params.serverId}`)
      .then((res) => {
        setServers(res.data);
      }).catch(function (error) {
        NotificationManager.error('Something went wrong', 'Error', 5000, () => {
            alert('callback');
          });
    });;
  }, [params.serverId]);

  useEffect(() => {
    function getBackupDetails() {
      let details = {};
      if (jobs) {
        const firstCompletedJob = jobs.find((j) => j.status === "Completed");
        const allCompletedJobs = jobs.filter((j) => j.status === "Completed");
        if (firstCompletedJob) {
          details = {
            ...details,
            isProtected: true,
            lastBackupTime: moment(firstCompletedJob.endTime).format("LLL"),
          };
        }
        if (allCompletedJobs && allCompletedJobs.length > 0) {
          const sumEndTime = allCompletedJobs
            .map((cj) => cj.endTime)
            .reduce((a, b) => a + b);
          const sumStartTime = allCompletedJobs
            .map((cj) => cj.startTime)
            .reduce((a, b) => a + b);
          const averageTimeTaken =
            (sumEndTime - sumStartTime) / allCompletedJobs.length;
          details = {
            ...details,
            averageTimeTaken: (averageTimeTaken / 60).toFixed(2),
          };
        }
        return details;
      }
    }
    setBackup(getBackupDetails());
  }, [jobs]);

  const getServerData = () => {
    return [
      { label: "Server Name ", value: _.get(servers, "name") },
      {
        label: "Operating System",
        value: operatingSystem.find(
          (el) => el.value === servers.operatingSystem
        ).label,
      },
      { label: "software Version", value: servers.softwareVersion },
      { label: "IP Address", value: servers.ipAddress },
    ];
  };

  const getBackupDetail = () => {
    return [
      { label: "Is Protected", value: backup.isProtected ? "Yes" : "No" },
      { label: "Last Backup Time", value: backup.isProtected ? _.get(backup, "lastBackupTime") : null },
      {
        label: "Average Time Taken",
        value: backup.isProtected ? `${_.get(backup, "averageTimeTaken")} seconds` : null,
      },
    ];
  };

  return (
    <div>
      <Link to={"/"} className="link">{`<--- Back`}</Link>
      <div className="card-container">
        {servers && (
          <OutlinedCard
            title={"File Server Details :"}
            data={getServerData()}
          />
        )}
        {backup && backup !== {} && (
          <OutlinedCard title={"Backup Details :"} data={getBackupDetail()} />
        )}
      </div>

      <br />
      <div className="job-details">
        {jobs && jobs.length > 0 && <h2>Job Details:</h2>}
        {jobs &&
          jobs.length > 0 &&
          jobs.map((j, key) => (
            <div key={j.id} id={key}>
              <div>
                <span className="jpb-details-label">Id:</span> {j.id}
              </div>
              <div>
                <span className="jpb-details-label">Status:</span> {j.status}
              </div>
              <div>
                <span className="jpb-details-label">Start Time:</span>{" "}
                {moment(j.startTime).format("LLL")}
              </div>
              {j.endTime ? (
                <div>
                  <span className="jpb-details-label">End Time:</span>{" "}
                  {moment(j.endTime).format("LLL")}
                </div>
              ) : (
                ""
              )}
              {j.endTime ? (
                <div>
                  <span className="jpb-details-label">Time Taken:</span>{" "}
                  {((j.endTime - j.startTime) / 60).toFixed(2)} seconds
                </div>
              ) : (
                ""
              )}
              <br />
            </div>
          ))}
      </div>
    </div>
  );
};

export default DetailsPage;
