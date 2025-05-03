import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types for our data
export type KPI = {
  id: string
  title: string
  value: number
  target: number
  unit: string
  change: number
  category: string
  isVisible: boolean
}

export type ProgressImage = {
  id: string
  title: string
  description: string
  date: string
  imageUrl: string
  category: string
  isVisible: boolean
}

export type Unit = {
  id: string
  number: string
  floor: number
  area: number
  bedrooms: number
  bathrooms: number
  price: number
  status: "available" | "reserved" | "sold"
  isVisible: boolean
}

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  lastLogin: string
  isActive: boolean
}

export type Document = {
  id: string
  title: string
  type: string
  uploadDate: string
  size: number
  url: string
  category: string
}

export type Notification = {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  date: string
  isRead: boolean
  recipients: string[]
}

export type AuditLog = {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
  ip: string
}

export type SystemStatus = {
  cpu: number
  memory: number
  disk: number
  uptime: number
  lastBackup: string
}

export type AppSettings = {
  siteName: string
  logoUrl: string
  primaryColor: string
  secondaryColor: string
  language: string
  dateFormat: string
  currencySymbol: string
  enableNotifications: boolean
  maintenanceMode: boolean
}

// Define the store state
interface StoreState {
  // Data
  kpis: KPI[]
  progressImages: ProgressImage[]
  units: Unit[]
  users: User[]
  documents: Document[]
  notifications: Notification[]
  auditLogs: AuditLog[]
  systemStatus: SystemStatus
  settings: AppSettings

  // Actions
  addKpi: (kpi: KPI) => void
  updateKpi: (id: string, data: Partial<KPI>) => void
  deleteKpi: (id: string) => void

  addProgressImage: (image: ProgressImage) => void
  updateProgressImage: (id: string, data: Partial<ProgressImage>) => void
  deleteProgressImage: (id: string) => void

  addUnit: (unit: Unit) => void
  updateUnit: (id: string, data: Partial<Unit>) => void
  deleteUnit: (id: string) => void

  addUser: (user: User) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void

  addDocument: (document: Document) => void
  updateDocument: (id: string, data: Partial<Document>) => void
  deleteDocument: (id: string) => void

  addNotification: (notification: Notification) => void
  updateNotification: (id: string, data: Partial<Notification>) => void
  deleteNotification: (id: string) => void

  addAuditLog: (log: AuditLog) => void

  updateSettings: (data: Partial<AppSettings>) => void

  resetStore: () => void
}

// Sample data
const initialKpis: KPI[] = [
  {
    id: "1",
    title: "Avance de Obra",
    value: 65,
    target: 100,
    unit: "%",
    change: 5,
    category: "construction",
    isVisible: true,
  },
  {
    id: "2",
    title: "Unidades Vendidas",
    value: 24,
    target: 50,
    unit: "",
    change: 2,
    category: "sales",
    isVisible: true,
  },
  {
    id: "3",
    title: "Presupuesto Utilizado",
    value: 4500000,
    target: 10000000,
    unit: "$",
    change: 500000,
    category: "financial",
    isVisible: true,
  },
  {
    id: "4",
    title: "Tiempo Restante",
    value: 120,
    target: 365,
    unit: "días",
    change: -5,
    category: "timeline",
    isVisible: true,
  },
]

const initialProgressImages: ProgressImage[] = [
  {
    id: "1",
    title: "Construcción de Estructura",
    description: "Avance en la construcción de la estructura principal del edificio",
    date: "2023-10-15",
    imageUrl: "/building-under-construction.png",
    category: "structure",
    isVisible: true,
  },
  {
    id: "2",
    title: "Instalación de Fachada",
    description: "Proceso de instalación de la fachada exterior",
    date: "2023-11-20",
    imageUrl: "/building-facade-installation.png",
    category: "exterior",
    isVisible: true,
  },
  {
    id: "3",
    title: "Acabados Interiores",
    description: "Trabajos de acabados en áreas comunes",
    date: "2023-12-05",
    imageUrl: "/modern-office.png",
    category: "interior",
    isVisible: true,
  },
]

