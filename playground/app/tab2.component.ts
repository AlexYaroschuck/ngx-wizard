import { Component } from '@angular/core';

@Component({
    selector: 'tab2',
    template: `
        <tab  heading="Customer and Product Information 2" [index]="2">
            <div >TAB 2</div>
        </tab>
 `,
})
export class Tab2Component {

    constructor() {
    }


}