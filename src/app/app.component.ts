import { Component } from '@angular/core';
import { GestionAppComponent } from "./components/gestion-app.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GestionAppComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestion-panaderia-front';
}