const initialUnits: Unit[] = [
  {
    id: "1",
    number: "101",
    floor: 1,
    area: 85,
    bedrooms: 2,
    bathrooms: 2,
    price: 250000,
    status: "available",
    isVisible: true,
  },
  {
    id: "2",
    number: "102",
    floor: 1,
    area: 75,
    bedrooms: 1,
    bathrooms: 1,
    price: 180000,
    status: "reserved",
    isVisible: true,
  },
  {
    id: "3",
    number: "201",
    floor: 2,
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    price: 350000,
    status: "sold",
    isVisible: true,
  },
  {
    id: "4",
    number: "202",
    floor: 2,
    area: 90,
    bedrooms: 2,
    bathrooms: 2,
    price: 270000,
    status: "available",
    isVisible: true,
  },
  {
    id: "5",
    number: "301",
    floor: 3,
    area: 150,
    bedrooms: 3,
    bathrooms: 3,
    price: 450000,
    status: "available",
    isVisible: true,
  },
]

const initialUsers: User[] = [
  {
    id: "1",
    name: "Admin Usuario",
    email: "admin@ejemplo.com",
    role: "admin",
    lastLogin: "2023-12-20T10:30:00",
    isActive: true,
  },
  {
    id: "2",
    name: "Editor Usuario",
    email: "editor@ejemplo.com",
    role: "editor",
    lastLogin: "2023-12-19T14:45:00",
    isActive: true,
  },
  {
    id: "3",
    name: "Visualizador Usuario",
    email: "viewer@ejemplo.com",
    role: "viewer",
    lastLogin: "2023-12-18T09:15:00",
    isActive: true,
  },
]

const initialDocuments: Document[] = [
  {
    id: "1",
    title: "Planos Arquitectónicos",
    type: "pdf",
    uploadDate: "2023-09-10",
    size: 2500000,
    url: "#",
    category: "plans",
  },
  {
    id: "2",
    title: "Contrato de Compraventa",
    type: "docx",
    uploadDate: "2023-10-05",
    size: 350000,
    url: "#",
    category: "legal",
  },
  {
    id: "3",
    title: "Cronograma de Obra",
    type: "xlsx",
    uploadDate: "2023-11-15",
    size: 500000,
    url: "#",
    category: "schedule",
  },
]

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Actualización de Avance",
    message: "El avance de obra ha alcanzado el 65%",
    type: "info",
    date: "2023-12-18T09:00:00",
    isRead: false,
    recipients: ["all"],
  },
  {
    id: "2",
    title: "Alerta de Presupuesto",
    message: "El presupuesto ha superado el 45% del total asignado",
    type: "warning",
    date: "2023-12-17T14:30:00",
    isRead: true,
    recipients: ["admin"],
  },
]

const initialAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "Inicio de sesión",
    user: "admin@ejemplo.com",
    timestamp: "2023-12-20T10:30:00",
    details: "Inicio de sesión exitoso",
    ip: "192.168.1.1",
  },
  {
    id: "2",
    action: "Actualización de KPI",
    user: "editor@ejemplo.com",
    timestamp: "2023-12-19T15:45:00",
    details: 'Actualización del KPI "Avance de Obra" de 60% a 65%',
    ip: "192.168.1.2",
  },
  {
    id: "3",
    action: "Cambio de estado de unidad",
    user: "admin@ejemplo.com",
    timestamp: "2023-12-18T11:20:00",
    details: 'Cambio de estado de la unidad 102 de "available" a "reserved"',
    ip: "192.168.1.1",
  },
]

const initialSystemStatus: SystemStatus = {
  cpu: 25,
  memory: 40,
  disk: 35,
  uptime: 15.5,
  lastBackup: "2023-12-19T02:00:00",
}

const initialSettings: AppSettings = {
  siteName: "Proyecto Inmobiliario Dashboard",
  logoUrl: "/logo.png",
  primaryColor: "#3b82f6",
  secondaryColor: "#10b981",
  language: "es",
  dateFormat: "DD/MM/YYYY",
  currencySymbol: "$",
  enableNotifications: true,
  maintenanceMode: false,
}

