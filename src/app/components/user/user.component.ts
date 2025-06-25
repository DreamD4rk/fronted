import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  title: string = 'Lista de usuarios'
  
  sortDisabledFirst = false;

  @Input() users: User[] = []
  @Output() usernameEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() selectUserEventEmitter = new EventEmitter();

  // Control del modal
  isDialogOpen = false;
  userToRemove?: string

  /** Abre el modal pasando el username */
  openRemoveDialog(username: string): void {
    this.userToRemove = username;
    this.isDialogOpen = true;
  }

   /** Se invoca al confirmar dentro del modal */
  confirmRemove(): void {
    if (this.userToRemove) {
      this.usernameEventEmitter.emit(this.userToRemove);
    }
    this.closeDialog();
  }

   /** Cierra el modal sin emitir */
  closeDialog(): void {
    this.isDialogOpen = false;
    this.userToRemove = undefined;
  }
  
  /** Elimina al usuario */
  onRemoveUser(username: string): void {
    const confirmRemove = confirm(`¿Estás seguro de eliminar el usuario ${username}?`)
    if (!confirmRemove) {
      return;
    }
    this.usernameEventEmitter.emit(username);
  }

  /** Selecciona al usuario */
  onSelectUser(user: User): void {
    this.selectUserEventEmitter.emit(user);
  }

  /** Invocado al hacer clic en la flecha de Estado */
  toggleDisabledSort() {
    this.sortDisabledFirst = !this.sortDisabledFirst;
    this.applyDisabledSort();
  }

  /** Reordena el arreglo `users` */
  private applyDisabledSort() {
    this.users.sort((a, b) => {
      // convierto boolean a número para comparar
      const da = a.disabled ? 1 : 0;
      const db = b.disabled ? 1 : 0;
      // si sortDisabledFirst, pongo los '1' (desactivados) primero → invertido
      return this.sortDisabledFirst
        ? db - da
        : da - db;
    });
  }
}
