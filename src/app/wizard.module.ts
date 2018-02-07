import { WizardComponent } from "./modules/components/wizard/wizard.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TabDirective } from "./modules/directives/tab.directive";
import { TabsComponent } from "./modules/components/tabs/tabs.component";
import { NgTranscludeDirective } from "./modules/directives/ngTransclude.directive";

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