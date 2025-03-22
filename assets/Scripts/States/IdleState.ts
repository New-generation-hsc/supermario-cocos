import { EventKeyboard, KeyCode } from "cc";
import StateBase, { DirectionType } from "./StateBase";

export default class IdleState extends StateBase {
    onKeyDown(event: EventKeyboard): void {
        const move_right = this._mgr.isPressRight(event);
        const move_left = this._mgr.isPressLeft(event);

        if(move_right) {
            this._mgr.switchRun(DirectionType.DIRECTION_RIGHT);
        } else if(move_left) {
            this._mgr.switchRun(DirectionType.DIRECTION_LEFT);
        }

        const move_jump = this._mgr.isPressJump(event);
        if(move_jump) {
            this._mgr.switchJump();
        }
    }

    onKeyUp(event: EventKeyboard): void {

    }

    update(deltaTime: number) {
        
    }

    getName(): string {
        return "idle";
    }
}

