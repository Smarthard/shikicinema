import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from "./routes/player/player.component";


const routes: Routes = [
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
