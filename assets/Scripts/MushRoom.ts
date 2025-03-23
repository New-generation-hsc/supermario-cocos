import { _decorator, AudioClip, CircleCollider2D, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D, UITransform, Vec2, Vec3 } from 'cc';
import { NodeTagType } from './Tags';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

export enum MushRoomState {
    MUSHROOM_RISING = 1,
    MUSHROOM_MOVING = 2,
};

@ccclass('MushRoom')
export class MushRoom extends Component {
    private _state: MushRoomState = MushRoomState.MUSHROOM_RISING;
    private _init_pos: Vec3 = new Vec3();
    private _node_height:number = 0;
    private _direction:number = 1;
    private _rgbody: RigidBody2D = null;

    @property(AudioClip)
    appearAudio: AudioClip = null;

    @property
    moveSpeed:number = 50;
    @property
    riseSpeed: number = 50;

    start() {
        let collider = this.getComponent(CircleCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);

        this.node.getPosition(this._init_pos);
        this._node_height = this.node.getComponent(UITransform).contentSize.height;
        this._rgbody = this.node.getComponent(RigidBody2D);
        AudioMgr.inst.playOneShot(this.appearAudio);
    }

    update(deltaTime: number) {
        this._state = this.getState();
        if(this._state == MushRoomState.MUSHROOM_RISING) {
            this.rise(deltaTime);
        } else if(this._state == MushRoomState.MUSHROOM_MOVING) {
            this.move(deltaTime);
        }
    }

    rise(deltaTime: number) {
        const lv = this._rgbody.linearVelocity;
        lv.y = this.riseSpeed * deltaTime;
        this._rgbody.linearVelocity = lv;
    }

    move(deltaTime: number) {
        const lv = this._rgbody.linearVelocity;
        lv.x = this._direction * this.moveSpeed * deltaTime;
        this._rgbody.linearVelocity = lv;
    }

    getState() {
        if(this._state == MushRoomState.MUSHROOM_MOVING) {
            return this._state;
        }
        const cur_pos = this.node.getPosition();
        if(cur_pos.y > this._init_pos.y + this._node_height) {
            return  MushRoomState.MUSHROOM_MOVING
        }
        return this._state;
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
       if(otherCollider.tag == NodeTagType.NODE_TAG_TYPE_PIPE) {
            this._direction  = -this._direction;
       } else if(otherCollider.tag == NodeTagType.NODE_TAG_TYPE_PLAYER) {
            this.node.destroy();
       }
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
    }
}

