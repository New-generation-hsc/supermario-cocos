import { _decorator, Animation, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact } from 'cc';
import { NodeTagType } from './Tags';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
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
            console.log("animation: " + animation);
        }
        console.log("block animation: contact");
    }
    
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
    }
}

