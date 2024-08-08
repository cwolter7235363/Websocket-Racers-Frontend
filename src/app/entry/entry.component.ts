import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.scss'
})
export class EntryComponent {

  constructor(private router: Router) { }

  protected goToHost(): void {
    this.router.navigate(['/host']);
  }

  protected goToPlayer(): void {
    this.router.navigate(['/player']);
  }

}
