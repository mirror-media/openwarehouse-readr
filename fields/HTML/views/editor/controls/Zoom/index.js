import React, { useState } from "react";
import "./Zoom.style.css";

function Zoom() {
  const zoomHandler = (event) => {
    event.preventDefault();
    const editorFieldContainer =
      event.target.parentElement.parentElement.parentElement;
    editorFieldContainer.classList.toggle("fieldContainer-zoom-in");
  };

  return (
    <div className="zoomBtnContainer">
      <div
        className="Button Button--hollow-primary DraftEditor-expandButton zoomBtn"
        onClick={(event) => zoomHandler(event)}
      ></div>
      <i className="fa fa-expand zoomBtnIcon"></i>
    </div>
  );
}

export default Zoom;
