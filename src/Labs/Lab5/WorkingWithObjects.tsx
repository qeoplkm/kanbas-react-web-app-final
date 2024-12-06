// WorkingWithObjects.jsx
import React, { useState } from "react";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [module, setModule] = useState({
    id: "M101",
    name: "Introduction to NodeJS",
    description: "Basics of NodeJS and ExpressJS",
    course: "CS101",
  });

  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      <h4>Assignment Operations</h4>

      <div className="mb-3">
        <a
          id="wd-update-assignment-title"
          className="btn btn-primary float-end"
          href={`${ASSIGNMENT_API_URL}/title/${encodeURIComponent(
            assignment.title
          )}`}
        >
          Update Title
        </a>
        <input
          className="form-control w-75"
          id="wd-assignment-title"
          value={assignment.title}
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <a
          id="wd-update-assignment-score"
          className="btn btn-primary float-end"
          href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
        >
          Update Score
        </a>
        <input
          type="number"
          className="form-control w-75"
          id="wd-assignment-score"
          value={assignment.score}
          onChange={(e) =>
            setAssignment({ ...assignment, score: parseInt(e.target.value) })
          }
        />
      </div>

      <div className="mb-3">
        <a
          id="wd-update-assignment-completed"
          className="btn btn-primary float-end"
          href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
        >
          Update Completed
        </a>
        <input
          type="checkbox"
          className="form-check-input"
          id="wd-assignment-completed"
          checked={assignment.completed}
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })
          }
        />
      </div>

      <hr />

      <h4>Retrieving Assignment</h4>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${ASSIGNMENT_API_URL}`}
      >
        Get Assignment
      </a>
      <hr />

      <h4>Retrieving Assignment Title</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${ASSIGNMENT_API_URL}/title`}
      >
        Get Title
      </a>
      <hr />

      <h4>Module Operations</h4>

      <div className="mb-3">
        <a
          id="wd-update-module-name"
          className="btn btn-primary float-end"
          href={`${MODULE_API_URL}/name/${encodeURIComponent(module.name)}`}
        >
          Update Module Name
        </a>
        <input
          className="form-control w-75"
          id="wd-module-name"
          value={module.name}
          onChange={(e) =>
            setModule({ ...module, name: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <a
          id="wd-update-module-description"
          className="btn btn-primary float-end"
          href={`${MODULE_API_URL}/description/${encodeURIComponent(
            module.description
          )}`}
        >
          Update Module Description
        </a>
        <input
          className="form-control w-75"
          id="wd-module-description"
          value={module.description}
          onChange={(e) =>
            setModule({ ...module, description: e.target.value })
          }
        />
      </div>

      <hr />

      <h4>Retrieving Module</h4>
      <a
        id="wd-retrieve-module"
        className="btn btn-primary"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>
      <hr />

      <h4>Retrieving Module Name</h4>
      <a
        id="wd-retrieve-module-name"
        className="btn btn-primary"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>
      <hr />
    </div>
  );
}
