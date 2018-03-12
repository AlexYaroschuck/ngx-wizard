import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from "@angular/core";
import { TabsComponent } from "../tabs/tabs.component";

import "jquery";
import { TabDirective } from "../../directives/tab.directive";
import { SelectEvent } from "../../../objects/events/selectEvent";
import { BaseEvent } from "../../../objects/events/baseEvent";

declare var $: any;

@Component({
    selector: 'wizard',
    templateUrl: '../../../../../src/app/modules/components/wizard/wizard.component.html',
    providers: [{ provide: TabsComponent, useExisting: forwardRef(() => WizardComponent) }]
})
export class WizardComponent extends TabsComponent {
    @Input() public nextButtonClass: string = "btn btn-next btn-fill btn-wd";
    @Input() public prevButtonClass: string = "btn btn-previous btn-fill btn-default btn-wd";
    @Input() public nextIconClass: string = "material-icons";
    @Input() public nextIconText: string = "arrow_forward";
    @Input() public prevIconClass: string = "material-icons";
    @Input() public prevIconText: string = "arrow_back";
    @Input() public previousButton: string;
    @Input() public nextButton: string;
    @Input() public showProgressBar: boolean = false;
    @Input() public showHeader: boolean = true;
    @Input() public scrollClassRef: string = null;

    public previousButtonText: string;
    public nextButtonText: string;
    public previousButtonVisible: boolean;
    public nextButtonVisible: boolean;
    public currentProgress: number = 0;

    @Output() public finish: EventEmitter<WizardComponent> = new EventEmitter();

    @ViewChild("prevButton") previousButtonRef: any;
    @ViewChild("continueButton") continueButtonRef: any;

    constructor(elementRef: ElementRef) {
        super();
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            if (!this.tabs.find(x => x.active)) //If manually set to active
            {
                let t = this.tabs[0];

                if (t != null)
                    t.active = true;
            }
            this.initAnimation();
        });
    }

    public get progress(): number {
        if (!this.activeTab)
            return;

        let currentTab = this.tabs.find(x => x.index == this.activeTab.index);
        let activeTabs = this.tabs.filter(tab => tab.index >= 0);

        let index = activeTabs.indexOf(currentTab);
        let multiple = 100 / (activeTabs.length - 1);

        return index >= 0 ? index * multiple : 0;
    }

    public nextTab(emitContinue: boolean = true): void {
        if(this.activeTab.isNextButtonDisabled)
            return;

        if (emitContinue) {
            let continueEvent = new BaseEvent(this.activeTab);
            this.activeTab.onContinueClicked.emit(continueEvent);

            if (continueEvent._preventDefault) {
                return;
            }
        }

        if (this.activeTab.index >= Math.max(...this.tabs.map(x => x.index))) {
            this.finish.emit();
            return;
        }

        //this.tabs[this.activeTab.index + 1].active = true;
        let nextTab = this.tabs.find(x => x.index >= this.activeTab.index + 1);

        if (nextTab){
            nextTab.active = true;

            this.scrollTop();
        }
    }

    private scrollTop(): void{
        const el = document.querySelector(this.scrollClassRef);

        if (el) {
            el.scrollTop = 0
        }
    }

    public previousTab(emitPrevious: boolean = true): void {
        if(this.activeTab.isPrevButtonDisabled)
            return;

        if (this.activeTab.index <= 0)
            return;

        if (emitPrevious) {
            let previousEvent = new BaseEvent(this.activeTab);
            this.activeTab.onPreviousClicked.emit(previousEvent);

            if (previousEvent._preventDefault) {
                return;
            }
        }

        let prevTab = this.tabs.find(x => x.index >= this.activeTab.index - 1);

        if (prevTab){
            prevTab.active = true;

            this.scrollTop();
        }
    }

    private initAnimation(): void {
        let navigation = $(".wizard-navigation");
        let $total = navigation.find('li').length;
        let $width = 100 / $total;
        let $wizard = navigation.closest('.wizard-card');
        let $current = this.activeTab.index + 1;

        let nextText = "Next";
        if ($current >= $total) {
            nextText = "Finish";
        }

        this.previousButtonText = this.activeTab.previousButton || this.previousButton || "Previous";
        this.nextButtonText = this.activeTab.nextButton || this.nextButton || nextText;

        this.previousButtonVisible = this.previousButtonText != "hidden" && $current != 1;
        this.nextButtonVisible = this.nextButtonText != "hidden";

        let $display_width = $(document).width();

        if ($display_width < 600 && $total > 3) {
            $width = 50;
        }

        navigation.find('li').css('width', $width + '%');
        let button_text = navigation.find('li:first-child a span').html();

        if (button_text)
            button_text = button_text.replace(/<!--([\s\S]*?)-->/gm, "");

        $('.moving-tab').text(button_text);

        let total_steps = $wizard.find('li').length;
        let move_distance = $wizard.width() / total_steps;
        let step_width = move_distance;
        move_distance *= this.activeTab.index;

        if ($current == 1) {
            move_distance -= 8;
        } else if ($current == total_steps) {
            move_distance += 8;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
            'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
            'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
        });

        $('.moving-tab').css('transition', 'transform 0s');
    }

    public onSelect(tab: TabDirective): void {
        super.onSelect(tab);

        let navigation = $(".wizard-navigation");
        let $total = navigation.find('li').length;
        let $current = this.activeTab.index + 1;

        let $wizard = navigation.closest('.wizard-card');

        let nextText = "Next";
        if ($current >= $total) {
            nextText = "Finish";
        }

        this.previousButtonText = this.activeTab.previousButton || "Previous";
        this.nextButtonText = this.activeTab.nextButton || nextText;

        this.previousButtonVisible = this.previousButtonText != "hidden" && $current != 1;
        this.nextButtonVisible = this.nextButtonText != "hidden";

        let button_text = navigation.find('li:nth-child(' + $current + ') a span').html();

        if (button_text)
            button_text = button_text.replace(/<!--([\s\S]*?)-->/gm, "");

        setTimeout(function () {
            $('.moving-tab').text(button_text);
        }, 150);

        let checkbox = $('.footer-checkbox');

        if (this.activeTab.index !== 0) {
            $(checkbox).css({
                'opacity': '0',
                'visibility': 'hidden',
                'position': 'absolute'
            });
        } else {
            $(checkbox).css({
                'opacity': '1',
                'visibility': 'visible'
            });
        }

        let total_steps = $wizard.find('li').length;
        let move_distance = $wizard.width() / total_steps;
        let step_width = move_distance;
        move_distance *= this.activeTab.index;

        if ($current == 1) {
            move_distance -= 8;
        } else if ($current == total_steps) {
            move_distance += 8;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
            'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
            'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
        });
    }
}
