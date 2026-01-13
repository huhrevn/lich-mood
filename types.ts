export interface NavItem {
    id: string;
    icon: string;
    label: string;
    path: string;
}

export enum Tab {
    HOME = 'home',
    CALENDAR = 'calendar',
    ADD = 'add',
    FORTUNE = 'fortune',
    SETTINGS = 'settings'
}