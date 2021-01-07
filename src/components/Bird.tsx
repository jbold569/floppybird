import { playerBoundingBox, BoundingBox, GameState, toRad } from '../Utils'

interface FlyingProperties {
  gravity: number;
  jumpVelocity: number;
  flightAreaBox: BoundingBox;
}

interface BirdReactState {
  gameState: GameState;
  position: number;
  rotation: number;
}

export function BirdComponent(props: BirdReactState) {
  let bird;

  if (props.gameState == GameState.Playing) {
    const aliveStyle = {
      transform: "translate3d(0px," + props.position + "px, 0px)" +
        "rotate3d(0, 0, 1, " + props.rotation + "deg)",
    };
    bird = <div id="player" className="bird animated" style={aliveStyle}></div>;
  }
  if (props.gameState == GameState.PlayerDying) {
    // TODO: add the death animation somehow, react transitions?
    const deadStyle = {
      transform: "translate3d(0px," + props.position + "px, 0px)" +
        "rotate3d(0, 0, 1, " + props.rotation + "deg)",
    };
    bird = <div id="player" className="bird animated" style={deadStyle}></div>;
  }
  return (
    <>
      {bird}
    </>
  )
}

class Bird {
  protected flyingProperties: FlyingProperties;
  protected width = 34;
  protected height = 24;
  protected velocity = 0;
  protected position = 180;
  protected rotation = 0;
  public box: BoundingBox = playerBoundingBox;

  constructor(props: FlyingProperties) {
    this.flyingProperties = props;
    this.jump = this.jump.bind(this);
  }

  public setFlyingProperties(flyArea: BoundingBox) { this.flyingProperties.flightAreaBox = flyArea}

  public getPosition() { return this.position; }
  public getRotation() { return this.rotation; }

  public update() {
    this.velocity += this.flyingProperties.gravity;
    this.rotation = Math.min((this.velocity / 10) * 90, 90);
    this.position += this.velocity;

    // Clip us back in
    if (this.position < 0) {
      this.position = 0;
    }

    if (this.position > this.flyingProperties.flightAreaBox.height) {
      this.position = this.flyingProperties.flightAreaBox.height;
    }


    // We draw our bounding box around the bird through a couple steps. Our
    // rotation of the bird is done through the center. So if we've rotated
    // the bird 90 degrees (facing down), our bird becomes 5 px closer to
    // the top and 5 px further from the left -- because it's 10 px wider
    // than it is tall. To make this easier, we first calculate the height
    // and width of our bird and then calculate its x,y based on that.
    const rotationInRadians = Math.abs(toRad(this.rotation));
    const widthMultiplier = this.height - this.width; // 24 - 34 = -10
    const heightMultiplier = this.width - this.height; // 34 - 24 = 10

    this.box.width = this.width + (widthMultiplier * Math.sin(rotationInRadians));
    this.box.height = this.height + (heightMultiplier * Math.sin(rotationInRadians));

    const xShift = (this.width - this.box.width) / 2;
    const yShift = (this.height - this.box.height) / 2;

    // We're 60 away from the left (magic number), + x shift
    this.box.x = 60 + xShift;
    // And we're our current bird position from the top + y shift + the
    // distance to the top of the window, because of the sky
    this.box.y = this.position + yShift + this.flyingProperties.flightAreaBox.y;
  }

  public jump() {
    this.velocity = this.flyingProperties.jumpVelocity;
    // sounds.jump.play();
  }

  public die() {


    // this.element.style.transition = `

    // `;
    this.position = this.flyingProperties.flightAreaBox.height - this.height;
    this.rotation = 90;
   
    // sounds.hit.play();
    // await wait(500);
    // sounds.die.play();
    // await wait(500);
    // this.domElement.style.transition = '';
  }

  // public draw() {
  //     // drawDebugBox(this.element, this.box);
  // }
}
export default Bird;