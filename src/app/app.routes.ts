import { Routes } from '@angular/router';
import { EntryComponent } from './entry/entry.component';
import { HostComponent } from './host/host.component';
import { PlayerComponent } from './player/player.component';
import { RaceComponent } from './race/race.component';

export const routes: Routes = [
    {path: '' , component: EntryComponent},
    {path: 'host' , component: HostComponent},
    {path: 'player' , component: PlayerComponent},
    {path: 'race' , component: RaceComponent},
];
