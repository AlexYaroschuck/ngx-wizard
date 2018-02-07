import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `<wizard> 
                 <tab  heading="Customer and Product Information" [index]="0">
                    <div >HI</div>
                </tab>
        <tab  heading="Customer and Product Information 2" [index]="1">
            <div >HI2</div>
        </tab>
    </wizard>`,
})
export class AppComponent {

    constructor() {
    }


}