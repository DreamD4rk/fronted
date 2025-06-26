import { Component, OnInit } from '@angular/core';
import { CreateUserDto, UpdateUserDto, User } from '../models/user';
import { UserService } from '../services/user.service';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'gestion-app',
  standalone: true,
  imports: [UserComponent, UserFormComponent, NavbarComponent],
  templateUrl: './gestion-app.component.html',
  styleUrl: './gestion-app.component.css'
})
export class GestionAppComponent implements OnInit {

  title: string = 'Lista de usuarios'
  users: User[] = [];
  userSelected!: User;
  isFormModalOpen = false;
  isEditMode = false;

  // Objeto para almacenar toda la información de paginación del backend.
  currentPage = 0;
  totalPages = 0;

  // Errores de validación del backend
  fieldErrors: Record<string, string> = {};

  // Toast control
  showAlert = false;
  lastUsername  = '';
  toastAction: 'creado' | 'actualizado' = 'creado';

  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router)
    {
        //this.userSelected = new User();
    }

  ngOnInit() {
      //this.service.findAll().subscribe(users => this.users = users);
      this.route.paramMap.subscribe((params) => {
        const p = +(params.get('page') ?? '0');
        console.log('Parámetro page =', p);
        this.currentPage = p;
        this.service.findAllPageable(p).subscribe((page) => {
          this.users = page.content;
          this.totalPages = page.totalPages;
          console.log('Backend respondió página', p, 'de', this.totalPages);
        });
      });
  }

  /* Método de ayuda para navegar a otra página (puedes usarlo en el template) */
  goToPage(p: number) {
  this.router.navigate(['/users/page', p]);
}

  /* Abre el modal para creación o edición */
  openFormModal(user?: User) {

    // Limpiamos cualquier error previo
    this.fieldErrors = {};
    this.isEditMode = !!user;
    this.userSelected = user ? { ...user }
    : (() => {
          const u = new User();
          u.role = { role: '', description: '' };
          return u;
        })();
    this.isFormModalOpen = true;
  }

  /* Crea o actualiza según el modo */
  handleSave(user: User) {

    // Limpiamos errores
    this.fieldErrors = {};

  if (this.isEditMode) {
    // construimos sólo el DTO de los 4 campos
    const dto: UpdateUserDto = {
      email: user.email,
      phone: user.phone,
      disabled: user.disabled,
      notes: user.notes || ''
    };
    // si estoy editando, llamo a update
      this.service.update(user.idUser!, dto).subscribe({
        next: (updated) => {
          // refresca tu lista o reemplaza el elemento editado

          this.users = this.users.map((u) =>
            u.idUser === updated.idUser ? updated : u
          );
          // Mostrar toast de éxito
          this.toastAction = 'actualizado';
          this.lastUsername = updated.username;
          this.showToast(6000);
          this.closeFormModal();
        },
        error: (err) => {
          // Atrapamos tanto 400 (bad request) como 409 (conflict)
          if (err.status === 400 && typeof err.error === 'object') {
            this.handleFieldErrors(err.error);
          } else if (err.status === 409 && err.error?.description) {
            // error de "correo ya en uso" -> lo metemos bajo la clave 'email'
            this.handleFieldErrors({ email: err.error.description });
          }
        },
      });
    } else {
    // CREACIÓN: solo enviamos el DTO
    const dto: CreateUserDto = {
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      phone:     user.phone,
      password:  user.password!,
      notes:     user.notes || '',
      role:      user.role.role as 'ADMIN' | 'EMPLOYEE',
    };

    this.service.create(dto).subscribe({
      next: created => {
       // Después de crear, recargamos la página. El nuevo usuario podría estar en otra página.
          this.users.push(created);
        // === TOAST ===
        this.toastAction   = 'creado';
        this.lastUsername  = created.username;
        this.showToast(6000);
        this.closeFormModal();
    },
    error: err => this.handleFieldErrors(err.error)
      });
    }
  }

  /* Muestra el toast de éxito durante 5s */
  private showToast(duration: number) {
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), duration);
  }

  /* Cierra el modal y limpia selección */
  closeFormModal() {
    this.isFormModalOpen = false;
    this.isEditMode = false;
    this.userSelected = new User();
  }

  /* Llena fieldErrors y auto-oculta tras 5s */
  private handleFieldErrors(errors: Record<string,string>) {
    this.fieldErrors = { ...errors };
    setTimeout(() => this.fieldErrors = {}, 5000);
  }

  /** Helpers para el template */
  hasFieldErrors(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }

  fieldErrorKeys(): string[] {
    return Object.keys(this.fieldErrors);
  }

  fieldLabel(key: string): string {
    const labels: Record<string,string> = {
      firstName: 'Nombre',
      lastName:  'Apellido',
      email:     'Correo',
      phone:     'Teléfono',
      disabled:  'Estado',
      notes:     'Notas'
    };
    return labels[key] ?? key;
  }

  /* Shortcut para abrir el modal en edición */
  setSelectedUser(user: User) {
    this.openFormModal(user);
  }

  /* Elimina de la lista (no de la base) */
  removeUser(username: string) {
    this.users = this.users.filter(user => user.username !== username);
  }

}

