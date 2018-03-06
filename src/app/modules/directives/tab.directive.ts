import { Directive, EventEmitter, HostBinding, Input, Output, TemplateRef, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { SelectEvent } from "../../objects/events/selectEvent";
import { TabsComponent } from "../components/tabs/tabs.component";
import { CheckEvent } from "../../objects/events/checkEvent";
import { WizardComponent } from "../components/wizard/wizard.component";

@Directive({selector: 'tab, [tab]'})
export class TabDirective implements OnInit, OnDestroy {
    @Input() public heading: string;
    @Input() public id: string;
    @Input() public disabled: boolean;
    @Input() public removable: boolean;
    @Input() public customClass: string;
    @Input() public icon: string;
    @Input() public previousButton: string;
    @Input() public isNextButtonDisabled: boolean;
    @Input() public buttonTemplate: any;

    private _nextButton:string;

    @Input() public set nextButton(val: string){
        this._nextButton = val;
        let t = this.tabsComponent as WizardComponent;

        t.nextButtonText = val;
        t.nextButtonVisible = t.nextButtonText != "hidden";
    };

    public get nextButton(): string{
        return this._nextButton;
    }

    @Input() public isTabCombined: boolean = false;

    private _index: number = -1;

    public get index(): number{
        return this._index;
    }

    @Input()
    public set index(val:number){
        if(val === -1){
            this.tabsComponent.removeTab(this, {reselect:true, emit:true, removeNative: false});
            this._index = val;
            return;
        }

        this._index = val;

        //if no tab
        if(!this.tabsComponent.tabs.find(x => x == this))
            this.tabsComponent.addTab(this);

        this.tabsComponent.sortTabs();
    }

    @HostBinding('class.active')
    @Input()
    public get active(): boolean {
        return this._active;
    }

    public set active(active: boolean) {
        if (this.disabled && active || !active) {
            if (!active) {
                this._active = active;
            }

            this.deselect.emit(this);
            return;
        }

        if(this.tabsComponent.activeTab != null) {
            let checkEvent = new SelectEvent(this);
            this.tabsComponent.activeTab.check.emit(checkEvent);

            if(checkEvent._preventDefault) {
                return;
            }
        }

        this._active = active;
        let event = new SelectEvent(this);
        this.isSelect.emit(event);

        if(event._preventDefault) {
            this._active = false;
            return;
        }

        this.tabsComponent.onSelect(this);
        this.tabsComponent.tabs.forEach((tab: TabDirective) => {
            if (tab !== this) {
                tab.active = false;
            }
        });
    }

    @Output() public check: EventEmitter<CheckEvent> = new EventEmitter(false);
    @Output() public isSelect: EventEmitter<SelectEvent> = new EventEmitter(false);
    @Output() public deselect: EventEmitter<TabDirective> = new EventEmitter();
    @Output() public removed: EventEmitter<TabDirective> = new EventEmitter();
    @Output() public onContinueClicked: EventEmitter<SelectEvent> = new EventEmitter();

    @HostBinding('class.tab-pane') public addClass: boolean = true;

    public headingRef: TemplateRef<any>;
    public tabsComponent: TabsComponent;
    protected _active: boolean;

    public constructor(tabsComponent: TabsComponent, public elementRef: ElementRef) {
        this.tabsComponent = tabsComponent;
    }

    public ngOnInit(): void {
        if(!this.tabsComponent.tabs.find(x => x == this))
            this.tabsComponent.addTab(this);
    }

    public ngOnDestroy(): void {
        this.tabsComponent.removeTab(this, {reselect: false, emit: false, removeNative: true});
    }
}