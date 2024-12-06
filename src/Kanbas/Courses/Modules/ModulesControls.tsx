import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import ModuleEditor from "./ModuleEditor";

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule
}: {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
}) {
  return (
    <div id="wd-modules-controls" className="d-flex justify-content-end gap-2">
      <button
        id="wd-collapse-all"
        className="btn btn-lg btn-secondary"
      >
        Collapse All
      </button>
      
      <button
        id="wd-view-progress"
        className="btn btn-lg btn-secondary"
      >
        View Progress
      </button>

      <div className="dropdown">
        <button
          id="wd-publish-all-btn"
          className="btn btn-lg btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <GreenCheckmark />
          Publish All
        </button>
        <ul className="dropdown-menu">
          <li>
            <a
              id="wd-publish-all-modules-and-items-btn"
              className="dropdown-item"
              href="#"
            >
              <GreenCheckmark />
              Publish all modules and items
            </a>
          </li>
          <li>
            <a
              id="wd-publish-modules-only-button"
              className="dropdown-item"
              href="#"
            >
              <GreenCheckmark />
              Publish modules only
            </a>
          </li>
          <li>
            <a
              id="wd-unpublish-all-modules-and-items"
              className="dropdown-item"
              href="#"
            >
              Unpublish all modules and items
            </a>
          </li>
          <li>
            <a
              id="wd-unpublish-modules-only"
              className="dropdown-item"
              href="#"
            >
              Unpublish modules only
            </a>
          </li>
        </ul>
      </div>

      <button
        className="btn btn-lg btn-danger"
        id="wd-add-module-btn"
        data-bs-toggle="modal"
        data-bs-target="#wd-add-module-dialog"
      >
        <FaPlus className="me-2" style={{ marginBottom: "2px" }} />
        Module
      </button>

      <ModuleEditor
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </div>
  );
}