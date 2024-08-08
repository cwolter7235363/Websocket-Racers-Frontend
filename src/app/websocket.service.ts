import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private onOpenCallbacks: (() => void)[] = [];
  public messageSignal = signal<any>(null);

  constructor() { }

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
      this.onOpenCallbacks.forEach(callback => callback());
      this.onOpenCallbacks = [];
    };

    this.socket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      debugger
      this.messageSignal.set(JSON.parse(event.data));
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  onOpen(callback: () => void): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      callback();
    } else {
      this.onOpenCallbacks.push(callback);
    }
  }

  registerAsHost(): void {
    this.onOpen(() => {
      this.socket.send(JSON.stringify({ type: 'register', role: 'host' }));
    });
  }

  registerAsPlayer(playerName: string): void {
    this.onOpen(() => {
      this.socket.send(JSON.stringify({ type: 'register', role: 'client', value: {playerName} }));
    });
  }

  get getMessages(): Signal<any> {
    return this.messageSignal;
  }

  send(message: any): void {
    this.onOpen(() => {
      this.socket.send(JSON.stringify(message));
    });
  }
}