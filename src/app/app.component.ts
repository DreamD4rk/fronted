import { Component } from '@angular/core';
import { GestionAppComponent } from './components/gestion-app.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GestionAppComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestion-panaderia-front';
}
