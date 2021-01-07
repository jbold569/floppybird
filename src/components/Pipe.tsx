import { ReactElement } from "react";
import { log, BoundingBox, isBoxIntersecting } from "../Utils";

class Pipe {

  public element: ReactElement;
  protected id
  protected upperPipeElement: ReactElement;
  protected upperRef: any;
  protected lowerRef: any;
  protected lowerPipeElement: ReactElement;
  protected upperBox: BoundingBox = { x: 0, y: 0, width: 0, height: 0 };
  protected lowerBox: BoundingBox = { x: 0, y: 0, width: 0, height: 0 };

  constructor(pipeHeight: number, flyArea: number) {
    this.id = "pipe" + Math.floor(Math.random()*1000);
    const padding = 80;
    const constraint = flyArea - pipeHeight - (padding * 2);
    log(constraint);
    const topHeight = Math.floor((Math.random()*constraint) + padding)
    const bottomHeight = (flyArea - pipeHeight) - topHeight
    const upperPipeElement = <div className="pipe_upper" style={{height: topHeight + "px"}}></div>;
    const lowerPipeElement = <div className="pipe_lower" style={{height: bottomHeight + "px"}}></div>;
    this.element = (
      <div id={this.id} className="pipe animated">
        {upperPipeElement}
        {lowerPipeElement}
      </div>);
  }

  public isOffScreen() {
    return this.upperBox.x <= -100;
  }

  public update() {
    this.upperBox = document.getElementById(this.id)
      ?.getElementsByClassName("pipe_upper")[0].getBoundingClientRect() ||
      this.upperBox;
    this.lowerBox = document.getElementById(this.id)
      ?.getElementsByClassName("pipe_lower")[0].getBoundingClientRect() ||
      this.lowerBox;
    // TODO: This should be in draw not tick. Find a way to move it after.
    // drawDebugBox(this.upperPipeElement, this.upperBox);
    // drawDebugBox(this.lowerPipeElement, this.lowerBox);
  }

  public intersectsWith(box: BoundingBox) {
    return isBoxIntersecting(this.upperBox, box) || isBoxIntersecting(this.lowerBox, box);
  }
}

class PipeManager {
  protected flyArea;
  protected pipeHeight = 90;
  protected pipeDelay = 1400;
  protected lastPipeInsertedTimestamp = 0;
  public pipes: Pipe[] = [];

  constructor(flyArea: number) {
    this.flyArea = flyArea
  }

  public setFlyArea(flyArea: number) { this.flyArea = flyArea;}

  public getPipes() {
    return this.pipes;
  }

  public update(now: number) {
    this.pipes.forEach(pipe => pipe.update());

    if (now - this.lastPipeInsertedTimestamp < this.pipeDelay) {
      // Wait a little longer... we don't need to do this too often.
      return;
    }

    // Insert a new pipe and then prune all the pipes that have gone
    // entirely off the screen
    log('inserting pipe after', now - this.lastPipeInsertedTimestamp, 'ms');
    this.lastPipeInsertedTimestamp = now;
    const pipe = new Pipe(this.flyArea, this.pipeHeight);
    this.pipes.push(pipe);
    // this.pipeAreaDomElement.appendChild(pipe.domElement);

    this.pipes = this.pipes.filter(pipe => {
      if (pipe.isOffScreen()) {
        log('pruning a pipe');
        return false;
      }
      return true;
    });
  }

  public intersectsWith(box: BoundingBox) {
    return this.pipes.find(pipe => pipe.intersectsWith(box)) != null;
  }
}

export default PipeManager;