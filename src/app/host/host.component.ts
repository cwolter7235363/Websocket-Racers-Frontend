import { Component, OnInit, inject, effect } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { CommonModule } from '@angular/common';

// {"type":"new_client","message":"A new client has connected"}
enum MessageTypes {
  NewClient = 'new_client',
  ClientDisconnected = 'client_disconnected',
  GameStarted = 'game_started',
  GameEnded = 'game_ended'
}


@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  private websocketService = inject(WebsocketService);
  public latestMessage: any = null;

  protected players: {playerName: string, ready: boolean, playerId: string}[] = [];

  constructor() {
    // Run the effect within the constructor to ensure it's within the Angular injection context
    effect(() => {
      const msg: {type: MessageTypes, message: string} = this.websocketService.getMessages();
      if (msg?.type) {
        this.handleMessage(msg);
      }
    });
  }

  ngOnInit(): void {
    // Connect to the WebSocket server and register as a host
    this.websocketService.connect('ws://localhost:8080');
    this.websocketService.registerAsHost();
  }

  private handleMessage(message: any): void {
    switch (message.type) {
      case MessageTypes.NewClient:
        console.log('New client connected:', message.data);
        this.players.push(message.data);
        break;
      case MessageTypes.ClientDisconnected:
        console.log('Client disconnected:', message.data);
        this.players = this.players.filter(player => player.playerId !== message.data.playerId);
        break;
      case MessageTypes.GameStarted:
        console.log('Game started:', message.data);
        break;
      case MessageTypes.GameEnded:
        console.log('Game ended:', message.data);
        break;
      default:
        console.log('Unknown message type:', message);
    }
  }


}
