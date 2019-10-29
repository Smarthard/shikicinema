import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlayerComponent} from './routes/player/player.component';
import {SettingsComponent} from './routes/settings/settings.component';


const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent
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
