import {
  Barcode,
  Boxes,
  Database,
  BatteryCharging,
  Camera,
  Cctv,
  ClipboardCheck,
  Cpu,
  Fingerprint,
  Gauge,
  HardHat,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  Nfc,
  PackageSearch,
  QrCode,
  Radar,
  Route,
  ScanLine,
  ShieldAlert,
  Smartphone,
  Truck,
  Waves,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * What comes with each solution — the data behind `FaqKit`.
 *
 * Nothing here is new. The solution → module mapping is the FAQ's own answer
 * ("Choose IRDS for rack safety, MEPS for MHE productivity, RTSS for MHE
 * safety, IROS for inventory intelligence, IMDS for MHE diagnostics, ATOS for
 * task orchestration and AIMS for management visibility. The Digital Twin can
 * provide the common physical context underneath them" — `faq-data`, id
 * `which-product`). The hardware on each is what that module's platform page
 * already names:
 *
 *   IRDS   `rds/RdsIntegrations` — inspector mobile workflow, photo
 *          evidence, QR / asset identity, impact sensors, AI Vision; tablet
 *          capture from the IRDS source documents
 *   MEPS   the MEPS source document — OmniBox Motion, LiDAR, pallet
 *          detection sensor, operator authentication
 *   RTSS   `rts/RtsIntegrations` — AI Vision, impact sensors, LiDAR
 *   IROS   `iros/iros-data` — barcode / QR, RFID, vision / scanners, drone
 *          or AGV; ATOS from `inv/InvATOS`
 *   ATOS   `wex/WexReprioritisation` GPS tracker; `atos/AtsIntegrations`
 *          GPS / telematics, edge + IoT, location systems
 *   IMDS   `imd/ImdIntegrations`, `imd/ImdCapture` — telematics, RFID,
 *          CCTV, battery systems, impact sensors
 *   AIMS   `ams/AmsCapture`   the other modules' data, not devices
 *
 * If a platform page changes what it names, change it here too.
 */

export type KitItem = { icon: LucideIcon; label: string; tint: string };

export type Kit = {
  solution: string;
  /** what is connected — devices, and systems where the module says so */
  hardware: KitItem[];
  /** the platform modules it runs on */
  modules: KitItem[];
  note?: string;
};

const TWIN: KitItem = { icon: MapIcon, label: "Digital Twin", tint: "#3E63DD" };

export const KITS: Kit[] = [
  {
    solution: "Rack Safety",
    hardware: [
      { icon: Smartphone, label: "Tablet / mobile inspection", tint: "#6647F0" },
      { icon: QrCode, label: "QR asset tags", tint: "#299764" },
      { icon: Camera, label: "Photo evidence", tint: "#0091FF" },
      { icon: Zap, label: "Impact sensors", tint: "#E5484D" },
      { icon: Cctv, label: "AI Vision", tint: "#E93D82" },
    ],
    modules: [
      { icon: ClipboardCheck, label: "IRDS", tint: "#F76808" },
      TWIN,
    ],
    note: "A rack-inspection programme may use IRDS and inspection services; impact sensors are added where live damage alerts are wanted.",
  },
  {
    solution: "MHE Safety & Productivity",
    hardware: [
      { icon: Cpu, label: "OmniBox Motion", tint: "#F76808" },
      { icon: Radar, label: "LiDAR", tint: "#3E63DD" },
      { icon: Boxes, label: "Pallet detection sensor", tint: "#12A594" },
      { icon: Fingerprint, label: "Operator authentication", tint: "#AB4ABA" },
      { icon: Cctv, label: "AI Vision cameras", tint: "#E93D82" },
    ],
    modules: [
      { icon: Gauge, label: "MEPS", tint: "#F76808" },
      { icon: ShieldAlert, label: "RTSS", tint: "#E5484D" },
      TWIN,
    ],
  },
  {
    solution: "Inventory Intelligence",
    hardware: [
      { icon: Barcode, label: "Barcode / QR", tint: "#299764" },
      { icon: Nfc, label: "RFID", tint: "#6647F0" },
      { icon: ScanLine, label: "AI Vision / scanners", tint: "#0091FF" },
      { icon: Truck, label: "Drone / AGV", tint: "#E93D82" },
      { icon: Database, label: "WMS · ERP", tint: "#12A594" },
    ],
    modules: [
      { icon: PackageSearch, label: "IROS", tint: "#FFC53D" },
      { icon: Route, label: "ATOS", tint: "#F76808" },
      TWIN,
    ],
  },
  {
    solution: "Warehouse Execution",
    hardware: [
      { icon: MapPin, label: "GPS tracker / telematics", tint: "#12A594" },
      { icon: Waves, label: "Edge + IoT", tint: "#0091FF" },
      { icon: Radar, label: "Location systems", tint: "#AB4ABA" },
      { icon: Database, label: "WMS · ERP · TMS", tint: "#6647F0" },
    ],
    modules: [
      { icon: Route, label: "ATOS", tint: "#F76808" },
      TWIN,
    ],
  },
  {
    solution: "MHE Diagnostics",
    hardware: [
      { icon: Cpu, label: "Machine telematics", tint: "#12A594" },
      { icon: Nfc, label: "RFID", tint: "#6647F0" },
      { icon: Cctv, label: "CCTV", tint: "#E93D82" },
      { icon: BatteryCharging, label: "Battery systems", tint: "#299764" },
      { icon: Zap, label: "Impact sensors", tint: "#E5484D" },
    ],
    modules: [
      { icon: Wrench, label: "IMDS", tint: "#F76808" },
      TWIN,
    ],
  },
  {
    solution: "Management Intelligence",
    hardware: [
      { icon: ShieldAlert, label: "RTSS", tint: "#E5484D" },
      { icon: ClipboardCheck, label: "IRDS", tint: "#F76808" },
      { icon: HardHat, label: "MEPS & IMDS", tint: "#12A594" },
      { icon: PackageSearch, label: "ATOS & IROS", tint: "#FFC53D" },
    ],
    modules: [
      { icon: LayoutDashboard, label: "AIMS", tint: "#AB4ABA" },
      TWIN,
    ],
    note: "AIMS brings together the data of the modules already deployed — on the left here — rather than connecting devices of its own.",
  },
];
