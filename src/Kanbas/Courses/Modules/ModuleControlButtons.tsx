import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlusLg } from "react-icons/bs";
import { FaTrash, FaPencilAlt } from "react-icons/fa"; 
import GreenCheckmark from "./GreenCheckmark";

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
  isFaculty,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
  isFaculty: boolean; 
}) {
  return (
    <div className="float-end">
      {isFaculty && (
        <>
          <FaPencilAlt
            onClick={() => editModule(moduleId)}
            className="text-primary me-3 cursor-pointer"
            title="Edit Module"
          />
          <FaTrash
            onClick={() => deleteModule(moduleId)}
            className="text-danger me-2 cursor-pointer"
            title="Delete Module"
          />
        </>
      )}
      <GreenCheckmark />
      <BsPlusLg className="me-2 cursor-pointer" title="Add Lesson" />
      <IoEllipsisVertical className="fs-4 cursor-pointer" title="More Options" />
    </div>
  );
}
