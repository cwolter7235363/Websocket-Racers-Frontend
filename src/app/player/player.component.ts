import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit {
  playerName: string | null = null;
  isConnected = false;
  private readonly maxRetries = 5;
  private retryCount = 0;

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.playerName = window.prompt('Please enter your name:', '');
    if (this.playerName) {
      this.attemptConnection();
    } else {
      console.log('Player name is required to connect.');
    }
  }

  private attemptConnection(): void {
    this.websocketService.connect('ws://localhost:8080').subscribe({
      next: () => {
        this.websocketService.registerAsPlayer(this.playerName!);
        this.isConnected = true; // Set connection status to true
        this.retryCount = 0; // Reset retry count on successful connection
      },
      error: (err) => {
        console.error('Connection failed:', err);
        this.isConnected = false; // Set connection status to false
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying connection (${this.retryCount}/${this.maxRetries})...`);
          setTimeout(() => this.attemptConnection(), 2000); // Retry after 2 seconds
        } else {
          console.log('Max retries reached. Could not connect.');
        }
      }
    });
  }

  setReady(): void {
    this.websocketService.send({ type: 'ready', value: { playerName: this.playerName } });
  }
}