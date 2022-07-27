/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        subtitle: 'Example app',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'manager',
                title: 'Manager',
                type: 'collapsable',
                icon: 'heroicons_outline:chart-pie',
                children: [
                    {
                        id: 'users',
                        title: 'Users',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/example/manager/users',
                    },
                ]
            },
            {
                id: 'maintainers',
                title: 'Maintainers',
                type: 'collapsable',
                icon: 'heroicons_outline:chart-pie',
                children: [
                    {
                        id: 'orders',
                        title: 'Orders',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/example/maintainers/orders',
                    },
                ]
            },
            {
                id: 'components',
                title: 'Components',
                type: 'collapsable',
                icon: 'heroicons_outline:chart-pie',
                children: [
                    {
                        id: 'sandbox',
                        title: 'Sandbox',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/example/components/sandbox',
                    },
                ]
            }
        ]
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
