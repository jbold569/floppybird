import "./Game.css"
import React, { ReactElement } from 'react';
import Bird, { BirdComponent } from './Bird';
import Land from './Land';
import PipeManager from './Pipe';
import { GameState, wait } from '../Utils'


interface GameReactState {
  gameState: GameState;
  pipes: Array<ReactElement>;
}

class Game extends React.Component<any, GameReactState> {
  protected flyAreaRef: any;
  protected gameLoop: any;
  protected player: Bird;
  protected pipeManager: PipeManager;

  constructor(props: any) {
    super(props);

    let flightProperties = {
      gravity: 0.25,
      jumpVelocity: -4.6,
      flightAreaBox: { x: 0, y: 0, width: 360, height: 420 },
    };

    this.state = { 
      gameState: GameState.SplashScreen,
      pipes: [],
    }
    this.flyAreaRef = React.createRef();
    this.player = new Bird(flightProperties);
    this.pipeManager = new PipeManager(100);
    this.handleEvent = this.handleEvent.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    const flyArea = document.getElementById("flyarea")?.getBoundingClientRect();
    const height = flyArea?.height || 420;

    this.pipeManager = new PipeManager(height || 100);
    this.player.setFlyingProperties(flyArea || { x: 0, y: 0, width: 360, height: 420 });
    requestAnimationFrame(this.update);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.gameLoop);
  }

  public handleEvent(ev: any) {
    if (ev.key !== " ") {
      return;
    }


    // TODO: Move to the Bird Component
    if (this.state.gameState === GameState.SplashScreen) {
      this.start();
    } else if (this.state.gameState === GameState.Playing) {
      this.player.jump();
    } else if (this.state.gameState === GameState.ScoreScreen) {
      // this.replay;
    }
  }

  // public onScreenTouch() {
  //   if (this.state === GameState.SplashScreen) {
  //     this.start();
  //   } else if (this.state === GameState.Playing) {
  //     this.bird.jump();
  //   }
  // }

  public start() {
    this.setState({ gameState: GameState.Playing });
  }


  public async die() {
    this.setState({ gameState: GameState.PlayerDying });
    //clearAnimationFrame(this.gameLoop);

    // Find everything that's animated and stop it.
    Array.from(document.getElementsByClassName('animated')).forEach(e => {
      (e as HTMLElement).style.animationPlayState = 'paused';
      (e as HTMLElement).style.webkitAnimationPlayState = 'paused';
    });

    this.player.die();

    await wait(500);

    // sounds.swoosh.play();
    this.setState({ gameState: GameState.ScoreScreen });

  }

  protected update() {
    if ( this.pipeManager.getPipes().some(
      (pipe) => {
        return pipe.intersectsWith(this.player.box); //|| this.land.intersectsWith(this.player.box)) {
      }
    )) {
      this.die();
    }
    if (this.state.gameState == GameState.Playing) {
      this.pipeManager.update(Date.now());
      this.setState({
        pipes: this.pipeManager.getPipes().map((pipe) => pipe.element)
      });
    }
    this.gameLoop = requestAnimationFrame(this.update)
  }

  render() {
    return (
      <>
        <div tabIndex={0} id="gamecontainer" onKeyPress={this.handleEvent}>
          <div id="gamescreen">
            <div id="sky" className="animated">
              <div id="flyarea" ref={this.flyAreaRef}>
                <div id="ceiling" className="animated"></div>
                {/* This is the flying and pipe area container */}
                <BirdComponent
                  gameState={this.state.gameState}
                  position={this.player.getPosition()}
                  rotation={this.player.getRotation()}
                />

                <div id="bigscore"></div>

                <div id="splash"></div>

                <div id="scoreboard">
                  <div id="medal"></div>
                  <div id="currentscore"></div>
                  <div id="highscore"></div>
                  <div id="replay"><img src="assets/replay.png" alt="replay" /></div>
                </div>

                {this.state.pipes}
              </div>
            </div>
          </div>
          <Land />
        </div>
      </>
    );
  }
}

export default Game;