import { _decorator, AudioClip, Component, Node } from 'cc';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(AudioClip)
    bgAudio: AudioClip = null;

    start() {
       AudioMgr.inst.play(this.bgAudio, 1);
    }

    update(deltaTime: number) {
        
    }
}

