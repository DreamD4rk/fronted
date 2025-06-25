import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  @Input() user: User;
  @Input() isEditMode = false;
  @Input() apiErrors: Record<string, string> = {};
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {
    this.user = new User();
  }

  ngOnChanges(changes: SimpleChanges) {
    //this.isEditMode = !!this.user && !!this.user.idUser; // o usa tu lógica para saber si es edición
    // Modo edición
    this.isEditMode = !!this.user && !!this.user.idUser;

    // Si llegan errores nuevos, auto-hide after 5s
    if (changes['apiErrors'] && this.hasApiErrors()) {
      setTimeout(() => {
        this.apiErrors = {};
      }, 6000);
    }
  }

  fieldLabels: Record<string,string> = {
  firstName: 'Nombre',
  lastName:  'Apellido',
  email:     'Correo',
  phone:     'Teléfono',
  password:  'Contraseña',
  role:      'Rol',
  notes:     'Notas',
  disabled:  'Estado'
};

  /** Envía el formulario si es válido */
  onSubmit(userForm: NgForm) {
    if (userForm.valid) this.save.emit(this.user);
  }

  onCancel() {
    this.cancel.emit();
  }

  /** Indica si hay errores de backend */
  hasApiErrors(): boolean {
    return this.apiErrors && Object.keys(this.apiErrors).length > 0;
  }

  /** Claves de los campos con errores */
  apiErrorKeys(): string[] {
    return Object.keys(this.apiErrors || {});
  }

  fieldLabel(key: string): string {
  return this.fieldLabels[key] ?? key;
}
}
