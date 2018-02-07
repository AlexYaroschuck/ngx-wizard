import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { TabDirective } from "../../directives/tab.directive";

@Component({
    selector: 'tabs',
    templateUrl: './src/app/modules/components/tabs/tabs.component.html',
})
export class TabsComponent implements AfterViewInit, OnInit, OnDestroy {
    @Input("class") tabsClass: string;
    @Input("type") tabsType: string;
    @Input("navClass") classMap: string;
    public activeTab: TabDirective;

    public tabs: TabDirective[] = [];

    public stringHelper = String;

    private isDestroyed: boolean = false;

    public ngOnDestroy() {
        this.isDestroyed = true;
    }

    public ngOnInit(): void {
        if(this.tabsType == "pills")
            this.classMap += " nav-pills";
    }

    public ngAfterViewInit(): void {
    }

    public addTab(tab: TabDirective): void {
        if(tab.index == -1)
            return;

        this.tabs.push(tab);

        this.sortTabs();

        tab.active = this.tabs.length === 1 && tab.active !== false;
    }

    public sortTabs(): void{
        this.tabs = this.tabs.sort((a,b)=> a.index < b.index ? -1: 1);
    }

    public removeTab(tab: TabDirective, options = { reselect: true, emit: true }): void {
        if (tab.index === -1 || this.isDestroyed) {
            return;
        }
        // Select a new tab if the tab to be removed is selected and not destroyed
        if (options.reselect && tab.active && this.hasAvailableTabs(tab.index)) {
            let newActiveIndex = this.getClosestTabIndex(tab.index);
            this.tabs[newActiveIndex].active = true;
        }
        if (options.emit) {
            tab.removed.emit(tab);
        }
        this.tabs.splice(tab.index, 1);
        if (tab.elementRef.nativeElement && tab.elementRef.nativeElement.remove) {
            tab.elementRef.nativeElement.remove();
        }
    }

    protected getClosestTabIndex(index: number): number {
        let tabsLength = this.tabs.length;
        if (!tabsLength) {
            return -1;
        }

        for (let step = 1; step <= tabsLength; step += 1) {
            let prevIndex = index - step;
            let nextIndex = index + step;
            if (this.tabs[prevIndex] && !this.tabs[prevIndex].disabled) {
                return prevIndex;
            }
            if (this.tabs[nextIndex] && !this.tabs[nextIndex].disabled) {
                return nextIndex;
            }
        }
        return -1;
    }

    protected hasAvailableTabs(index: number): boolean {
        let tabsLength = this.tabs.length;
        if (!tabsLength) {
            return false;
        }

        for (let i = 0; i < tabsLength; i += 1) {
            if (!this.tabs[i].disabled && i !== index) {
                return true;
            }
        }
        return false;
    }

    public onSelect(tab: TabDirective): void {
        this.activeTab = tab;
    }
}
