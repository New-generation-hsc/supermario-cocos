import { _decorator, Component, Node, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Camera')
export class Camera extends Component {
    @property(Node)
    target: Node = null;
    @property
    speed:number = 100;

    private _distance: Vec3 = new Vec3();
    private _init_pos: Vec3 = new Vec3();
    private _max_pos: Vec3 = new Vec3();

    protected onLoad(): void {
        Vec3.subtract(this._distance, this.node.worldPosition, this.target.worldPosition);
        this.node.getWorldPosition(this._init_pos);
    }

    start() {
        
    }

    update(deltaTime: number) {
        let new_pos = new Vec3();
        Vec3.add(new_pos, this.target.worldPosition, this._distance);

        const cur_pos = this.node.worldPosition;
        new_pos.y = cur_pos.y;

        if(new_pos.x > this._max_pos.x) {
            this._max_pos.x = new_pos.x;
        }

        const width = screen.width / 2;
        if(new_pos.x < this._max_pos.x - width || new_pos.x < this._init_pos.x) {
            new_pos.x = cur_pos.x;
        }
        this.node.setWorldPosition(new_pos);
    }
}