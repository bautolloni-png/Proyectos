export type RolUsuario = "admin" | "miembro";

export type TipoPaso = "accion" | "decision";

export type ChecklistItem = {
  texto: string;
  completado: boolean;
};

export type Paso = {
  id: string;
  orden: number;
  titulo: string;
  descripcion: string;
  responsable: string;
  tipo: TipoPaso;
  siguiente_paso_id: string | null;
  pregunta?: string;
  rama_si?: string | null;
  rama_no?: string | null;
  checklist: ChecklistItem[];
};

export type Enlace = {
  titulo: string;
  url: string;
};

export type Archivo = {
  nombre: string;
  url: string;
};

export type Empresa = {
  id: string;
  nombre: string;
  logo_url: string | null;
  color_primario: string;
  color_acento: string;
  creado_en: string;
};

export type Usuario = {
  id: string;
  empresa_id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  creado_en: string;
};

export type Proceso = {
  id: string;
  empresa_id: string;
  nombre: string;
  descripcion: string;
  objetivo: string;
  responsable: string;
  pasos: Paso[];
  archivos: Archivo[];
  videos: string[];
  enlaces: Enlace[];
  observaciones: string;
  creado_por: string | null;
  creado_en: string;
  actualizado_en: string;
};

export type Database = {
  public: {
    Tables: {
      empresas: {
        Row: Empresa;
        Insert: Partial<Empresa> & { nombre: string };
        Update: Partial<Empresa>;
        Relationships: [];
      };
      usuarios: {
        Row: Usuario;
        Insert: Partial<Usuario> & {
          id: string;
          empresa_id: string;
          nombre: string;
          email: string;
        };
        Update: Partial<Usuario>;
        Relationships: [];
      };
      procesos: {
        Row: Proceso;
        Insert: Partial<Proceso> & { empresa_id: string; nombre: string };
        Update: Partial<Proceso>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
