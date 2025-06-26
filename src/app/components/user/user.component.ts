import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent{

  @Input() users: User[] = []
  @Input() currentPage = 0;
  @Input() totalPages = 0;

  @Output() pageChange   = new EventEmitter<number>();
  @Output() selectUser   = new EventEmitter<User>();
  @Output() deleteUser   = new EventEmitter<string>();

  onPrev() { this.pageChange.emit(this.currentPage - 1); }
  onGoto(page: number | '…') {
    if (page !== '…') {
      this.pageChange.emit(page);
    }
  }
  onNext() { this.pageChange.emit(this.currentPage + 1); }

  title: string = 'Lista de usuarios'  
  sortDisabledFirst = false;

  // Control del modal
  isDialogOpen = false;
  userToRemove?: string

  get paginationRange(): (number|'…')[] {
  const total = this.totalPages;
  if (total <= 4) {
    return Array.from({ length: total }, (_, i) => i);
  }
  return [0, 1, 2, '…', total - 1];
}

  /** Abre el modal pasando el username */
  openRemoveDialog(username: string): void {
    this.userToRemove = username;
    this.isDialogOpen = true;
  }

   /** Se invoca al confirmar dentro del modal */
  confirmRemove(): void {
    if (this.userToRemove) {
      //this.usernameEventEmitter.emit(this.userToRemove);
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
    //this.usernameEventEmitter.emit(username);
  }

  /** Selecciona al usuario */
  onSelectUser(user: User): void {
    this.selectUser.emit(user);
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
