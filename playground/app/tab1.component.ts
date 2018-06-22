import { Component } from '@angular/core';

@Component({
    selector: 'tab1',
    template: `
        <tab  heading="Customer and Product Information 2" [index]="1">
            <div >TAB 1</div>
        </tab>
 `,
})
export class Tab1Component {

    constructor() {
    }


}