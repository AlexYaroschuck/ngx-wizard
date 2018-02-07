import { Directive, EventEmitter, HostBinding, Input, Output, TemplateRef, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { SelectEvent } from "../../objects/events/selectEvent";
import { TabsComponent } from "../components/tabs/tabs.component";
import { CheckEvent } from "../../objects/events/checkEvent";

@Directive({selector: 'tab, [tab]'})
export class TabDirective implements OnInit, OnDestroy {
    @Input() public heading: string;
    @Input() public id: string;
    @Input() public disabled: boolean;
    @Input() public removable: boolean;
    @Input() public customClass: string;
    @Input() public icon: string;
    @Input() public previousButton: string;
    @Input() public nextButton: string;

    @Input() public isTabCombined: boolean = false;

    private _index: number = -1;

    public get index(): number{
        return this._index;
    }

    @Input()
    public set index(val:number){
        if(val === -1){
            this.tabsComponent.removeTab(this);
            this._index = val;
            return;
        }

        this._index = val;
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

    @HostBinding('class.tab-pane') public addClass: boolean = true;

    public headingRef: TemplateRef<any>;
    public tabsComponent: TabsComponent;
    protected _active: boolean;

    public constructor(tabsComponent: TabsComponent, public elementRef: ElementRef) {
        this.tabsComponent = tabsComponent;
    }

    public ngOnInit(): void {
        this.tabsComponent.addTab(this);
    }

    public ngOnDestroy(): void {
        this.tabsComponent.removeTab(this, {reselect: false, emit: false});
    }
}