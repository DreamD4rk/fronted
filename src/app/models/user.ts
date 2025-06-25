export class User {

    idUser!: number;
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    phone!: string;
    password!: string;
    disabled!: boolean;
    dateHired!: Date;
    notes!: string;
    role!: Role; 

    constructor(data?: Partial<User>) {
    if (data) {
        Object.assign(this, {
        ...data,
        // convierto la fecha de string a Date
        dateHired: data.dateHired ? new Date(data.dateHired) : undefined,
            });
        }
    }
}

export interface Role {
    role: string;
    description: string;
}

export interface UpdateUserDto {
  
  email: string;
  phone: string;
  disabled: boolean;
  notes: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  notes: string;
  role: 'ADMIN' | 'EMPLOYEE';
}