import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { WizardModule } from "../../src/app/wizard.module";
import { Tab1Component } from "./tab1.component";
import { Tab2Component } from "./tab2.component";

@NgModule({
    imports: [BrowserModule, WizardModule],
    declarations: [AppComponent, Tab1Component, Tab2Component],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
    }
}