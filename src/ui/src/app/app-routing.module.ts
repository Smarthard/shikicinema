import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlayerComponent} from './routes/player/player.component';
import {SettingsComponent} from './routes/settings/settings.component';
import {VideosComponent} from './routes/videos/videos.component';


const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'videos',
    component: VideosComponent
  },
  {
    path: ':animeId/:episode',
    component: PlayerComponent
  },
  {
    path: ':animeId',
    component: PlayerComponent
  },
  {
    path: '**',
    component: PlayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
