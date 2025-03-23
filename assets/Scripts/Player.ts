import { _decorator, Camera, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, RigidBody2D, Sprite, SpriteFrame, Vec3, Vec2, UITransform, Animation, BoxCollider2D, KeyCode } from 'cc';
import StateMgr from './States/StateMgr';
import { DirectionType } from './States/StateBase';
const { ccclass, property } = _decorator;

const MAX_MOVE_SPEED = 200;
const MAx_JUMP_SPEED = 300;
const ACCELERATION = 50;

@ccclass('Player')
export class Player extends Component {
    @property
    moveSpeed:number = 100;
    @property(Camera)
    camera:Camera = null;
    @property
    jumpSpeed:number = 700;
    
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
    private _is_small_mario: boolean = true;
    private _frication:number = 0.8;

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

        this.switchSmallMario();
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
                    lv.x = this.getMoveSpeed(DirectionType.DIRECTION_RIGHT, lv, deltaTime);
                } else if(StateMgr.runState.getDirection() == DirectionType.DIRECTION_LEFT) {
                    this.node.setScale(-xscale, scale.y, scale.z);
                    lv.x = this.getMoveSpeed(DirectionType.DIRECTION_LEFT, lv, deltaTime);
                }
                this.runAnimation();
            } else if(xState == StateMgr.slideState) {
                lv.x = this._frication * lv.x;
                this.runAnimation();
            } else if(xState == StateMgr.turnState) {
                lv.x = this._frication * lv.x;
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

        if(event.keyCode == KeyCode.SPACE) {
            this.switchBigMario();
        }
    }

    onKeyUp (event: EventKeyboard) {
        this.stateMgr.onKeyUp(event);

        if(event.keyCode == KeyCode.SPACE) {
            this.switchSmallMario();
        }
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
        if(this._is_small_mario) {
            const child = this.node.getChildByName("SmallMario");
            this.runAnim = child.getComponent(Animation);
        } else {
            const child = this.node.getChildByName("BigMario");
            this.runAnim = child.getComponent(Animation);
        }
        this.runAnim.play();
    }

    cancelAnimation() {
        this._anim_play = false;
        this.runAnim.stop();
    }

    switchBigMario() {
        let collider = this.getComponent(BoxCollider2D);
        collider.offset = new Vec2(0.1, 9.8);
        collider.size.width = 15.7;
        collider.size.height = 28.4;

        this._is_small_mario = false;
        const small_mario = this.node.getChildByName("SmallMario");
        small_mario.active = false;
        const big_mario = this.node.getChildByName("BigMario");
        big_mario.active = true;
    }

    switchSmallMario() {
        let collider = this.getComponent(BoxCollider2D);
        collider.offset = new Vec2(0, 2.3);
        collider.size.width = 15.4;
        collider.size.height = 11.2;

        this._is_small_mario = true;
        const small_mario = this.node.getChildByName("SmallMario");
        small_mario.active = true;
        const big_mario = this.node.getChildByName("BigMario");
        big_mario.active = false;
    }

    getMoveSpeed(direction: DirectionType, lv: Vec2, deltaTime: number) {
        let x_speed = Math.abs(lv.x);
        if(x_speed < this.moveSpeed) {
            x_speed = this.moveSpeed * deltaTime;
        }
        x_speed += ACCELERATION * deltaTime;

        if(x_speed > MAX_MOVE_SPEED * deltaTime) {
            x_speed = MAX_MOVE_SPEED * deltaTime;
        }
        x_speed = direction == DirectionType.DIRECTION_RIGHT ? x_speed : -x_speed;
        return x_speed;
    }
}

