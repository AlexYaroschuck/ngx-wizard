import { TabDirective } from "../../modules/directives/tab.directive";

export class SelectEvent {
    public target: TabDirective;
    public _preventDefault: boolean = false;


    constructor(target: TabDirective) {
        this.target = target;
    }

    public preventDefault(): void {
        this._preventDefault = true;
    }
}