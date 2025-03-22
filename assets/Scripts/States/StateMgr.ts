import { Collider2D, EventKeyboard, IPhysics2DContact, KeyCode } from "cc";
import { Player } from "../Player";
import IdleState from "./IdleState";
import JumpState  from "./JumpState";
import RunState from "./RunState";
import SlideState from "./SlideState";
import StateBase, { DirectionType } from "./StateBase";
import TurnState from "./TurnState";

export default class StateMgr {
    protected _role: Player | null = null;

    static xIdleState: IdleState = null;
    static runState: RunState = null;
    static slideState: SlideState = null;
    static turnState: TurnState = null;

    static yIdelState: IdleState = null;
    static jumpState: JumpState = null;

    private _horizontalState: StateBase = null;
    private _verticalState: StateBase = null;

    protected _keyMap: Object = {};

    constructor(player: Player) {
        this._role = player;
        StateMgr.xIdleState = new IdleState(this);
        StateMgr.jumpState = new JumpState(this);
        StateMgr.runState = new RunState(this);
        StateMgr.slideState = new SlideState(this);
        StateMgr.turnState = new TurnState(this);
        StateMgr.yIdelState = new StateBase(this);

        this._horizontalState = StateMgr.xIdleState;
        this._verticalState = StateMgr.yIdelState;
    }

    update(deltaTime: number) {
        this._horizontalState.update(deltaTime);
        this._verticalState.update(deltaTime);
    }

    onKeyDown(event: EventKeyboard) {
        this._keyMap[event.keyCode] = 1;
        this._horizontalState.onKeyDown(event);
        this._verticalState.onKeyDown(event);
    }

    onKeyUp(event: EventKeyboard) {
        this._keyMap[event.keyCode] = 0;
        this._horizontalState.onKeyUp(event);
        this._verticalState.onKeyUp(event);
    }

    onCollide(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this._horizontalState.onCollide(selfCollider, otherCollider, contact);
        this._verticalState.onCollide(selfCollider, otherCollider, contact);
    }

    switchHorizontalIdle() {
        this._horizontalState = StateMgr.xIdleState;
    }

    switchVerticalIdel() {
        this._verticalState = StateMgr.yIdelState;
    }

    switchJump() {
        this._verticalState = StateMgr.jumpState;
    }

    switchRun(direction: DirectionType) {
        StateMgr.runState.run(direction);
        this._horizontalState  = StateMgr.runState;
    }

    switchSlide(direction: DirectionType) {
        StateMgr.slideState.slide(direction);
        this._horizontalState = StateMgr.slideState;
    }

    switchTurn(direction: DirectionType) {
        StateMgr.turnState.turn(direction);
        this._horizontalState = StateMgr.turnState;
    }

    getLinearVelocity() {
        return this._role.getLinearVelocity();
    }

    getVerticalState() {
        return this._verticalState;
    }

    getHorizontalState() {
        return this._horizontalState;
    }

    isPressRight(event: EventKeyboard) {
        return this._keyMap[KeyCode.KEY_D] || this._keyMap[KeyCode.ARROW_RIGHT];
    }

    isReleaseRight(event: EventKeyboard) {
        return this._keyMap[KeyCode.KEY_D] == 0 || this._keyMap[KeyCode.ARROW_RIGHT] == 0;
    }

    isPressLeft(event: EventKeyboard) {
        return this._keyMap[KeyCode.KEY_A] || this._keyMap[KeyCode.ARROW_LEFT];
    }

    isReleaseLeft(event: EventKeyboard) {
        return this._keyMap[KeyCode.KEY_A] == 0 || this._keyMap[KeyCode.ARROW_LEFT] == 0;
    }

    isPressJump(event: EventKeyboard) {
        return this._keyMap[KeyCode.KEY_W] || this._keyMap[KeyCode.ARROW_UP];
    }
}

