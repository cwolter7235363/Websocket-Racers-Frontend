import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit {
  playerName: string | null = null;

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.playerName = window.prompt('Please enter your name:', '');
    if (this.playerName) {
      this.websocketService.connect('ws://localhost:8080');
      this.websocketService.registerAsPlayer(this.playerName);
    } else {
      console.log('Player name is required to connect.');
    }
  }


  setReady(): void {
    this.websocketService.send({ type: 'ready', value: { playerName: this.playerName } });
  }


}