import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: 'friends',
        loadChildren: () => import('../friends/friends.module').then( m => m.FriendsPageModule)
      },
      {
        path: 'feed',
        loadChildren: () => import('../feed/feed.module').then( m => m.FeedPageModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then( m => m.NotificationPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/feed',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/feed',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
