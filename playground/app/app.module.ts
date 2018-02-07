import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { WizardModule } from "../../src/app/modules/wizard.module";

@NgModule({
    imports: [BrowserModule, WizardModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
    }
}