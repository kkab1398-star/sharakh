// lib/professional-icons.ts
// Radix Icons: Professional Enterprise-level icons from Vercel

import {
  HomeIcon,
  PersonIcon,
  GearIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  Pencil2Icon,
  EyeOpenIcon,
  EyeClosedIcon,
  MagnifyingGlassIcon,
  BellIcon,
  LayoutIcon,
  BarChartIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  HamburgerMenuIcon,
  ExitIcon,
  QuestionMarkCircledIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CalendarIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  LockOpen1Icon,
  PaperPlaneIcon,
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DashboardIcon,
  TextIcon,
  ViewGridIcon,
  ListBulletIcon,
  CopyIcon,
  ReloadIcon,
  UpdateIcon,
  CaretUpIcon,
  CaretDownIcon,
  DownloadIcon,
  UploadIcon,
  HeartIcon,
  HeartFilledIcon,
  StarIcon,
  StarFilledIcon,
  Share1Icon,
  OpenInNewWindowIcon,
  FileIcon,
  AvatarIcon,
} from '@radix-ui/react-icons';

// Material Design Icons
import {
  Construction,
  Engineering,
  Handyman,
  Factory,
  LocalShipping,
  DirectionsCar,
  Build,
  Inventory2,
  Verified,
  Security,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
  Email,
  Download,
  Upload,
  Delete,
  Edit,
  Add,
  Remove,
  Search,
  CheckCircle,
  Cancel,
  Star,
  Favorite,
  Bookmark,
  Flag,
  Info,
  Help,
  Warning,
  MoreVert,
  MoreHoriz,
  Refresh,
  Menu,
  MenuOpen,
  Share,
  Person,
  People,
  PersonAdd,
  PersonRemove,
  Group,
  GroupAdd,
  AdminPanelSettings,
  VerifiedUser,
} from '@mui/icons-material';

// ═══════════════════════════════════════════════════════════════
// 🎯 Navigation Icons (احترافي 100%)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalNavIcons = {
  home: HomeIcon,
  profile: PersonIcon,
  settings: GearIcon,
  dashboard: DashboardIcon,
  reports: BarChartIcon,
  notifications: BellIcon,
  menu: HamburgerMenuIcon,
  logout: ExitIcon,
  layout: LayoutIcon,
  folder: FileIcon,
  folderOpen: FileIcon,
  file: FileIcon,
  grid: ViewGridIcon,
  list: ListBulletIcon,
  text: TextIcon,
} as const;

// ═══════════════════════════════════════════════════════════════
// 🏗️ Equipment Icons (احترافي للمعدات الثقيلة)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalEquipmentIcons = {
  construction: Construction,
  engineering: Engineering,
  tools: Handyman,
  factory: Factory,
  workshop: Factory,
  shipping: LocalShipping,
  truck: LocalShipping,
  car: DirectionsCar,
  build: Build,
  inventory: Inventory2,
  maintenance: Handyman,
} as const;

// ═══════════════════════════════════════════════════════════════
// 💰 Financial Icons (احترافي - مالي)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalFinanceIcons = {
  income: ArrowUpIcon,
  expense: ArrowDownIcon,
  transfer: DoubleArrowRightIcon,
  chart: BarChartIcon,
  trend: ArrowUpIcon,
  trendDown: ArrowDownIcon,
  document: TextIcon,
  invoice: TextIcon,
  wallet: StarIcon,
} as const;

// ═══════════════════════════════════════════════════════════════
// ✅ Action Icons (احترافي)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalActionIcons = {
  add: PlusIcon,
  remove: MinusIcon,
  delete: TrashIcon,
  edit: Pencil2Icon,
  view: EyeOpenIcon,
  hide: EyeClosedIcon,
  search: MagnifyingGlassIcon,
  copy: CopyIcon,
  refresh: ReloadIcon,
  update: UpdateIcon,
  download: DownloadIcon,
  upload: UploadIcon,
  share: Share1Icon,
  save: CheckIcon,
  cancel: ExclamationTriangleIcon,
} as const;

// ═══════════════════════════════════════════════════════════════
// ⚠️ Status Icons (احترافي)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalStatusIcons = {
  success: CheckIcon,
  error: ExclamationTriangleIcon,
  warning: ExclamationTriangleIcon,
  info: InfoCircledIcon,
  help: QuestionMarkCircledIcon,
  verified: Verified,
  security: Security,
} as const;

// ═══════════════════════════════════════════════════════════════
// 📝 Form Icons (احترافي)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalFormIcons = {
  email: EnvelopeClosedIcon,
  password: LockClosedIcon,
  calendar: CalendarIcon,
  clock: ClockIcon,
  lock: LockClosedIcon,
  unlock: LockOpen1Icon,
  visibility: EyeOpenIcon,
  visibilityOff: EyeClosedIcon,
} as const;

// ═══════════════════════════════════════════════════════════════
// 👥 User Icons (احترافي)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalUserIcons = {
  user: PersonIcon,
  users: People,
  userAdd: PersonAdd,
  userRemove: PersonRemove,
  group: Group,
  groupAdd: GroupAdd,
  admin: AdminPanelSettings,
  avatar: AvatarIcon,
} as const;

// ═══════════════════════════════════════════════════════════════
// 🔐 Security Icons (احترافي)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalSecurityIcons = {
  lock: LockClosedIcon,
  lockOpen: LockOpen1Icon,
  key: LockClosedIcon,
  security: Security,
  verified: VerifiedUser,
  visibility: EyeOpenIcon,
  visibilityOff: EyeClosedIcon,
} as const;

// ═══════════════════════════════════════════════════════════════
// 🔄 Navigation Controls (احترافي)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalNavControlsIcons = {
  next: ChevronRightIcon,
  prev: ChevronLeftIcon,
  up: CaretUpIcon,
  down: CaretDownIcon,
  arrowUp: ArrowUpIcon,
  arrowDown: ArrowDownIcon,
  forward: DoubleArrowRightIcon,
  backward: DoubleArrowLeftIcon,
} as const;

// ═══════════════════════════════════════════════════════════════
// 🎨 All Icons Map (للاستخدام العام)
// ═══════════════════════════════════════════════════════════════
export const ProfessionalIconsMap = {
  // Navigation
  ...ProfessionalNavIcons,
  // Equipment
  ...ProfessionalEquipmentIcons,
  // Finance
  ...ProfessionalFinanceIcons,
  // Actions
  ...ProfessionalActionIcons,
  // Status
  ...ProfessionalStatusIcons,
  // Forms
  ...ProfessionalFormIcons,
  // Users
  ...ProfessionalUserIcons,
  // Security
  ...ProfessionalSecurityIcons,
  // Navigation Controls
  ...ProfessionalNavControlsIcons,
} as const;

export type ProfessionalIconName = keyof typeof ProfessionalIconsMap;

// ═══════════════════════════════════════════════════════════════
// 🎯 Helper function للحصول على الأيقونة
// ═══════════════════════════════════════════════════════════════
export function getProfessionalIcon(name: ProfessionalIconName) {
  return ProfessionalIconsMap[name];
}
