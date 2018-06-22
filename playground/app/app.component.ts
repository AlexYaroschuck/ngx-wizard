import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `<wizard nextButton="next" prevButton="back"> 
                 <tab  heading="Customer and Product Information" [index]="0">
                    <div >HI</div>
                </tab>
        <tab1>
        </tab1>
        <tab2>
        </tab2>
        <tab  heading="Customer and Product Information 2" [index]="-1">
            <div >HI4</div>
        </tab>
        <tab  heading="Customer and Product Information 2" [index]="4">
            <div >HI5</div>
        </tab>
    </wizard>`,
})
export class AppComponent {

    constructor() {
    }


}