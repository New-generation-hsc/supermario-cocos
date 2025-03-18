import { _decorator, Camera, Collider2D, Component, Contact2DType, Details, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, Node, RigidBody2D, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property
    moveSpeed:number = 100;
    @property(Camera)
    camera:Camera = null;
    @property
    jumpSpeed:number = 200;
    
    private _inputMap:Object = {};
    private _rgbody: RigidBody2D = null;
    private _distance: Vec3 = new Vec3();
    private _canJump: boolean = true;

    start() {
        Vec3.subtract(this._distance, this.camera.node.worldPosition, this.node.worldPosition);

        let colliders = this.getComponents(Collider2D);
        for(let collider of colliders) {
            if(collider && collider.tag == 2) { 
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            }
        }
    }

    update(deltaTime: number) {
        this.HorizontalMove(deltaTime);
        this.Jump(deltaTime);
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
        this._inputMap[event.keyCode] = 1;
    }

    onKeyUp (event: EventKeyboard) {
        this._inputMap[event.keyCode] = 0;
    }

    HorizontalMove(deltaTime: number) {
        const lv = this._rgbody.linearVelocity;
        const scale = this.node.scale;
        let xscale = Math.abs(scale.x);

        let h_speed = 0;
        if(this._inputMap[KeyCode.KEY_A] || this._inputMap[KeyCode.ARROW_LEFT]) {
            h_speed = -1;
            this.node.setScale(-xscale, scale.y, scale.z);
        } else if(this._inputMap[KeyCode.KEY_D] || this._inputMap[KeyCode.ARROW_RIGHT]) {
            h_speed = 1;
            this.node.setScale(xscale, scale.y, scale.z);
        }

        if(h_speed) {
            const zero_pos = new Vec3();
            const screen_left = new Vec3();
            this.camera.screenToWorld(zero_pos, screen_left);
    
            const size = this.node.getComponent(UITransform)?.contentSize;
            const width = size.width;
    
            const move_dist = h_speed * this.moveSpeed * deltaTime;
            const cur_pos = this.node.getWorldPosition();
            const next_x = cur_pos.x + move_dist;
            if(next_x < screen_left.x + width / 2) {
                h_speed = 0;
            }

            lv.x = h_speed * this.moveSpeed * deltaTime;
            this._rgbody.linearVelocity = lv;
        }
    }

    Jump(deltaTime: number) {
        const lv = this._rgbody.linearVelocity;
        
        if((this._inputMap[KeyCode.KEY_W] || this._inputMap[KeyCode.SPACE]) && this._canJump) {
            lv.y = this.jumpSpeed * deltaTime;
            this._canJump = false;
        }
        this._rgbody.linearVelocity = lv;
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this._canJump = true;
    }
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
    }
}

