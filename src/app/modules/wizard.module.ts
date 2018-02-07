import { WizardComponent } from "./components/wizard/wizard.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TabDirective } from "./directives/tab.directive";
import { TabsComponent } from "./components/tabs/tabs.component";
import { NgTranscludeDirective } from "./directives/ngTransclude.directive";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        WizardComponent, TabsComponent, NgTranscludeDirective,TabDirective
    ],
    providers : [],
    exports: [
        WizardComponent, TabsComponent, TabDirective
    ]
})
export class WizardModule { }