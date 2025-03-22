import { EventKeyboard } from "cc";
import StateBase, { DirectionType, SPEED_THRESHOLD } from "./StateBase";

export default class SlideState extends StateBase {
    protected _direction: DirectionType = DirectionType.DIRECTION_RIGHT;

    onKeyDown(event: EventKeyboard): void {
        const move_jump = this._mgr.isPressJump(event);
        if(move_jump) {
            this._mgr.switchJump();
        }
    }

    onKeyUp(event: EventKeyboard): void {

    }

    update(deltaTime: number) {
        const lv = this._mgr.getLinearVelocity();
        const x_speed = Math.abs(lv.x);

        if(x_speed < SPEED_THRESHOLD) {
            this._mgr.switchHorizontalIdle();
        }
    }

    slide(direction: DirectionType) {
        this._direction = direction;
    }

    getName(): string {
        const dir_string = this._direction == DirectionType.DIRECTION_RIGHT ? "right" : "left";
        return dir_string + "_slide";
    }

    getDirection() {
        return this._direction;
    }
}

