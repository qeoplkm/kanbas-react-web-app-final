import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";

export default function CoursesNavigation() {
  const { cid } = useParams();
  const { pathname } = useLocation();
  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Assignments",
    "Quizzes",
    "Grades",
    "People"
  ];

  return (
    <div 
      id="wd-courses-navigation" 
      className="list-group fs-5"
      style={{ 
        marginLeft: "20px",
        backgroundColor: "white",
        width: "150px"
      }}
    >
      {links.map((link) => {
        const url = `/Kanbas/Courses/${cid}/${link}`;
        const isActive = pathname.endsWith(`/${link}`) || pathname.includes(`/${link}/`);

        return (
          <Link
            key={link}
            to={url}
            id={`wd-course-${link.toLowerCase()}-link`}
            className={`list-group-item border-0 ps-3 ${
              isActive ? "text-dark fw-bold" : "text-danger"
            }`}
            style={{
              textDecoration: "none",
              backgroundColor: "white"
            }}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}