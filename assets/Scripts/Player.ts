import { _decorator, Camera, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, RigidBody2D, Sprite, SpriteFrame, Vec3, Vec2, UITransform, Animation } from 'cc';
import StateMgr from './States/StateMgr';
import { DirectionType } from './States/StateBase';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property
    moveSpeed:number = 100;
    @property(Camera)
    camera:Camera = null;
    @property
    jumpSpeed:number = 200;
    
    private _rgbody: RigidBody2D = null;
    private _distance: Vec3 = new Vec3();

    @property(SpriteFrame)
    public idleFrame:SpriteFrame = null;
    @property(SpriteFrame)
    public runFrame:SpriteFrame = null;
    @property(SpriteFrame)
    public slideFrame:SpriteFrame = null;
    @property(SpriteFrame)
    public jumpFrame:SpriteFrame = null;

    protected stateMgr: StateMgr = null;

    runAnim: Animation = null;
    private _anim_play: boolean = false;

    start() {
        Vec3.subtract(this._distance, this.camera.node.worldPosition, this.node.worldPosition);

        let colliders = this.getComponents(Collider2D);
        for(let collider of colliders) {
            if(collider && collider.tag == 2) { 
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            }
        }
        const child = this.node.getChildByName("SmallMario");
        this.runAnim = child.getComponent(Animation);

        this.stateMgr = new StateMgr(this);
    }

    update(deltaTime: number) {
        this.stateMgr.update(deltaTime);
        const xState = this.stateMgr.getHorizontalState();
        const yState = this.stateMgr.getVerticalState();

        const child = this.node.getChildByName("SmallMario");
        const sprite = child.getComponent(Sprite);
        const lv = this._rgbody.linearVelocity;
        console.log("state: " + xState.getName() + ", " + yState.getName());

        if(yState == StateMgr.jumpState) {
            this.cancelAnimation();
            sprite.spriteFrame = this.jumpFrame;
            if(StateMgr.jumpState.getCanJump()) {
                lv.y = this.jumpSpeed * deltaTime;
                StateMgr.jumpState.change(false);
            }
        } else {
            if(xState == StateMgr.xIdleState) {
                sprite.spriteFrame = this.idleFrame;
                this.cancelAnimation();
            } else if(xState == StateMgr.runState) {
                const scale = this.node.scale;
                let xscale = Math.abs(scale.x);

                if(StateMgr.runState.getDirection() == DirectionType.DIRECTION_RIGHT) {
                    this.node.setScale(xscale, scale.y, scale.z);
                    lv.x = this.moveSpeed * deltaTime;
                } else if(StateMgr.runState.getDirection() == DirectionType.DIRECTION_LEFT) {
                    this.node.setScale(-xscale, scale.y, scale.z);
                    lv.x = -this.moveSpeed * deltaTime;
                }
                this.runAnimation();
            } else if(xState == StateMgr.slideState) {
                this.runAnimation();
            } else if(xState == StateMgr.turnState) {
                this.cancelAnimation();
                sprite.spriteFrame = this.slideFrame;
                const scale = this.node.scale;
                let xscale = Math.abs(scale.x);

                if(StateMgr.turnState.getDirection() == DirectionType.DIRECTION_RIGHT) {
                    this.node.setScale(xscale, scale.y, scale.z);
                } else if(StateMgr.turnState.getDirection() == DirectionType.DIRECTION_LEFT) {
                    this.node.setScale(-xscale, scale.y, scale.z);
                }
            }
        }

        if(this.checkCameraBound(lv, deltaTime) == false) {
            lv.x = 0;
        }
        this._rgbody.linearVelocity = lv;
    }

    onLoad () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this._rgbody = this.node.getComponent(RigidBody2D);
    }

    onDestroy () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event: EventKeyboard) {
        this.stateMgr.onKeyDown(event);
    }

    onKeyUp (event: EventKeyboard) {
        this.stateMgr.onKeyUp(event);
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.stateMgr.onCollide(selfCollider, otherCollider, contact);
    }
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
    }

    getLinearVelocity() {
        return this._rgbody.linearVelocity;
    }

    checkCameraBound(lv: Vec2, deltaTime: number) {
        const zero_pos = new Vec3();
        const screen_left = new Vec3();
        this.camera.screenToWorld(zero_pos, screen_left);

        const size = this.node.getComponent(UITransform)?.contentSize;
        const width = size.width;

        const move_dist = lv.x * this.moveSpeed * deltaTime;
        const cur_pos = this.node.getWorldPosition();
        const next_x = cur_pos.x + move_dist;
        if(next_x < screen_left.x + width / 2) {
            return false;
        }
        return true;
    }

    runAnimation() {
        if(this._anim_play) {
            return;
        }
        this._anim_play = true;
        this.runAnim.play();
    }

    cancelAnimation() {
        this._anim_play = false;
        this.runAnim.stop();
    }
}

