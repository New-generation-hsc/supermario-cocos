import { EventKeyboard, KeyCode } from "cc";
import StateBase, { DirectionType } from "./StateBase";


export default class RunState extends StateBase {
    protected _direction: DirectionType = DirectionType.DIRECTION_RIGHT;

    onKeyDown(event: EventKeyboard): void {
        const move_jump = this._mgr.isPressJump(event);
        if(move_jump) {
            this._mgr.switchJump();
        }

        const press_right = this._mgr.isPressRight(event);
        const press_left = this._mgr.isPressLeft(event);

        if(press_right && press_left) {
            if(this._direction == DirectionType.DIRECTION_RIGHT) {
                this._mgr.switchTurn(DirectionType.DIRECTION_LEFT);
            } else if(this._direction == DirectionType.DIRECTION_LEFT) {
                this._mgr.switchTurn(DirectionType.DIRECTION_RIGHT);
            }
        }
    }

    onKeyUp(event: EventKeyboard): void {
        const release_right = this._mgr.isReleaseRight(event);
        const release_left = this._mgr.isReleaseLeft(event);

        if(release_right) {
            this._mgr.switchSlide(DirectionType.DIRECTION_RIGHT);
        } else if(release_left) {
            this._mgr.switchSlide(DirectionType.DIRECTION_LEFT);
        }
    }

    update(deltaTime: number) {
        
    }

    run(direction: DirectionType) {
        this._direction = direction;
    }

    getName(): string {
        const dir_string = this._direction == DirectionType.DIRECTION_RIGHT ? "right" : "left";
        return dir_string + "_run";
    }

    getDirection() {
        return this._direction;
    }
}

