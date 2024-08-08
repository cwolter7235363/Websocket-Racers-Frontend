import { Routes } from '@angular/router';
import { EntryComponent } from './entry/entry.component';
import { HostComponent } from './host/host.component';
import { PlayerComponent } from './player/player.component';

export const routes: Routes = [
    {path: '' , component: EntryComponent},
    {path: 'host' , component: HostComponent},
    {path: 'player' , component: PlayerComponent},
];
