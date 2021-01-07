import React from "react";
import { BoundingBox, isBoxIntersecting } from "../Utils";

class Land extends React.Component<any, any>{
  public box: BoundingBox;

  componentDidMount() {
    const box = document.getElementById("land")?.getBoundingClientRect();
    this.box = box || {x:0, y:0, width:360, height:360};
  }

  render() {
    return (
      <>
        <div id="land" className="animated"></div>
      </>
    )
  }

  public intersectsWith(box: BoundingBox) {
    return isBoxIntersecting(this.box, box);
  }
}

export default Land;