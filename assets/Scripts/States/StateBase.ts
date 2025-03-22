import { Collider2D, EventKeyboard, IPhysics2DContact, KeyCode } from "cc";
import StateMgr from "./StateMgr";

export enum DirectionType {
    DIRECTION_LEFT = 1,
    DIRECTION_RIGHT = 2
};

export const SPEED_THRESHOLD = 0.1;

export default class StateBase {
    protected _mgr: StateMgr | null = null;

    constructor(mgr: StateMgr) {
        this._mgr = mgr;
    }

    onKeyDown(event: EventKeyboard) {

    }

    onKeyUp(event: EventKeyboard) {

    }

    onCollide(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    update(deltaTime: number) {
        
    }

    getName() {
        return "base";
    }
}

