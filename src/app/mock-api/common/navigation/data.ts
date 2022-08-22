/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id: 'example',
    //     title: 'Example',
    //     subtitle: 'Example app',
    //     type: 'group',
    //     icon: 'heroicons_outline:home',
    //     children: [
    //         {
    //             id: 'manager',
    //             title: 'Manager',
    //             type: 'collapsable',
    //             icon: 'heroicons_outline:chart-pie',
    //             children: [
    //                 {
    //                     id: 'users',
    //                     title: 'Users',
    //                     type: 'basic',
    //                     icon: 'heroicons_outline:chart-pie',
    //                     link: '/example/manager/users',
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'maintainers',
    //             title: 'Maintainers',
    //             type: 'collapsable',
    //             icon: 'heroicons_outline:chart-pie',
    //             children: [
    //                 {
    //                     id: 'orders',
    //                     title: 'Orders',
    //                     type: 'basic',
    //                     icon: 'heroicons_outline:chart-pie',
    //                     link: '/example/maintainers/orders',
    //                 },
    //             ]
    //         }
    //     ]
    // },
    {
        id: 'puerto-anconcito',
        title: 'Puerto Anconcito',
        subtitle: 'Puerto Anconcito',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            // {
            //     id: 'manager',
            //     title: 'Manager',
            //     type: 'collapsable',
            //     icon: 'heroicons_outline:chart-pie',
            //     children: [
            //         {
            //             id: 'users',
            //             title: 'Users',
            //             type: 'basic',
            //             icon: 'heroicons_outline:chart-pie',
            //             link: '/example/manager/users',
            //         },
            //     ]
            // },
            {
                id: 'maintainers',
                title: 'Mantenedores',
                type: 'collapsable',
                icon: 'heroicons_outline:chart-pie',
                children: [
                    {
                        id: 'clients',
                        title: 'Clientes',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/puerto-anconcito/maintainers/clients',
                    },
                    {
                        id: 'users',
                        title: 'Usuarios',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/puerto-anconcito/maintainers/users',
                    },
                    {
                        id: 'roles',
                        title: 'Roles',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/puerto-anconcito/maintainers/roles',
                    },
                    {
                        id: 'contracts',
                        title: 'Contratos',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/puerto-anconcito/maintainers/contracts',
                    },
                    {
                        id: 'params',
                        title: 'Parametros',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/puerto-anconcito/maintainers/params',
                    },
                ]
            },
            {
                id: 'processes',
                title: 'Procesos',
                type: 'collapsable',
                icon: 'heroicons_outline:chart-pie',
                children: [
                    {
                        id: 'turns',
                        title: 'Cobros Garita',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/puerto-anconcito/processes/turns',
                    },
                    {
                        id: 'close-turns',
                        title: 'Cierre de Turno',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/puerto-anconcito/processes/close-turns',
                    },
                ]
            },
            {
                id: 'reports',
                title: 'Reportes',
                type: 'collapsable',
                icon: 'heroicons_outline:chart-pie',
                children: [
                    {
                        id: 'charges',
                        title: 'Cobros Garita',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/puerto-anconcito/reports/charges',
                    }
                ]
            },
            // {
            //     id: 'components',
            //     title: 'Components',
            //     type: 'collapsable',
            //     icon: 'heroicons_outline:chart-pie',
            //     children: [
            //         {
            //             id: 'sandbox',
            //             title: 'Sandbox',
            //             type: 'basic',
            //             icon: 'heroicons_outline:chart-pie',
            //             link: '/example/components/sandbox',
            //         },
            //     ]
            // }
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