// Create the store
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      kpis: initialKpis,
      progressImages: initialProgressImages,
      units: initialUnits,
      users: initialUsers,
      documents: initialDocuments,
      notifications: initialNotifications,
      auditLogs: initialAuditLogs,
      systemStatus: initialSystemStatus,
      settings: initialSettings,

      // KPI actions
      addKpi: (kpi) =>
        set((state) => ({
          kpis: [...state.kpis, kpi],
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Creación de KPI",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Creación del KPI "${kpi.title}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      updateKpi: (id, data) =>
        set((state) => ({
          kpis: state.kpis.map((kpi) => (kpi.id === id ? { ...kpi, ...data } : kpi)),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Actualización de KPI",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Actualización del KPI con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      deleteKpi: (id) =>
        set((state) => ({
          kpis: state.kpis.filter((kpi) => kpi.id !== id),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Eliminación de KPI",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Eliminación del KPI con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      // Progress Image actions
      addProgressImage: (image) =>
        set((state) => ({
          progressImages: [...state.progressImages, image],
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Carga de imagen",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Carga de imagen "${image.title}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      updateProgressImage: (id, data) =>
        set((state) => ({
          progressImages: state.progressImages.map((image) => (image.id === id ? { ...image, ...data } : image)),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Actualización de imagen",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Actualización de la imagen con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      deleteProgressImage: (id) =>
        set((state) => ({
          progressImages: state.progressImages.filter((image) => image.id !== id),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Eliminación de imagen",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Eliminación de la imagen con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      // Unit actions
      addUnit: (unit) =>
        set((state) => ({
          units: [...state.units, unit],
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Creación de unidad",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Creación de la unidad "${unit.number}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      updateUnit: (id, data) =>
        set((state) => ({
          units: state.units.map((unit) => (unit.id === id ? { ...unit, ...data } : unit)),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Actualización de unidad",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Actualización de la unidad con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      deleteUnit: (id) =>
        set((state) => ({
          units: state.units.filter((unit) => unit.id !== id),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Eliminación de unidad",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Eliminación de la unidad con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      // User actions
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Creación de usuario",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Creación del usuario "${user.email}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, ...data } : user)),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Actualización de usuario",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Actualización del usuario con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Eliminación de usuario",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Eliminación del usuario con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      // Document actions
      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, document],
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Carga de documento",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Carga del documento "${document.title}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      updateDocument: (id, data) =>
        set((state) => ({
          documents: state.documents.map((document) => (document.id === id ? { ...document, ...data } : document)),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Actualización de documento",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Actualización del documento con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((document) => document.id !== id),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Eliminación de documento",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Eliminación del documento con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      // Notification actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Creación de notificación",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Creación de la notificación "${notification.title}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      updateNotification: (id, data) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, ...data } : notification,
          ),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Actualización de notificación",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Actualización de la notificación con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Eliminación de notificación",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Eliminación de la notificación con ID "${id}"`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      // Audit log actions
      addAuditLog: (log) =>
        set((state) => ({
          auditLogs: [log, ...state.auditLogs],
        })),

      // Settings actions
      updateSettings: (data) =>
        set((state) => ({
          settings: { ...state.settings, ...data },
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Actualización de configuración",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: `Actualización de la configuración del sistema`,
              ip: "192.168.1.1",
            },
            ...state.auditLogs,
          ],
        })),

      // Reset store
      resetStore: () =>
        set({
          kpis: initialKpis,
          progressImages: initialProgressImages,
          units: initialUnits,
          users: initialUsers,
          documents: initialDocuments,
          notifications: initialNotifications,
          auditLogs: [
            {
              id: Date.now().toString(),
              action: "Reinicio del sistema",
              user: "admin@ejemplo.com",
              timestamp: new Date().toISOString(),
              details: "Reinicio completo de los datos del sistema",
              ip: "192.168.1.1",
            },
            ...initialAuditLogs,
          ],
          systemStatus: initialSystemStatus,
          settings: initialSettings,
        }),
    }),
    {
      name: "real-estate-dashboard-storage",
    },
  ),
)
