import { _decorator, Animation, BoxCollider2D, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Prefab, Vec3 } from 'cc';
import { NodeTagType } from './Tags';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    @property(Prefab)
    emptyBlock: Prefab | null = null;
    @property(Prefab)
    mushRoom: Prefab | null = null;

    start() {
        let collider = this.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    update(deltaTime: number) {
        
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.tag == NodeTagType.NODE_TAG_TYPE_PLAYER) {
            const animation = this.node.getComponent(Animation);
            if(animation) {
                animation.play();
            }

            const state = animation.getState('MoveBack');
            const duration = state.duration;
            this.schedule(function() {
                let mushroom_pos = new Vec3();
                this.node.getWorldPosition(mushroom_pos);
                const mush_room = instantiate(this.mushRoom);
                
                let block_pos = new Vec3();
                this.node.getWorldPosition(block_pos);
                const block = instantiate(this.emptyBlock);
                this.node.parent.addChild(mush_room);
                this.node.parent.addChild(block);

                console.log("node_pos: " + this.node.getWorldPosition() + ", mush_room: " + mushroom_pos + ", block: " + block_pos);
                mush_room.setWorldPosition(mushroom_pos);
                block.setWorldPosition(block_pos);
                this.node.destroy();
            }, duration);
        }
    }
    
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
    }
}

