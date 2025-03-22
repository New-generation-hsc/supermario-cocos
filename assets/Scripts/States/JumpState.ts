import { Collider2D, EventKeyboard, IPhysics2DContact } from "cc";
import StateBase from "./StateBase";

export default class JumpState extends StateBase {
    protected _canJump: boolean = true;

    onKeyDown(event: EventKeyboard): void {

    }

    onKeyUp(event: EventKeyboard): void {

    }

    onCollide(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        this._canJump = true;
        this._mgr.switchVerticalIdel();
    }

    update(deltaTime: number) {
        
    }

    change(jump: boolean) {
        this._canJump = jump;
    }

    getName(): string {
        return "jump";
    }

    getCanJump() {
        return this._canJump;
    }
}

